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
        id: null,
  	    assetInfo: {
            description: null,
            name: null,
            owner: null,
            type: null
		},
		attachments: [],
        asset_class: null,
        manufactureInfo: {
            manufacturer: null,
            modelNumber: null,
            serialNumber: ""
        },
        notes: [""],
        physicalInfo: null,
        purchaseAndDeliveryInfo: null,
        lastModifiedTimestamp: null,
        metaData: [],
        classCode: null,
        seriesClassification: null
  	},
    toJSON: function() {
        var attrs = _.clone(this.attributes);
        attrs.assetId = attrs.id;
        return attrs;
    }
});

var AssetCollection = Backbone.Collection.extend({
    url: '/api/asset_deployment',
    model: AssetModel,
    parse: function(response) {
        if (response) {
            this.trigger("collection:updated", { count : response.count, total : response.total, startAt : response.startAt });
            return response.assets;
        }
        return [];
    }
});
