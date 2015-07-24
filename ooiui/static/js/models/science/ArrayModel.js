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
    defaults: {
        id: null,
        array_code: null,
        array_name: null,
        display_name: null,
        geo_location: [],
        description: null
    }
});



var ArrayCollection = Backbone.Collection.extend({
    url: '/api/array',
    model: ArrayModel,
    parse: function(response) {
        if (response) {
            return response.arrays;
        }
        return [];
    }
});

