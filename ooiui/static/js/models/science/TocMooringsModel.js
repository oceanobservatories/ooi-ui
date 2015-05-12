"use strict";
/*
 * ooiui/static/js/models/science/TocMooringsModel.js
 * Model definitions for moorings from TOC
 *
 * Dependencies
 * Partials
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var TocMooringsModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
    display_name: "",    
  }
});

var TocMooringsCollection = Backbone.Collection.extend({
  url: '/api/uframe/get_structured_toc',
  model: TocMooringsModel,
  parse: function(response, options) {
    //console.log(response);
    return response.toc.moorings;
  }
});