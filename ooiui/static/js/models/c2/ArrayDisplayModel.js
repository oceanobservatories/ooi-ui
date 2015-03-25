"use strict";
/*
 * ooiui/static/js/models/c2/ArrayDisplayModel.js
 * Model definitions for C2 array_display
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var ArrayDisplayModel = Backbone.Model.extend({
  urlRoot: '/api/c2/array/CP/current_status_display',
  defaults: {
    display_name: "",
    operational_status: "Unknown",
    platform_deployment_id: 1
    }
});

var ArrayDisplayCollection = Backbone.Collection.extend({
  url: function() {
    return this.document.url() + '/api/c2/array/CP/current_status_display';
  },
  model: ArrayDisplayModel,
  parse: function(response) {
    if(response) {
      return response.current_status_display;
    } else {
      return [];
    }
  }
});