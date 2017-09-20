var idCounter = 1;
var conditionId = 1;

var factor = 1;

(function loop() {
    var rand = Math.ceil(Math.random() * (3000 + 500 * factor )) + (1000 * factor);
    if (factor < 40) factor += factor;

    setTimeout(function () {
        //alert('A');
        generateNewCondition();
        loop();
    }, rand);
}());


/**
 * Add new Event
 */
setInterval(function () {
    var newData = [{
        id: idCounter++,
        title: sampleEvents[idCounter % 10].title,
        description: sampleEvents[idCounter % 10].description,
        sound: sampleEvents[idCounter % 10].sound,
        tts: sampleEvents[idCounter % 10].tts,
        timestamp: moment().toISOString()
    }];
    newEventsDataArrived(newData);
}, 1800);


/**
 * ADD new Critical Condition
 */
/*setInterval(function () {

 var selected = conditionId;

 conditionsData.forEach(function (item) {
 if (item.id == selected) {
 updateSelected(selected);
 }
 });


 }, 2910);*/

function randomizeDominating() {
    var existsUnfinished = false;

    conditionsData.forEach(function (item) {
        if (item.status == 'ongoing') {
            existsUnfinished = true;
        }
    });

    if (existsUnfinished === false) {
        //console.log("There is no conditions ongoing at the moment");
        return true;
    } else {
        //console.log("1 or more conditions are ongoing at the time");
        var random = Math.random();
        if (random < 0.5) {
            //console.log("50% of the chance that current is dominating");
            return true;
        }
    }
    //console.log("Do not select current as dominant");
    return false;
}

setInterval(function () {
    if (currentConditionObject && currentConditionObject.status && currentConditionObject.status === 'finished') {

        //console.log("Current condition is finished, either switch to other unfinished or fade this: " + currentConditionObject.id);

        var existsUnfinished = 0;
        conditionsData.forEach(function (item) {
            if (item.status === 'ongoing') {
                //console.log("Exists other unfinished: " + item.title + " with id: " + item.id);
                existsUnfinished = item.id;
            }
        });

        if (currentConditionId !== 0) {
            //console.log("Current has finished, faking the selection of: " + existsUnfinished);
            updateSelected(existsUnfinished);
        }
    }
}, 1000);

/**
 * ADD new Condition
 */
function generateNewCondition() {

    var id = conditionId++;

    //uncomment if you want manual selection]

    if (randomizeDominating()) updateSelected(id);


    var newData = [{
        id: id,
        title: sampleConditions[id % 7].title,
        description: sampleConditions[id % 7].description,
        action: sampleConditions[id % 7].action,
        status: "ongoing",
        duration: 0,
        announced: false,
        timestamp: moment().toISOString()
    }];
    newConditionsDataArrived(newData);
    randomizeUpdate(id);


}

/**
 * ADD new version message
 */
setInterval(function () {
    newVersionDataArrived(sampleVersionMessage[idCounter % 3].version);

}, 6000);

/**
 *
 * Update Condition after random time
 */
function randomizeUpdate(id) {
    var random = 1500 + Math.random() * 15000;

    setTimeout(function () {
        var updateData = {
            id: id,
            status: "finished",
        };
        newUpdateDataArrived(updateData);
    }, 2 * random)

    setTimeout(function () {
        var updateData = {
            id: id,
            description: sampleUpdatedConditions[id % 7].description,
        };
        newUpdateDataArrived(updateData);
    }, random * 0.3)

    setTimeout(function () {
        var updateData = {
            id: id,
            description: sampleUpdatedConditions2[id % 7].description,
        };
        newUpdateDataArrived(updateData);
    }, random * 0.6)

    setTimeout(function () {
        var updateData = {
            id: id,
            description: sampleUpdatedConditions[id % 7].description,
        };
        newUpdateDataArrived(updateData);
    }, random * 0.8)

    setTimeout(function () {
        var updateData = {
            id: id,
            description: sampleUpdatedConditions2[id % 7].description,
        };
        newUpdateDataArrived(updateData);
    }, random * 1.1)

    setTimeout(function () {
        var updateData = {
            id: id,
            description: sampleUpdatedConditions[id % 7].description,
        };
        newUpdateDataArrived(updateData);
    }, random * 1.4)

    setTimeout(function () {
        var updateData = {
            id: id,
            description: sampleUpdatedConditions2[id % 7].description,
        };
        newUpdateDataArrived(updateData);
    }, random * 1.8)
}


