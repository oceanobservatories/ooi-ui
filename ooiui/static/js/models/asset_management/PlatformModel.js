/* Created by M@Campbell
 *
 * @defaults
 *      id: The full object identification path. may be left out in response.
 *      name: The name of the document
 *      url: The downlaod URL of the ojbect.
 *
 */

var PlatformModel = Backbone.Model.extend({
    urlRoot: '/api/platform_deployment',
    defaults: {
        array_id: null,
        display_name: null,
        end_date: null,
        geo_location: {
            coordinates: [],
            type: null
        },
        id: null,
        reference_designator: null,
        start_date: null
    },
    toJSON: function() {
        var attrs = _.clone(this.attributes),
            coorArray = attrs.geo_location.coordinates,
            newArray = [coorArray[0], coorArray[1]],
            color = 'yellow';


        if (attrs.reference_designator.indexOf('GI') > -1 || attrs.reference_designator.indexOf('GA') > -1 ) {
            newArray[1] = -1 * newArray[1];
        }

        // the icons stack on top of each other, this give a slight offset so they can be
        // seen easier.
        if (attrs.reference_designator.indexOf('GL') > -1 ) {
            // for gliders, lets spread them out a bit more.
            newArray = [newArray[0]-(Math.random()*0.09), newArray[1]-(Math.random()*0.09)];

            // and we don't know their depth, so set it to 'various'
            attrs.depth = 'Various';
        }
        else {
            // for moorings, lets make sure they are still very close
            newArray = [newArray[0]-(Math.random()*0.05), newArray[1]-(Math.random()*0.05)];

            // TODO: We need to get the depths of the moorings into the database.
            //       There are several changes we need to make to the platforms so this
            //       should be noted as one of them.  If there is no value, just provide
            //       any number . . .
            attrs.depth = (attrs.depth) ? attrs.depth : 'Unknown';
        }

        var geoJSON = {
            "type": "Feature",
            "properties": {
                "description": "<span>"+attrs.display_name+"</span>",
                "code": attrs.reference_designator,
                "title": attrs.display_name,
                "marker-symbol": (attrs.reference_designator.indexOf('GL') > -1) ? 'airfield_icon' : 'harbor_icon',
                "depth": attrs.depth
            },
            "geometry": {
                "type": "Point",
                "coordinates": newArray
            }

        }
        return geoJSON;
    }
});

/* Created by M@Campbell
 *
 * Simple collection.
 *
 */

var PlatformCollection = Backbone.Collection.extend({
    url: '/api/platform_deployment',
    model: PlatformModel,
    parse: function(response) {
        'use strict';
        // if the response is valid, return the results object
        if (response) { return response.platform_deployments; } else { return {}; }
    },
    byGliders: function() {
        var filtered = this.filter(function (platform) {
            if (platform.get('reference_designator') !== "") {
                return platform.get('reference_designator').indexOf('GL') > -1;
            }
        });
        return new PlatformCollection(filtered);
    },
    byMoorings: function() {
        var filtered = this.filter(function (platform) {
            if (platform.get('reference_designator') !== "" && platform.get('reference_designator').length === 8) {
                return platform.get('reference_designator').indexOf('GL') < 0;
            }
        });
        return new PlatformCollection(filtered);
    },
    byArray: function(array) {
        var filtered = this.filter(function (platform) {
            if (platform.get('reference_designator') !== "" && platform.get('reference_designator').length === 8 ||
                platform.get('reference_designator').indexOf('GL') > -1) {
                return platform.get('reference_designator').substr(0,2) === array;
            }
        });
        return new PlatformCollection(filtered);
    }
});
