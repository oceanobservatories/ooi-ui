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

var CommandModel = Backbone.Model.extend({
  urlRoot: '/api/c2'
  ,
  
  defaults: {
      command: null,
      timeout: 60000
  },

  validate: function (attributes) {
    // To be done
    return null;
  }
});

var ParameterModel = Backbone.Model.extend({
  urlRoot: '/api/c2'
  ,

  defaults: {
      resource: null,
      timeout: 60000
  },

  validate: function (attributes) {
    // To be done
    return null;
  }
});

var StatusModel = Backbone.Model.extend({
  urlRoot: '/api/c2'
  ,

  defaults: {
      resource: null,
      timeout: 60000
  },

  validate: function (attributes) {
    // To be done
    return null;
  }
});

var SampleModel = Backbone.Model.extend({
  urlRoot: '/api/c2'
  ,

  defaults: {
      resource: null,
      timeout: 60000
  },

  validate: function (attributes) {
    // To be done
    return null;
  }
});