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
        asset: {
          '@class': ".AssetRecord",
          assetId: 1
        },
        attachments: [],
        class: ".DeploymentEvent",
        cruiseNumber: "",
        deploymentDepth: 0,
        deploymentDocUrls: [],
        deploymentLocation: [
        ],
        deploymentName: null,
        deploymentNumber: 1,
        depthUnitString: "m",
        endDate: null,
        eventDescription: null,
        eventType: "Location",
        notes: [],
        recordedBy: null,
        referenceDesignator: {
          full: false,
          node: null,
          sensor: null,
          subsite: ""
        },
        startDate: null
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
  urlRoot: '/api/asset_events',
  defaults: {
        asset: {
          '@class': ".AssetRecord",
          assetId: 1
        },
        attachments: [],
        class: ".DeploymentEvent",
        cruiseNumber: "",
        deploymentDepth: 0,
        deploymentDocUrls: [],
        deploymentLocation: [
        ],
        deploymentName: null,
        deploymentNumber: 1,
        depthUnitString: "m",
        endDate: null,
        eventDescription: null,
        eventType: "Location",
        notes: [],
        recordedBy: null,
        referenceDesignator: {
          full: false,
          node: null,
          sensor: null,
          subsite: ""
        },
        startDate: null
    }
});