const sampleEvents = [{
    title: "Started: Run ongoing",
    description: "Run is ongoing according to TCDS state",
    tts: "Run ongoing!"
},
    {title: "TCDS State: Running", description: "New TCDS state identified"},
    {title: "Level Zero State: Running", description: "New Level zero state identified"},
    {title: "DAQ state: Running", description: "New DAQ state identified", sound: "magic.wav"},
    {title: "DAQ state: Starting", description: "New DAQ state identified"},
    {title: "Level Zero State: Starting", description: "New Level zero state identified"},
    {title: "Level Zero State: Recovering", description: "New Level zero state identified"},
    {title: "Level Zero State: Undefined", description: "New Level zero state identified"},
    {title: "Run: 302492", description: "New run has been identified", sound: "alert.wav", tts: "New run started!"},
    {title: "TCDS State: Configured", description: "New TCDS state identified"},];

const sampleConditions = [


    {
        title: "Deadtime during run",
        description: "There is <<99.8%>> deadtime during run.",
    },
    {
        title: "FED deadtime",
        description: "Deadtime of fed(s) 853 in subsystem(s) CSC is <<25.1%>> the threshold is 5.0%",
    },
    {
        title: "Partition deadtime",
        description: "Deadtime of partition(s) CSC- in subsystem(s) CSC is <<25.1%>> the threshold is 5.0%",
    },
    {
        title: "Warning in subsystem",
        description: "TTCP CSC+ of CSC subsystem is in warning <<50.7%>>, it may affect rate.",
    },
    {
        title: "Corrupted data received",
        description: "Run blocked by corrupted data from FED 622 received by RU ru-c2e14-29-01.cms which is now in failed state. Problem FED belongs to partition EB- in ECAL subsystem This causes backpressure at FED 1386 in partition MUTFUP of TRG",
        action: ["Try a stop/start for ECAL", "If this doesn't help: Stop the run. Red & Green recycle both the DAQ and the subsystem ECAL. Start new Run.", "Problem fixed: Make an e-log entry. Call the DOC of ECAL (subsystem that sent corrupted data) to inform about the problem", "Problem not fixed: Call the DOC of ECAL (subsystem that sent corrupted data)"]
    },
    {
        title: "Fed stuck",
        description: "TTCP EB+ of ECAL subsystem is blocking trigger, it's in BUSY TTS state, The problem is caused by FED 632 in BUSY",
        action: ["Stop the run", "Red & green recycle the subsystem ECAL", "Start new run (try up to 2 times)", "Problem fixed: Make an e-log entry. Call the DOC of the subsystem ECAL to inform", "Problem not fixed: Call the DOC for the subsystem ECAL"]

    },
    {
        title: "Readout rate too high",
        description: "The readout rate is 106552.0 Hz which is above the expected maximum 100000.0 Hz. This may be a problem with the L1 trigger.",
        action: ["Ask the trigger shifter to check the inputs to the L1 trigger", "Make an e-log entry"]
    },
]

