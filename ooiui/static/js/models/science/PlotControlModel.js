"use strict";
/*
* ooiui/static/js/models/science/PlotControlModel.js
* Model to contain the options for the plot
*
* Usage
* - used in conjunction with the PlotControlView
*/

var PlotTypeModel = Backbone.Model.extend({
  url: '#',
  defaults:{
    name: null,
    value: null,
    num_inputs: null,
    inputs: null
  }
});


var PlotTypeCollection = Backbone.Collection.extend({
  url: '#',
  model: PlotTypeModel,
  initialize: function(options) {

  },
  parse: function(response) {
  }
});


var PlotControlModel = Backbone.Model.extend({
    urlRoot: '#',
    defaults: {
        plotType: "xy",
        plotStyle: "line",
        plotOrientation: "horizontal",
        invertX: false,
        invertY: false,
        plotTypeOptions: new PlotTypeCollection([
                          {name:'X-Y', value:"xy", num_inputs: 6, inputs:[{name:"x","value":"x"},
                                                                          {name:"y","value":"y"}]},

                          {name:'Rose', value:"rose", num_inputs: 2, inputs:[{name:"value","value":"x"},
                                                                            {name:"direction","value":"y"}]},

                          {name:'Feather',value:"feather", num_inputs: 2, inputs: [{name:"magnitude","value":"x"},
                                                                                   {name:"direction","value":"y"}]},

                          {name:'Psuedocolor',value:"pcolor", num_inputs: 3, inputs: [{name:"x","value":"x"},
                                                                                      {name:"y","value":"y"},
                                                                                      {name:"color","value":"z"}]},
                         ]),

        plotStyleOptions: [
                            {name:'Line',value:"line"},
                            {name:'Scatter',value:"scatter"},
                            {name:'Both',value:"both"}
                          ],
        defaultPlotTypes : null
    }
});


