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

var AssetEventsModel = Backbone.Model.extend({
    defaults: {
        eventClass: null,
        eventType: "ACTUAL",
        metaData: [ ],
        eventId: null,
        eventDescription: null,
        recordedBy: null,
        asset: {},
        notes: [ ],
        tense: null,
        startDate: null,
        endDate: null,
        attachments: [ ],
        remoteDocuments: [ ],
        dataSource: null,
        recordedBy: null,
        locationChangeNotes: null,
        locationType: null,
        locationName: null,
        locationLonLat: [],
        depth: 0,
        recoveryLocationLonLat: [],
        recoveryShipName: [],
        deploymentShipName: [],
        mooring: null,
        recoveryPlanDocument: null,
        recoveryCruiseNumber: null,
        cruisePlanDocument: null,
        cruise: null,
        deploymentDocUrls: null,
        deploymentNumber: null,
        referenceDesignator: {
            node: null,
            subsite: null,
            sensor: null,
            full: false
        }
    },
    toJSON: function() {
        var attrs = _.clone(this.attributes);
        attrs.assetId = attrs.id;
        return attrs;
    },
});


var AssetEventsCollection = Backbone.Collection.extend({
    initialize: function(options) {
        this.id = options.id;
    },
    url: function() {
        return '/api/asset_events/' + this.id;
    },
    model: AssetEventsModel,
    parse: function(response, options) {
        return response.events;
    }
});
