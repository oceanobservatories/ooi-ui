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

var GetArrayStatus = function(array_code) {
    //console.log(array_code);
    //console.log(platform_ref_des);
    var output = "Fetching Status Failed";
    $.ajax('/api/uframe/status/arrays', {
        type: 'GET',
        dataType: 'json',
        timeout: 50000,
        async: false,
        success: function (resp) {
            //console.log('success getting platform status: ');
            //console.log(resp.sites);
            //var theStatus = $.map(resp.sites, function(val) {
            //    return val.reference_designator == platform_ref_des ? val.status : 'No Status Returned';
            //});
            //console.log(theStatus);
            //return theStatus
            var result = $.grep(resp.arrays, function(e){ return e.reference_designator == array_code; });
            //console.log('result');
            //console.log(result);
            if (result.length == 0) {
                //console.log('No Status Returned');
                output = "No Status Returned";
            } else if (result.length == 1) {
                // access the foo property using result[0].foo
                //console.log('Found: ' + platform_ref_des);
                //console.log(result[0].status);
                output = result[0].status.legend;
            } else {
                // multiple items found
                //console.log('Multiple Status Returned');
                output = 'Multiple Status Returned';
            }

        },

        error: function( req, status, err ) {
            console.log(req);
        }
    });
    return output;
};

var GetPlatformStatus = function(array_code, platform_ref_des) {
    //console.log(array_code);
    //console.log(platform_ref_des);
    var output = {"status": "Fetching Status Failed", "mindepth": 0.0, "maxdepth": 0.0};
    $.ajax('/api/uframe/status/sites/' + array_code, {
        type: 'GET',
        dataType: 'json',
        timeout: 50000,
        async: false,
        success: function (resp) {
            //console.log('success getting platform status: ');
            //console.log(resp.sites);
            //var theStatus = $.map(resp.sites, function(val) {
            //    return val.reference_designator == platform_ref_des ? val.status : 'No Status Returned';
            //});
            //console.log(theStatus);
            //return theStatus
            var result = $.grep(resp.sites, function(e){ return e.reference_designator == platform_ref_des; });
            //console.log('result');
            //console.log(result);
            if (result.length == 0) {
                //console.log('No Status Returned');
                output.status = "No Status Returned";
                output.mindepth = "Unavailable";
                output.maxdepth = "Unavailable";
            } else if (result.length == 1) {
                // access the foo property using result[0].foo
                //console.log('Found: ' + platform_ref_des);
                //console.log(result[0].status);
                output.status = result[0].status;
                output.mindepth = result[0].mindepth;
                output.maxdepth = result[0].maxdepth;
            } else {
                // multiple items found
                //console.log('Multiple Status Returned');
                output.status = 'Multiple Status Returned';
                output.mindepth = "Unavailable";
                output.maxdepth = "Unavailable";
            }

        },

        error: function( req, status, err ) {
            console.log(req);
        }
    });
    return output;
};

var ArrayStatusModel = OOI.RelationalModel.extend({
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
    toGeoJSON: function() {
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
                var statusReturn = GetPlatformStatus(attrs.array_code, platform.properties.code);
                platform.properties.status = statusReturn.status;
                platform.properties.mindepth = statusReturn.mindepth;
                platform.properties.maxdepth = statusReturn.maxdepth;
            });
        }


        var geoJSON = {
            "type": "Feature",
            "properties": {
                "description": "<span>"+attrs.array_name+"</span>",
                "code": attrs.array_code,
                "title": attrs.array_name,
                "marker-symbol": 'dot',
                "platforms": attrs.platforms,
                "status": GetArrayStatus(attrs.array_code)
            },
            "geometry": {
                "type": "Point",
                "coordinates": newArray
            }

        };
        return geoJSON;
    }
});


var ArrayStatusCollection = Backbone.Collection.extend({
    url: '/api/array',
    model: ArrayStatusModel,
    parse: function(response) {
        if (response) {
            return response.arrays;
        }
        return [];
    },
    toGeoJSON: function() {
        var geoJSONified = this.map(function(model) {
            return model.toGeoJSON();
        });
        return geoJSONified;
    }
});

