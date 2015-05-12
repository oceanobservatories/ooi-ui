"use strict";
/*
 * ooiui/static/js/models/science/TocPlatformsModel.js
 * Model definitions for platforms from TOC
 *
 * Dependencies
 * Partials
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var TocPlatformsModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
    display_name: "",   
  }
});

var TocPlatformsCollection = Backbone.Collection.extend({
  url: '/api/uframe/get_structured_toc',
  model: TocPlatformsModel,
  parse: function(response, options) {
    //console.log(response);
    return response.toc.platforms;
  }
});