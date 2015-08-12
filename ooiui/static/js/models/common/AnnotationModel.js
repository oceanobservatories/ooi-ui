"use strict";
/*
 * ooiui/static/js/models/common/AnnotationModel.js
 * View definitions for charts
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/Annotation.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 *
 * Usage
 */

var AnnotationModel = Backbone.Model.extend({
  urlRoot: '/api/annotation',
  defaults: {
    annotation:"",
    stream_name: "",
    instrument_name: "",    
    beginDT:"",   //start date, from chart
    endDT:"",    //end date, from chart
    referenceDesignator:"",    
    method:"",  //stream name
    parameters:"" //param list is affects
  }  
});

var AnnotationCollection = Backbone.Collection.extend({
  url: '/api/annotation',
  model: AnnotationModel,
  parse: function(response) {
    if(response) {
      return response.annotations;
    }
    return [];
  }
});
