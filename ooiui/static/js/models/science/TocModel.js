"use strict";
/*
 * ooiui/static/js/models/science/TocModel.js
 * Model definitions for the TOC
 *
 * Dependencies
 * Partials
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var TocModel = Backbone.Model.extend({
  urlRoot: '/api/uframe/get_toc',
  defaults: {
    display_name: "",   
  }
});

var TocCollection = Backbone.Collection.extend({
  url: '/api/uframe/get_toc',
  model: TocModel,
  parse: function(response, options) {
    if(response && response.toc) {
      return response.toc;
    }
    return [];
  }
});