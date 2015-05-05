"use strict";
/*
 * ooiui/static/js/models/science/TocArrayModel.js
 * Model definitions for Arrays from TOC
 *
 * Dependencies
 * Partials
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var TocArrayModel = Backbone.Model.extend({
  urlRoot: '/api/uframe/get_toc',
  defaults: {
    display_name: "",    
  }
});

var TocArrayCollection = Backbone.Collection.extend({
  url: '/api/uframe/get_toc',
  model: TocArrayModel,
  parse: function(response, options) {
    //console.log(response);
    return response.toc.arrays;
  }
});