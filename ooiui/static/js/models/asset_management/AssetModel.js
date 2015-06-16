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
  defaults: {
  	assetInfo: {
	    description: null,
	    name: "Test",
	    owner: null,
	    type: "Mooring"
		  },
		attachments: [],
        class: ".AssetRecord",
        coordinates: [
            0,
            0
        ],
        launch_date_time: "21-Nov-13 18:16",
        manufactureInfo: {
            manufacturer: null,
            modelNumber: null,
            serialNumber: ""
        },
        notes: [""],
        physicalInfo: null,
        purchaseAndDeliveryInfo: null,
        water_depth: {
            unit: "m",
            value: 133.5
        },
        lastModifiedTimestamp: null,
        ref_des: null,
        asset_class: null,
        deployment_number: null
  	}
});

var AssetModelSingle = Backbone.Model.extend({
	defaults : {

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

var AssetEvents = Backbone.Model.extend({
  urlRoot: '/api/asset_deployment'
});
