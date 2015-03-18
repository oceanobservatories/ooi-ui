"use strict";
/*
 * ooiui/static/js/models/science/InstrumentDeploymentModel.js
 * Model definitions for Instrument Deployments
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var EventsModel = Backbone.Model.extend({
  urlRoot: '/api/asset_events',
  defaults: {
        assetId: 1
    }
});

var EventsCollection = Backbone.Collection.extend({
  url: '/api/asset_events',
  model: EventsModel,
  parse: function(response, options) {
    return response.events;
  }
});

var SingleEvent = Backbone.Model.extend({
  urlRoot: '/api/asset_events'
});
