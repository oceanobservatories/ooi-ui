"use strict";
/*
 * ooiui/static/js/models/science/TocInstrumentsModel.js
 * Model definitions for instruments from TOC
 *
 * Dependencies
 * Partials
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var TocInstrumentsModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
    display_name: "",   
  }
});

var TocInstrumentsCollection = Backbone.Collection.extend({
  url: '/api/uframe/get_structured_toc',
  model: TocInstrumentsModel,
  parse: function(response, options) {
    //console.log(response);
    return response.toc.instruments;
  }
});