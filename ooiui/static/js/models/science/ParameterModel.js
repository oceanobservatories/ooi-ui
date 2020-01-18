"use strict";
/*
 * ooiui/static/js/models/science/ParameterModel.js
 * Model definitions for Parameters
 *
 * Dependencies
 * Partials
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var ParameterModel = Backbone.Model.extend({
  defaults: {
    name: "",
    units: ""
  }
});

var ParameterCollection = Backbone.Collection.extend({
  url: '/api/parameter',
  model: ParameterModel,
  comparator: function(item) {
    return item.get('name');
  },
  parse: function(response, options) {
    //console.log(response);
    return response.objects;
  }
});

