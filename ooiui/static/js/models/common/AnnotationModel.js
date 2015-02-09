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
  url: '/api/annotations',
  defaults: {
    title: "TITLE ",
    comment: "comments",
    recorded_date: "date from instrument",
    value: "9999",
    stream_name: "stream name",
    instrument_name: " instrument name",
    pos_x : "recorded_date ",
    pos_y : "value",
    field_y: "var name",
    field_x:"You shall always be known as time"
  }
});
