

var idCounter = 1;
var conditionId = 1;

var factor = 1;

(function loop() {
    var rand = Math.ceil(Math.random() * (3000 + 500*factor )) + (1000 * factor);
    if(factor <  40)factor+= factor ;

    setTimeout(function() {
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

function randomizeDominating(){
    var existsUnfinished = false;

    conditionsData.forEach(function (item) {
        if (item.status == 'ongoing') {
            existsUnfinished = true;
        }
    });

    if(existsUnfinished === false){
        //console.log("There is no conditions ongoing at the moment");
        return true;
    } else{
        //console.log("1 or more conditions are ongoing at the time");
        var random = Math.random();
        if(random < 0.5){
            //console.log("50% of the chance that current is dominating");
            return true;
        }
    }
    //console.log("Do not select current as dominant");
    return false;
}

setInterval(function () {
   if(currentConditionObject && currentConditionObject.status && currentConditionObject.status ==='finished'){

       //console.log("Current condition is finished, either switch to other unfinished or fade this: " + currentConditionObject.id);

       var existsUnfinished = 0;
       conditionsData.forEach(function (item) {
           if (item.status ==='ongoing') {
               //console.log("Exists other unfinished: " + item.title + " with id: " + item.id);
               existsUnfinished = item.id;
           }
       });

       if(currentConditionId !==0){
           //console.log("Current has finished, faking the selection of: " + existsUnfinished);
           updateSelected(existsUnfinished);
       }
   }
}, 1000);

/**
 * ADD new Condition
 */
function generateNewCondition () {

    var id = conditionId++;

    //uncomment if you want manual selection]

    if(randomizeDominating())updateSelected(id);


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
    var random = Math.random() * 15000;

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
    }, random)
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

const sampleConditions = [{
    title: "Deadtime during run", description: "There is deadtime during running",
    action: ["Issue a TTCHardReset", "If DAQ is still stuck after a few seconds issue another TTCHardReset", "Problem fixed: Make an e-log entry", "Problem not fixed: Try to recover"]
},
    {
        title: "FED deadtime", description: "Deadtime of fed(s) 853 in subsystem(s) CSC is greater than 5.0%",
        action: ["Issue a TTCHardReset", "If DAQ is still stuck after a few seconds issue another TTCHardReset", "Problem fixed: Make an e-log entry", "Problem not fixed: Try to recover"]

    },
    {
        title: "Partition deadtime",
        description: "Deadtime of partition(s) CSC- in subsystem(s) CSC is greater than 5.0%",
        action: [ "Stop the run", "Red & green recycle the subsystem", "Problem still not fixed: Call the doc of the subsystem"]

    },
    {
        title: "Warning in subsystem",
        description: "TTCP CSC+ of CSC subsystem is in warning 50.01877, it may affect rate.",
        action: ["Issue a TTCHardReset once", "Problem fixed: make an e-log entry", "problem not fixed: Stop the run", "Problem still not fixed: Red recycle the subsystem"]

    },
    {
        title: "Corrupted data received",
        description: "Run blocked by corrupted data from FED 622 received by RU ru-c2e14-29-01.cms which is now in failed state. Problem FED belongs to partition EB- in ECAL subsystem This causes backpressure at FED 1386 in partition MUTFUP of TRG",
        action: [ "Stop the run", "Red & green recycle the subsystem", "Problem still not fixed: Call the doc of the subsystem"]
    },
    {
        title: "Fed stuck",
        description: "TTCP EB+ of ECAL subsystem is blocking trigger, it's in BUSY TTS state, The problem is caused by FED 632 in BUSY",
        action: ["Issue a TTCHardReset once", "Problem fixed: make an e-log entry", "problem not fixed: Stop the run", "Problem still not fixed: Red recycle the subsystem"]

    },
    {
        title: "Rate too high",
        description: "The readout rate is 106552.0 Hz which is above the expected maximum 100000.0 Hz. This may be a problem with the L1 trigger.",
        action: ["Ask the trigger shifter to check the inputs to the L1 trigger", "Make an e-log entry"]
    },
]

const sampleUpdatedConditions = [{
    title: "Deadtime during run",
    description: "There is <<critical>> deadtime during running"
},
    {
        title: "FED deadtime",
        description: "Deadtime of fed(s) <<853>> in subsystem(s) <<CSC>> is greater than <<5.0%>>"
    },
    {
        title: "Partition deadtime",
        description: "Deadtime of partition(s) <<CSC+>> in subsystem(s) <<CSC>> is greater than <<5.0%>>"
    },
    {
        title: "Warning in subsystem",
        description: "TTCP <<CSC->> of CSC subsystem is in warning <<80>>, it may affect rate."
    },
    {
        title: "Corrupted data received",
        description: "Run blocked by corrupted data from FED <<632>> received by RU ru-c2e14-29-01.cms which is now in failed state. Problem FED belongs to partition <<EB+>> in ECAL subsystem This causes backpressure at FED 1386 in partition MUTFUP of TRG"
    },
    {
        title: "Fed stuck",
        description: "TTCP EB+ of ECAL subsystem is blocking trigger, it's in BUSY TTS state, The problem is caused by FED <<622>> in <<WARNING>>"
    },
    {
        title: "Rate too high",
        description: "The readout rate is <<119382.0 Hz>> which is above the expected maximum 100000.0 Hz. This may be a problem with the L1 trigger."
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

