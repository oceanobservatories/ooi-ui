"use strict";
/*
 * ooiui/static/js/views/common/ChartView.js
 * View definitions for charts
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/Chart.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 *
 * Usage
 */
var ChartOptionsModel = Backbone.Model.extend({
  defaults: {
    title: 'some title here',
    stream:'default stream',
    instrument:'deafult instr',
    variable:'default ' 
  }
});


var Chart = Backbone.Model.extend({
  defaults: {
    title: 'New Chart',
    type:  'AreaChart',
  },

  url: 'getdata/?',
   
  parse: function(response, options){
    _.bindAll(this, 'initialize');
    var response =options.xhr.responseText
    var self = this
    self.initialize(response)
    return response
  },

  initialize: function(response){ 
    var data = new google.visualization.DataTable(response)
    this.set({data:data});
  },
   
});


