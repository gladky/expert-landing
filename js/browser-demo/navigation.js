/**
 * Created by mgl on 16.10.17.
 */
$(function () {
    console.log("Initiating navigation");
    var chart = new Highcharts.StockChart({
        chart: {
            renderTo: 'container',
            height: 120

        },

        yAxis: {
            height: 1
        },
        xAxis: {
            min: 2,
            max: 4,
            lineWidth: 0,
            tickLength: 0,
            labels: {
                enabled: false
            },
            events: {
                setExtremes: function (e) {
                        runSyncFromTimeline({'start':e.min,'end':e.max,'byUser':true});
                        runSyncFromGraph({'start':e.min,'end':e.max,'byUser':true});
                        console.log('<b>Set extremes:</b> e.min: ' + Highcharts.dateFormat(null, e.min) +
                            ' | e.max: ' + Highcharts.dateFormat(null, e.max) + ' | e.trigger: ' + e.trigger);

                }
            }
        },
        navigator: {
            series: {
                data: [[1000000114000,0],[1010000214000,0],[1020000314000,1],[1030000414000,0],[1040000514000,0],[1050000614000,2],[1060000714000,0],[1070000814000,0],[1080000914000,3],[1090001014000,0],[1100002014000,0],[1110003014000,4],[1120004014000,0],[1130005014000,0],[1140006014000,5]],
                marker: {
                    enabled: true
                }

            }

        },
        series: [{
            data: [1, 12, 113, 1115, 11116, 111117, 1111118, 11111119, 11111111110, 11111111111, 111111111112, 111111111113, 111111111113]
        }]
    });


});
