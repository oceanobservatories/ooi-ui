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


var QaQcTypeModel = Backbone.Model.extend({
  url: '#',
  defaults:{
    name: null,
    value: null
  }
});


var QaQcTypeCollection = Backbone.Collection.extend({
  url: '#',
  model: QaQcTypeModel,
  initialize: function(options) {

  },
  parse: function(response) {
  }
});


var PlotControlModel = Backbone.Model.extend({
    urlRoot: '#',
    defaults: {
        plotType: "xy",
        plotStyle: "scatter",
        plotOrientation: "horizontal",
        invertX: false,
        invertY: false,
        interpolatedPlotCount: 2,
        showAnnotations: true,
        plotTypeOptions: new PlotTypeCollection([
                          {name:'X-Y', value:"xy", num_inputs: 6, inputs:[{name:"X","value":"x"},
                                                                          {name:"Y","value":"y"}]},

                          {name:'Rose', value:"rose", num_inputs: 2, inputs:[{name:"Direction","value":"x"},
                                                                            {name:"Value","value":"y"}]},

                          {name:'Feather',value:"quiver", num_inputs: 2, inputs: [{name:"Magnitude","value":"x"},
                                                                                   {name:"Direction","value":"y"}]},

                          {name:'3-D Color Scatter',value:"3d_scatter", num_inputs: 3, inputs: [{name:"X","value":"x"},
                                                                                      {name:"Y","value":"y"},
                                                                                      {name:"Color","value":"z",checked:false}]},

                           {name:'Binned Pseudocolor',value:"stacked", num_inputs: 1, inputs: [{name:"Color","value":"z",checked:true}]},

                         ]),

        plotStyleOptions: [
                            {name:'Line',value:"line"},
                            {name:'Scatter',value:"scatter"},
                            {name:'Both',value:"both"}
                          ],

        qaqc : '0',
        qaqcOptions : new QaQcTypeCollection([
                        { name: 'None', value: '0'},
                        { name: 'Global Range', value: '1'},
                        { name: 'Local Range', value: '2'},
                        { name: 'Spike', value: '3'},
                        { name: 'Polytrend', value: '4'},
                        { name: 'Stuck Value', value: '5'},
                        { name: 'Gradient', value: '6'},
                        //{ name: 'Solar Elevation', value: '7'},
                        //{ name: 'Propagate Flags', value: '8'},
                        //{ name: 'Cond Compress', value: '9'},
                        { name: 'All', value: '10'}
                      ]),

        defaultPlotTypes : null,
        userSelected : false
    }
});


