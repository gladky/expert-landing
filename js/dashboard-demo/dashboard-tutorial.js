var currentStep = 0;

var conditionId = 0;

var eventId = 100;


function step(step){

    if(step.type == "event"){
        console.log("Processing event");
        eventsData.push.apply(eventsData, prepareEvent( step.body));



    } else if (step.type == "condition"){
        conditionId++;
        console.log("Adding condition with id " + conditionId);
        conditionsData.push.apply(conditionsData, prepareCondition(step.body, conditionId));

        if(step.autodominate == true){
            console.log("Auto dominate " + conditionId);
            updateSelected(conditionId);
        }

    } else if (step.type == "update"){
        console.log("Processing Condition Update with id " + conditionId );

        if(step.offset){
            console.log("With offset");
            step.body.id = conditionId + step.offset;
        }else{
            step.body.id  = conditionId ;
        }
        newUpdateDataArrived(step.body);


    }else if (step.type == "dominating"){
        console.log("Processing dominating");
        updateSelected(step.body);

    }
    renderApp();
}

function prepareCondition(content){

    var condition = [{
                id: conditionId,
                title: content.title,
                description: content.description,
                action: content.action,
                announced: false,
                timestamp: moment(),
            }];
    return condition;
}


function prepareEvent(content){
    var newData = [{
        id: eventId++,
        title: content.title,
        description: content.description,
        sound: content.sound,
        tts: content.tts,
        timestamp: moment().toISOString()
    }];
    return newData; //newEventsDataArrived(newData);
}


$( document ).ready(function() {
    console.log( "ready!" );
    $('#info').html(demoSteps[currentStep].short);
    $('#next-step').on('click', function(event) {
        //alert( "Next step called." );

        step(demoSteps[currentStep]);

        currentStep++;

        if(currentStep < demoSteps.length) {
            $('#info').html(demoSteps[currentStep].short);
        } else{
            $('#info').html("No more demo steps, reload to start over");
            $('#next-step').disable(true);
        }
    });


    //
    // for(var i = 0; i < 0; i++)
    // {
    //     var newData = [{
    //         id: idCounter++,
    //         title: sampleEvents[idCounter % 10].title,
    //         description: sampleEvents[idCounter % 10].description,
    //         sound: sampleEvents[idCounter % 10].sound,
    //         tts: sampleEvents[idCounter % 10].tts,
    //         timestamp: moment().toISOString()
    //     }];
    //     eventsData.push.apply(eventsData, newData);
    // }
    //
    // for(var i = 0; i < 50; i++)
    // {
    //     var newData = [{
    //         id: conditionId++,
    //         title: sampleConditions[conditionId % 7].title,
    //         description: sampleConditions[conditionId % 7].description,
    //         action: sampleConditions[conditionId % 7].action,
    //         status: "finished",
    //         announced: false,
    //         timestamp: moment().subtract('minutes', 100-conditionId).toISOString(),
    //         duration: (Math.random()*5000/ 100).toPrecision(2)
    //     }];
    //     conditionsData.push.apply(conditionsData, newData);
    // }


});



const demoSteps = [
    {short: "New Event", type: "event", body: {title: "TCDS State: Running", description: "New TCDS state identified"}},
    {short: "Event with sound in CR", type: "event", body: {title: "DAQ state: Running", description: "New DAQ state identified", sound: "magic.wav"}},
    {short: "Spoken message in CR", type: "event", body: {title: "Run: 302492", description: "New run has been identified", sound: "alert.wav", tts: "New run started!"}},


    {short: "New Condition", type: "condition", autodominate: true, body: {
        title: "FED deadtime",
        description: "Deadtime of fed(s) 853 in subsystem(s) CSC is <strong>22.5%</strong> the threshold is 5.0%",
    },},
    {short: "Condition update", type: "update", body: {
        title: "FED deadtime",
        description: "Deadtime of fed(s) 853 in subsystem(s) CSC is <strong>(<sub><sup> last: </sub></sup>85.1%,<sub><sup> avg: </sub></sup>98.6%,<sub><sup> max: </sub></sup>100.0%,<sub><sup> min: </sub></sup>22.5%)</strong> the threshold is 5.0%",
    },},

    {short: "Another Condition", type: "condition", autodominate: false, body: {
        title: "Deadtime during run",
        description: "There is <strong>99.8%</strong> deadtime during run.",
    },},

    {short: "Condition finish", type: "update", body: {status:"finished"},  offset:0},
    {short: "Condition finish", type: "update", body: {status:"finished"},  offset:-1},

    {short: "New Condition", type: "condition", autodominate: true, body: {
        title: "Partition deadtime",
        description: "Deadtime of partition(s) CSC- in subsystem(s) CSC is <strong>25.1%</strong> the threshold is 5.0%",
    },},


    {short: "More important condition", type: "condition", autodominate: true, body: {
        title: "Fed stuck",
        description: "TTCP EB+ of ECAL subsystem is blocking trigger, it's in BUSY TTS state, The problem is caused by FED 632 in BUSY",
        action: ["Stop the run", "Red & green recycle the <strong>ECAL</strong>", "Start new run (try up to 2 times)", "Problem fixed: Make an e-log entry. Call the DOC of the subsystem ECAL to inform", "Problem not fixed: Call the DOC for the subsystem ECAL"]

    },},



];

