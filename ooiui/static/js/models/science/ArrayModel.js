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
    },
    parse: function(data) {
        // we have the cabled array at the same location as the coastal endurance,
        // the cabled array is a bit farther off set from the endurance.
        var attrs = _.clone(data),
            cabledArray = [[[45.8305, -128.7533]]];

        if (attrs.array_code.indexOf('RS') > -1) {
            attrs.geo_location.coordinates = cabledArray;
        }
        return data;
    },
    // geoJSON
    toJSON: function() {
        var attrs = _.clone(this.attributes),
            coorArray = attrs.geo_location.coordinates,
            newArray = [coorArray[0][0][1], coorArray[0][0][0]],
            polyArray = [];



        // mapbox GL expects lng, lat
        if (coorArray[0][0].length > 0) {
            _.each(coorArray[0], function(item) {
                polyArray.push([item[1], item[0]]);
            });
        }

        if (attrs.array_code.indexOf('RS') > -1) {
            newArray = [-128.7533, 45.8305];
        }

        if (!attrs.platforms) {
            attrs.platforms = [];
        } else {
            _.each(attrs.platforms, function(platform) {
                platform.properties.title = platform.properties.title.replace(attrs.display_name, '');
            });
        }

        var geoJSON = {
            "type": "Feature",
            "properties": {
                "description": "<span>"+attrs.display_name+"</span>",
                "code": attrs.array_code,
                "title": attrs.display_name,
                "marker-symbol": 'dot',
                "platforms": attrs.platforms
            },
            "geometry": {
                "type": "Point",
                "coordinates": newArray
            }

        }
        return geoJSON;
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

