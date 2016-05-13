"use strict";
/*
* ooiui/static/js/models/science/PlotControlModel.js
* Model to contain the options for the plot
*
* Usage
* - used in conjunction with the PlotControlView
*/

var PlotControlModel = Backbone.Model.extend({
    urlRoot: '/api/events',
    defaults: {
        plotType: "xy",
        plotStyle: "line",
        plotOrientation: "horizontal",
        invertX: false,
        invertY: false,
        plotTypeOptions: [
                          {name:'X-Y',value:"xy", num_inputs: 6},
                          {name:'Rose',value:"Rose", num_inputs: 3},
                          {name:'Feather',value:"feather", num_inputs: 2},
                          {name:'Psuedocolor',value:"pcolor", num_inputs: 3}
                         ],

        plotStyleOptions: [
                            {name:'Line',value:"line"},
                            {name:'Scatter',value:"scatter"},
                            {name:'Both',value:"both"}
                          ]
    }
});
