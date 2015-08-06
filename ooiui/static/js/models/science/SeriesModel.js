"use strict";
/*
 * ooiui/static/js/models/science/SeriesModel.js
 * Model definition for a series that fits into the Highcharts time series charts
 * Dependencies
 *  - d3
 */
/*
used to manage data in high charts
*/
var SeriesModel = Backbone.Model.extend({
  urlRoot: '#',
  formatter: d3.format(".2f"),
  defaults: {
    type: "scatter",
    name: "",
    axisName: "test",
    showInLegend: true,
    enableMouseTracking: true,
    color: "",
    data: [],
    enableMarker: true,
    units:" ....test...."
  }
});

var SeriesCollection = Backbone.Collection.extend({
  url: '#',
  model: SeriesModel
});


/*
  Data structures that come from uframe
*/
var DataSeriesModel = Backbone.Model.extend({
  urlRoot: '#',    
  initialize: function(){
  }
});

var DataSeriesCollection = Backbone.Collection.extend({  
  stream:"",
  ref_des:"",
  startdate:"",
  enddate:"",
  xparameters:[],
  yparameters:[],
  url: function() {
    var durl = '/api/get_data?instrument='+ this.ref_des+"&stream="+this.stream+"&xvars="+this.xparameters.join()+"&yvars="+this.yparameters.join()+"&startdate="+this.startdate+"&enddate="+this.enddate
    console.log(durl);
    return durl;
  },
  //eg url: '/api/get_data?instrument=CE05MOAS-GL382-05-CTDGVM000&stream=telemetered_ctdgv_m_glider_instrument&xvars=time,time&yvars=sci_water_pressure,sci_water_cond&startdate=2015-01-21T22:01:48.103Z&enddate=2015-01-22T22:01:48.103Z',  
  //used to hold the unit mapping
  units:null,
  model: DataSeriesModel,
  getTitle:function(){
    return this.ref_des;
  },
  getSubtitle:function(){
    return this.stream;
  },
  getUnits:function(param){
    return this.units[param];
  },
  parse: function(response, options) {
    this.units = response.units;
    return response.data;
  }

});