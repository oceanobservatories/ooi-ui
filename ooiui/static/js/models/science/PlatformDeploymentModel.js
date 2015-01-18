"use strict";
/*
 * ooiui/static/js/models/science/PlatformDeploymentModel.js
 * Model definitions for Platform Deployments
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi/RelationalModel.js
 * - ooiui/static/js/models/science/InstrumentDeploymentModel.js
 * Usage
 */

var PlatformDeploymentModel = OOI.RelationalModel.extend({
  urlRoot: '/api/platform_deployment',
  relation: {
    type: OOI.Relation.hasMany,
    key: 'instrumentDeployments',
    collectionType: 'InstrumentDeploymentCollection',
    reverseRelation: {
      key: 'platform_deployment_id'
    }
  }
});

var PlatformDeploymentCollection = Backbone.Collection.extend({
  url: '/api/platform_deployment',
  model: PlatformDeploymentModel,
  parse: function(response, options) {
    return response.platform_deployments;
  }
});
