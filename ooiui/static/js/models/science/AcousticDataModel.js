/*
 * Model definitions for Acoustic Datasets
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var AcousticDataModel = Backbone.Model.extend({
  urlRoot: '/api/antelope_acoustic/list',
  defaults: {
        channel: "",
        downloadUrl: "",
        filename: "",
        endTime: "",
        id: "",
        location: "",
        network: "",
        node: "",
        sampleRate: "",
        samples: "",
        sensor: "",
        startTime: "",
        station: "",
        subsite: "",
    },
    // toJSON: function() {
    //     "use strict";
    //     var attrs = _.clone(this.attributes);
    //     attrs.assetId = attrs.id;
    //     return attrs;
    // }
});

var AcousticDataCollection = Backbone.Collection.extend({
    url: '/api/antelope_acoustic/list',
    model: AcousticDataModel,
    parse: function(response) {
        "use strict";
        if (response) {
            this.trigger("collection:updated", { count : response.count, total : response.total, startAt : response.startAt });
            return response.results;
        }
        return [];
    }
});
