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
  //idAttribute: 'id',
  defaults: {
    annotation:"",
    stream_name: "",
    instrument_name: "",    
    beginDT:"",   //start date, from chart
    endDT:"",    //end date, from chart
    referenceDesignator:"",    
    method:"",  //stream name
    parameters:"", //param list is affects
    source:"",
    qcFlag:"",
    exclusionFlag:false
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
  },
  sortByField: function(field, direction){
    var sorted = _.sortBy(this.models, function(model){
      return model.get(field);
    });

    if(direction === 'descending'){
      sorted = sorted.reverse()
    }

    this.models = sorted;
  }
});

var QcFlagsModel = Backbone.Model.extend({
  urlRoot: '/api/annotation/qcflags',
  defaults: {
  }
});

var QcFlagsCollection = Backbone.Collection.extend({
  url: '/api/annotation/qcflags',
  model: QcFlagsModel,
  parse: function(response) {
    if(response) {
      return response.qcFlags;
    }
    return [];
  }
});