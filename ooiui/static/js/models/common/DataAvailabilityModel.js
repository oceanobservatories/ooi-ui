"use strict";
/*
 * ooiui/static/js/models/common/DataAvailabilityModel.js
 * View data availability for streams
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/DataAvailability.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 *
 * Usage
 */


var DataAvailabilityModel = Backbone.Model.extend({
  urlRoot: '/api/data_availability',
  defaults: {
    ref_des: "",
    stats_data: {}
  }
});

var DataAvailabilityCollection = Backbone.Collection.extend({
  url: '/api/data_availability',
  model: DataAvailabilityModel,
  parse: function(response) {
    if(response) {
      return response;
    }
    return [];
  }
});
