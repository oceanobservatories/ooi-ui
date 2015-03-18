"use strict";
/*
 * ooiui/static/js/models/science/AssetModel.js
 * Model definitions for Instrument Deployments
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var AssetModel = Backbone.Model.extend({
  urlRoot: '/api/asset_deployment',
  defaults: {
       
    }
});

var AssetCollection = Backbone.Collection.extend({
  url: '/api/asset_deployment',
  model: AssetModel,
  parse: function(response, options) {
    return response.assets;
  }
});

var AssetEvents = Backbone.Model.extend({
  urlRoot: '/api/asset_deployment'
});
