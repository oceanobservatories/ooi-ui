"use strict";
/*
 * ooiui/static/js/models/science/ArrayStatusModel.js
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

/*var GetArrayStatus = function(array_code) {
  //console.log(array_code);
  //console.log(platform_ref_des);
  var output = "Fetching Status Failed";
  $.ajax('/api/uframe/status/arrays', {
    type: 'GET',
    dataType: 'json',
    timeout: 5000,
    async: false,
    success: function (resp) {
      // console.log('Success getting array status');
      // console.log(resp);
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
    timeout: 5000,
    async: false,
    success: function (resp) {
      var result = $.grep(resp.sites, function(e){ return e.reference_designator == platform_ref_des; });

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

var GetSitesStatus = function(array_code) {
  //console.log(array_code);
  //console.log(platform_ref_des);

  var allSitesStatus = [];

  $.ajax('/api/uframe/status/sites/' + array_code, {
    type: 'GET',
    dataType: 'json',
    timeout: 500,
    async: false,
    success: function (resp) {

      // console.log('resp');
      // console.log(resp);
      var theSites = resp.sites;
      _.each(theSites, function(site){
        var output = {};
        output.geometry = {};
        output.geometry.coordinates = [null,null];
        output.geometry.type = "Point";
        output.properties = {};
        // console.log('site');
        // console.log(site);
        output.geometry.coordinates = [site.longitude, site.latitude];
        output.properties['code'] = site.reference_designator;
        output.properties['depth'] = site.depth;
        output.properties['waterDepth'] = site.waterDepth;
        output.properties['mindepth'] = site.mindepth;
        output.properties['maxdepth'] = site.maxdepth;
        output.properties['description'] = site.display_name;
        output.properties['marker-symbol'] = "harbor_icon";
        output.properties['title'] = site.display_name;
        output.properties['status'] = site.status;

        output.type = "Feature";

        // console.log('output before push');
        // console.log(output);

        allSitesStatus.push(output);
        // console.log('allSitesStatus');
        // console.log(allSitesStatus);
      });

    },

    error: function( req, status, err ) {
      console.log(req);
    }
  });
  return allSitesStatus;
};*/


/*    {
 "display_name": "Global Southern Ocean",
 "latitude": -54.0814,
 "longitude": -89.6652,
 "reason": null,
 "reference_designator": "GS",
 "status": {
 "count": 0,
 "legend": {
 "degraded": 0,
 "failed": 0,
 "notTracked": 0,
 "operational": 0,
 "removedFromService": 0
 }
 }
 },*/
var ArrayStatusModel = OOI.RelationalModel.extend({
  urlRoot: '/api/uframe/status/arrays',
  defaults: {
    display_name: "",
    latitude: null,
    longitude: null,
    reason: "",
    reference_designator: "",
    status: {},
    count: null,
    legend: {},
    platforms: []
  },
  parse: function(data) {
    // we have the cabled array at the same location as the coastal endurance,
    // the cabled array is a bit farther off set from the endurance.
    var attrs = _.clone(data),
      cabledArrayLat = 45.8305,
      cabledArrayLon = -128.7533;

    if (attrs.reference_designator.indexOf('RS') > -1) {
      attrs.latitude = cabledArrayLat;
      attrs.longtiude = cabledArrayLon;
    }

    attrs.code = attrs.reference_designator;
    return data;
  },
  // geoJSON
  toGeoJSON: function() {
    var attrs = _.clone(this.attributes),
      newArray = [attrs.longitude, attrs.latitude];

    if (attrs.reference_designator.indexOf('RS') > -1) {
      newArray = [-128.7533, 45.8305];
    }

    var geoJSON = {
      "type": "Feature",
      "properties": {
        "description": "<span>"+attrs.display_name+"</span>",
        "code": attrs.reference_designator,
        "title": attrs.display_name,
        "marker-symbol": 'dot',
        "platforms": attrs.platforms
        //"platforms": GetSitesStatus(attrs.reference_designator)
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
  url: '/api/uframe/status/arrays',
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
  },
  sortByField: function(field, direction){
    var sorted = _.sortBy(this.models, function(model){
      return model.get(field);
    });

    if(direction === 'descending'){
      sorted = sorted.reverse()
    }

    this.models = sorted;
  }
});

