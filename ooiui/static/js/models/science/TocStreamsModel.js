"use strict";
/*
 * ooiui/static/js/models/science/TocStreamsModel.js
 * Model definitions for streams from TOC
 *
 * Dependencies
 * Partials
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var TocStreamsModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
    display_name: ""
  }
});

var TocStreamsCollection = Backbone.Collection.extend({
  url: '/api/uframe/get_structured_toc',
  model: TocStreamsModel,
  parse: function(response, options) {
    //console.log(response);
    return response.toc.instruments;
  }
});