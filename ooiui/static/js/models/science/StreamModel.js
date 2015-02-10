"use strict";
/*
 * ooiui/static/js/models/science/StreamModel.js
 * Model definitions for Streams
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * - ooiui/static/js/models/science/PlatformDeploymentModel.js
 * Usage
 */

var StreamModel = Backbone.Model.extend({
  urlRoot: '/api/uframe/stream',
  defaults: {
    stream_name: "",
    download: "",
    start: "",
    end: "",
    reference_designator: ""
  },
  parse: function(data, options) {
    if(data && data.start && data.end) {
      data.start = new Date(data.start * 1000);
      data.end = new Date(data.end * 1000);
    }
    return data;
  }
});

var StreamCollection = Backbone.Collection.extend({
  url: '/api/uframe/stream',
  model: StreamModel,
  parse: function(response) {
    if(response) {
      return response.streams;
    }
    return [];
  }
});
