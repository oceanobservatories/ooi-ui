"use strict";
/*
 * ooiui/static/js/models/science/TocParametersModel.js
 * Model definitions for streams from TOC
 *
 * Dependencies
 * Partials
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var TocParametersModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
    display_name: ""
  }
});

var TocParametersCollection = Backbone.Collection.extend({
  url: '/api/uframe/get_structured_toc',
  model: TocParametersModel,
  parse: function(response, options) {
    //console.log(response);
    return response.toc.instruments;
  }
});