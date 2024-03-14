/* Created by M@Campbell
 *
 * @defaults
 *      id: The full object identification path. may be left out in response.
 *      name: The name of the document
 *      url: The downlaod URL of the ojbect.
 *
 */
var PlatformModel = Backbone.Model.extend({
    url: '/api/asset_deployment?geoJSON=true',
    defaults: {
        array_id: null,
        display_name: null,
        end_date: null,
        geo_location: {
            coordinates: [],
            type: null,
            depth: null
        },
        id: null,
        reference_designator: null,
        start_date: null
    },
    toGeoJSON: function() {
        var attrs = _.clone(this.attributes),
            coorArray = attrs.geo_location.coordinates,
            newArray = [coorArray[0].toFixed(3), coorArray[1].toFixed(3)],
            color = 'yellow';



        // the icons stack on top of each other, this give a slight offset so they can be
        // seen easier.
        if (attrs.reference_designator.indexOf('GL') > -1 ) {

            // and we don't know their depth, so set it to 'various'
            attrs.geo_location.depth = 'Various';
        }
        else {
            // for moorings, lets make sure they are still very close

            // TODO: We need to get the depths of the moorings into the database.
            //       There are several changes we need to make to the platforms so this
            //       should be noted as one of them.  If there is no value, just provide
            //       any number . . .
            //attrs.geo_location.depth = (attrs.geo_location.depth) ? attrs.geo_location.depth + ' meters' : 'Unknown';
        }

        var geoJSON = {
            "type": "Feature",
            "properties": {
                "description": "<span>"+attrs.display_name+"</span>",
                "code": attrs.reference_designator,
                "title": attrs.display_name,
                "marker-symbol": (attrs.reference_designator.indexOf('GL') > -1) ? 'airfield_icon' : 'harbor_icon',
                "depth": attrs.geo_location.depth
            },
            "geometry": {
                "type": "Point",
                "coordinates": newArray
            }

        };
        return geoJSON;
    }
});

/* Created by M@Campbell
 *
 * Simple collection.
 *
 */

var PlatformCollection = Backbone.Collection.extend({
    url: '/api/asset_deployment?geoJSON=true',
    model: PlatformModel,
    toGeoJSON: function() {
        var geoJSONified = this.map(function(model) {
            return model.toGeoJSON();
        });
        return geoJSONified;
    },
    parse: function(response) {
        'use strict';
        // if the response is valid, return the results object
        if (response) { return response.assets; } else { return {}; }
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
            if (platform.get('reference_designator') !== "" && (platform.get('reference_designator').length === 14 ||
                platform.get('reference_designator').indexOf('GL') > -1) || platform.get('reference_designator').length === 8) {
                return platform.get('reference_designator').substr(0,3) === array;
            }
        });
        return new PlatformCollection(filtered);
    }
});
