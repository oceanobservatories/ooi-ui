"use strict";
/*
 * ooiui/static/js/models/c2/PlatformStatusModel.js
 * Model definitions for C2 platform status
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 *
 * http://localhost:4000/c2/array/CP/current_status_display

Probably don't need right now

 */

var PlatformStatusModel = Backbone.Model.extend({
  urlRoot: '/api/c2/array'
  ,
  fetchCurrent: function (array_code, options) {
    options = options || {};
    if (options.url === undefined) {
        options.url = this.urlRoot + "/" + array_code + "/current_status_display";
    }
    return Backbone.Model.prototype.fetch.call(this, options);
  },
  validate: function (attributes) {
    // To be done
    return null;
  }
});

var PlatformStatusCollection = Backbone.Collection.extend({
  urlRoot: '/api/c2/array',
  //url: '/api/c2/array/CP/current_status_display',
  model: PlatformStatusModel,
  parse: function(response, options) {
    if(response) {
      return response.current_status_display;
    } else {
      return [];
    }
  }
  ,
  fetch: function (array_code, options) {
    options = options || {};
    if (options.url === undefined) {
      options.url = this.urlRoot + "/" + array_code + "/current_status_display";
    }
    return Backbone.Model.prototype.fetch.call(this, options);
  }
});