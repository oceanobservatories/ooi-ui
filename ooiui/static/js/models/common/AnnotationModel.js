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
    title: "",    
    comment: "",
    recorded_date: "",
    value: "",
    stream_name: "",
    instrument_name: "",
    pos_x : 0,
    pos_y : 0,
    field_y: "",
    field_x:""
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
