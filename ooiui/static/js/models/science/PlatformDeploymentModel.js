"use strict";
/*
 * ooiui/static/js/models/science/PlatformDeploymentModel.js
 * Model definitions for Platform Deployments
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var PlatformDeploymentModel = Backbone.Model.extend({
  urlRoot: '/api/platform_deployment'
});

var PlatformDeploymentCollection = Backbone.Collection.extend({
  url: '/api/platform_deployment',
  model: PlatformDeploymentModel,
  parse: function(response, options) {
    return response.platform_deployments;
  }
});
