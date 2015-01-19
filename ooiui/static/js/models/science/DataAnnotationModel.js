"use strict";
/*
 * ooiui/static/js/models/science/DataAnnotationModel.js
 * Model definitions for Data Annotation
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 *
 * Usage
 */


var DataAnnotationModel = Backbone.Model.extend({
  rootUrl: "/api/data_annotation",
  defaults: {
   "user_id" : "",
   "datetime" : "",
   "stream_id" : "",
   "title" : "",
   "message" : ""
  }
});
