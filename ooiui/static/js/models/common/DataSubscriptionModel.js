"use strict";
/*
 * ooiui/static/js/models/common/DataSubscriptionModel.js
 *
 * Usage
 *
 */

var DataSubscriptionModel = Backbone.Model.extend({
  urlRoot: "/api/subscription",
  defaults: {
    "@class" : ".SensorSubscriptionRecord",
    "method" : null,
    "format" : "application/netcdf",
    "enabled" : true,
    "userName" : "subscription",
    "stream" : null,
    "interval" : 24,
    "subscriptionId":null,
    "referenceDesignator" : {
        "node" : null,
        "full" : true,
        "subsite" : null,
        "sensor" : null
    },
    "email" : null,
    "lastrun" : null
    },
    initialize: function () {
        this.set('id', this.attributes.subscriptionId);
    }
});

var DataSubscriptionCollection = Backbone.Collection.extend({
  //url: '/api/subscription',
  url: '/api/subscription',
  model: DataSubscriptionModel,
  parse: function(response) {
    return response;
  }
});
