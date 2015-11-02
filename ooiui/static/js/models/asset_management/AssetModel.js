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
      asset_class : null,
      metaData : [],
      remoteDocuments : [ ],
      assetInfo : {
        type : null,
        owner : null,
        description : null,
        instrumentClass : null
      },
      manufactureInfo : {
        serialNumber : null,
        manufacturer : null,
        modelNumber : null
      },
      physicalInfo : null,
      purchaseAndDeliveryInfo : {
        purchaseOrder : null,
        purchaseDate : null,
        purchaseCost : null,
        deliveryOrder : null,
        deliveryDate : null
      },
      dataSource : null,
      lastModifiedTimestamp : null
    },
    toJSON: function() {
        "use strict";
        var attrs = _.clone(this.attributes);
        attrs.assetId = attrs.id;
        return attrs;
    }
});

var AssetCollection = Backbone.Collection.extend({
    url: '/api/asset_deployment',
    model: AssetModel,
    parse: function(response) {
        "use strict";
        if (response) {
            this.trigger("collection:updated", { count : response.count, total : response.total, startAt : response.startAt });
            return response.assets;
        }
        return [];
    },
    byClass: function(classType) {
        "use strict";
        var filtered = this.filter(function (asset) {
            if ( asset.get('ref_des') !== "") {
                return asset.get('asset_class') === classType;
            }
        });
        return new AssetCollection(filtered);
    }
});
