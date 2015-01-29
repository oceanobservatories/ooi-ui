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

var Chart = Backbone.Model.extend({
  url: 'api/get_data',
   
  parse: function(response, options){
    _.bindAll(this, 'initialize');
    console.log(options)
    var response =options.xhr.responseText
    console.log(response)
    var self = this
    self.initialize(response)
    return response
  },


  defaults: {
    title: 'New Chart',
    type:  'AreaChart',
    data:'' 
  },



  initialize: function(response){
    var data = new google.visualization.DataTable(response)
       
      

    this.set({data:data});
    },
   
});


