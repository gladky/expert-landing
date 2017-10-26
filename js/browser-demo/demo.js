/**
 * Created by mgl on 16.10.17.
 */

function loadSampleRawData(url) {

    $.getJSON(url, function (json) {
        //console.log("Data loaded: " + JSON.stringify(json));
        rawload(json);
    });
}

function loadSampleReasonData(url) {

    $.getJSON(url, function (data) {
        //console.log("Data loaded: " + JSON.stringify(json));
        load(data['entries'], data['fake-end']);
    });
}


$(document).ready(function () {
    console.log("loading demo data!");
    loadSampleRawData('json/browser-demo/raw.json');

    loadSampleReasonData('json/browser-demo/reasons.json');


    // console.log( "getting reasons.json" );
    // var reason = loadSampleData('json/browser-demo/reasons.json');
    // console.log( "sending data to chart" );
    // load(reason,moment());
    // console.log( "chart is loaded" );
});

// try to get rid of this
const groupMapping = ["lhc-beam", "lhc-machine", "beam-active", "no-rate", "dt", "deadtime", "critical-deadtime", "feddead", "partition-dead", "adt", "rate-oor", "warning", "nrwe", "run-no", "expected", "run-on", "transition", "session-no", "flowchart", "level-zero", "tcds", "daq-state", "experimental", "other", "ssdegraded", "ss-soft-err", "ss-err", "ver", "hidden"];
const priorityMapping = ["filtered", "filtered-important", "experimental", "default", "important", "warning", "critical"];

function loadFromStubServer(requestedStart, requestedEnd, functionc) {
    var matchedEntries = [];
    var matchedPoints= [];
    console.log("Range: " + requestedStart + "-" + requestedEnd);
    console.log("Load data from stub server: " + moment(requestedStart).format() + ", " + moment(requestedEnd).format());
    $.getJSON("json/browser-demo/db-reasons.json", function (data) {
        var durationThreshold = Math.abs(requestedEnd - requestedStart) / 180;
        jQuery.each(data, function (i, val) {
            //console.log(document.createTextNode(" - " + val));

            var id = val[0];
            var duration = val[1];
            var start = val[2];
            var end = val[3];
            var title = val[4];
            var description = val[5];
            if (!isNaN(val[6])) {
                var groupName = groupMapping[val[6]];
                var priority = priorityMapping[val[7]];
                var logicModule = val[8];
                var mature = val[9];


                //console.log("Testing    : " + title + ", from: " + start + ", to: " + end);
                if (end > requestedStart && start < requestedEnd && duration >= durationThreshold) {
                    var entry = {};
                    entry.id = id;
                    entry.content = title;
                    entry.start = start;
                    entry.end = end;
                    entry.priority = priority;
                    entry.className = "default";
                    entry.mature = mature;
                    entry.group = groupName;

                    matchedEntries.push(entry);
                    //console.log("Matched    : " + title + ", from: " + start + ", to: " + end);
                } else {
                    //console.log("Didint match because: " + moment(start).format() + ", to: " + moment(end).format());
                }
            } else {
                //console.log("Found NoN entry: " + description);
            }


        });

            //  console.log(JSON.stringify(matchedEntries));
            load(matchedEntries, requestedEnd);

            functionc();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("error: " + errorThrown);
        });


    var source="";
    var duration = Math.abs(requestedEnd - requestedStart);

    if(duration > 4 * 30 * 24 * 60 * 60 * 1000 ){
        source = "json/browser-demo/db-raw-4.json";
    } else if (duration > 3 * 24 * 60 * 60 * 1000){
        source = "json/browser-demo/db-raw-3.json";
    }else {
        source = "json/browser-demo/db-raw-2.json";
    }

    console.log("Using source: " + source);

    $.getJSON(source, function (data) {

        jQuery.each(data, function (i, val) {
            //console.log(document.createTextNode(" - " + val));

            var id = val[0];
            var stream = val[1];
            var resolution = val[2];
            var x = val[3];
            var y = val[4];


            if (x > requestedStart && x < requestedEnd ) {
                var entry = {};
                entry.group = stream;
                entry.resolution = resolution;
                entry.x = x;
                entry.y = y;

                matchedPoints.push(entry);
                //console.log("Matched    : " + title + ", from: " + start + ", to: " + end);
            } else {
                //console.log("Didint match because: " + moment(start).format() + ", to: " + moment(end).format());
            }



        });

        rawload(matchedPoints);
        //console.log(JSON.stringify(matchedPoints));
    });


    }