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
  urlRoot: '/api/array',
  defaults: {
    display_name: "", 
    reference_designator: "",    
  }
});

var TocArrayCollection = Backbone.Collection.extend({
  url: '/api/array',
  model: TocArrayModel,
  parse: function(response, options) {
    if (response && response.arrays){
      return response.arrays;
    }
    return [];
  }
});