const sampleUpdatedConditions = [
    {
        title: "Deadtime during run",
        description: "There is <<(**curr:**99.9**%**,**avg:**99.7**%**,**max:**100.0**%**,**min:**99.5**%**)>> deadtime during run.",
    },
    {
        title: "FED deadtime",
        description: "Deadtime of fed(s) 853 in subsystem(s) CSC is <<(**curr:**85.1**%**,**avg:**98.6**%**,**max:**100.0**%**,**min:**22.5**%**)>> the threshold is 5.0%",
    },
    {
        title: "Partition deadtime",
        description: "Deadtime of partition(s) CSC- in subsystem(s) CSC is <<(**curr:**75.7**%**,**avg:**99.2**%**,**max:**100.0**%**,**min:**25.1**%**)>> the threshold is 5.0%",
    },
    {
        title: "Warning in subsystem",
        description: "TTCP CSC+ of CSC subsystem is in warning <<(**curr:**97.1**%**,**avg:**95.1**%**,**max:**100.0**%**,**min:**50.7**%**)>>, it may affect rate.",
    },
    {
        title: "Corrupted data received",
        description: "Run blocked by corrupted data from FED 622 received by RU ru-c2e14-29-01.cms which is now in failed state. Problem FED belongs to partition EB- in ECAL subsystem This causes backpressure at FED 1386 in partition MUTFUP of TRG",
        action: ["Try a stop/start for ECAL", "If this doesn't help: Stop the run. Red & Green recycle both the DAQ and the subsystem ECAL. Start new Run.", "Problem fixed: Make an e-log entry. Call the DOC of ECAL (subsystem that sent corrupted data) to inform about the problem", "Problem not fixed: Call the DOC of ECAL (subsystem that sent corrupted data)"]
    },
    {
        title: "Fed stuck",
        description: "TTCP EB+ of ECAL subsystem is blocking trigger, it's in BUSY TTS state, The problem is caused by FED 632 in BUSY",
        action: ["Stop the run", "Red & green recycle the subsystem ECAL", "Start new run (try up to 2 times)", "Problem fixed: Make an e-log entry. Call the DOC of the subsystem ECAL to inform", "Problem not fixed: Call the DOC for the subsystem ECAL"]

    },
    {
        title: "Readout rate too high",
        description: "The readout rate is <<(**curr:**110012.6**Hz**,**avg:**109156.2 **Hz**,**max:**116374.2 **Hz**,**min:**106552.0 **Hz**)>> which is above the expected maximum 100000.0 Hz. This may be a problem with the L1 trigger.",
        action: ["Ask the trigger shifter to check the inputs to the L1 trigger", "Make an e-log entry"]
    },
]


const sampleUpdatedConditions2 = [
    {
        title: "Deadtime during run",
        description: "There is <<(**curr:**99.5**%**,**avg:**99.6**%**,**max:**100.0**%**,**min:**99.5**%**)>> deadtime during run.",
    },
    {
        title: "FED deadtime",
        description: "Deadtime of fed(s) 853 in subsystem(s) CSC is <<(**curr:**86.9**%**,**avg:**98.5**%**,**max:**100.0**%**,**min:**22.5**%**)>> the threshold is 5.0%",
    },
    {
        title: "Partition deadtime",
        description: "Deadtime of partition(s) CSC- in subsystem(s) CSC is <<(**curr:**78.3**%**,**avg:**99.1**%**,**max:**100.0**%**,**min:**25.1**%**)>> the threshold is 5.0%",
    },
    {
        title: "Warning in subsystem",
        description: "TTCP CSC+ of CSC subsystem is in warning <<(**curr:**96.3**%**,**avg:**95.0**%**,**max:**100.0**%**,**min:**50.7**%**)>>, it may affect rate.",
    },
    {
        title: "Corrupted data received",
        description: "Run blocked by corrupted data from FED 622 received by RU ru-c2e14-29-01.cms which is now in failed state. Problem FED belongs to partition EB- in ECAL subsystem This causes backpressure at FED 1386 in partition MUTFUP of TRG",
        action: ["Try a stop/start for ECAL", "If this doesn't help: Stop the run. Red & Green recycle both the DAQ and the subsystem ECAL. Start new Run.", "Problem fixed: Make an e-log entry. Call the DOC of ECAL (subsystem that sent corrupted data) to inform about the problem", "Problem not fixed: Call the DOC of ECAL (subsystem that sent corrupted data)"]
    },
    {
        title: "Fed stuck",
        description: "TTCP EB+ of ECAL subsystem is blocking trigger, it's in BUSY TTS state, The problem is caused by FED 632 in BUSY",
        action: ["Stop the run", "Red & green recycle the subsystem ECAL", "Start new run (try up to 2 times)", "Problem fixed: Make an e-log entry. Call the DOC of the subsystem ECAL to inform", "Problem not fixed: Call the DOC for the subsystem ECAL"]

    },
    {
        title: "Readout rate too high",
        description: "The readout rate is <<(**curr:**110108.4**Hz**,**avg:**109156.3 **Hz**,**max:**116374.2 **Hz**,**min:**106552.0 **Hz**)>> which is above the expected maximum 100000.0 Hz. This may be a problem with the L1 trigger.",
        action: ["Ask the trigger shifter to check the inputs to the L1 trigger", "Make an e-log entry"]
    },
]



const sampleVersionMessage = [{
    version: "1.0.0"
}, {
    version: "1.0.1"
}, {
    version: "1.0.2"
}
]

