/**
 * Created by mgl on 16.10.17.
 */

function loadSampleRawData(url){

    $.getJSON(url, function (json) {
        //console.log("Data loaded: " + JSON.stringify(json));
        rawload(json);
    });
}

function loadSampleReasonData(url){

    $.getJSON(url, function (data) {
        //console.log("Data loaded: " + JSON.stringify(json));
        load(data['entries'], data['fake-end']);
    });
}


$( document ).ready(function() {
    console.log( "loading demo data!" );
    loadSampleRawData('json/browser-demo/raw.json');

    loadSampleReasonData('json/browser-demo/reasons.json');


    // console.log( "getting reasons.json" );
    // var reason = loadSampleData('json/browser-demo/reasons.json');
    // console.log( "sending data to chart" );
    // load(reason,moment());
    // console.log( "chart is loaded" );
});