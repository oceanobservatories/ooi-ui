"use strict";
/*
 * ooiui/static/js/models/science/ArrayModel.js
 * Model definitions for Arrays
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * - ooiui/static/js/models/science/PlatformDeploymentModel.js
 * Usage
 */



var ArrayModel = OOI.RelationalModel.extend({
  urlRoot: '/api/array',
  relation: {
    type: OOI.Relation.hasMany,
    key: 'platformDeployments',
    collectionType: 'PlatformDeploymentCollection',
    reverseRelation: {
      key: 'array_id'
    }
  }
});

var ArrayCollection = Backbone.Collection.extend({
  url: '/api/array',
  model: ArrayModel,
  parse: function(response, options) {
    return response.arrays;
  }
});

