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

var InstrumentDeploymentModel = Backbone.Model.extend({
  urlRoot: '/api/instrument_deployment',
  url: "/api/instrument_deployment",
  defaults: {
        display_name: "Platform",
        platform_deployment_id: 1,
        depth: 0
    }
});

var InstrumentDeploymentCollection = Backbone.Collection.extend({
  url: '/api/instrument_deployment',
  model: InstrumentDeploymentModel,
  parse: function(response, options) {
    return response.instrument_deployments;
  }
});
