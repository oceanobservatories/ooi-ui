/* Created by Jim Case
 *
 * @defaults
 *      id: The full object identification path. may be left out in response.
 *      name: The name of the document
 *      url: The downlaod URL of the ojbect.
 *
 */

/*    {
      "depth": null,
      "display_name": "Oregon Slope Base Shallow Profiler Mooring",
      "latitude": 44.52897,
      "longitude": -125.38966,
      "maxdepth": 2905.0,
      "mindepth": 5.0,
      "reason": null,
      "reference_designator": "RS01SBPS",
      "status": "notTracked",
      "uid": "ATAPL-68870-001-0143",
      "waterDepth": null
    },*/
var SiteStatusModel = Backbone.Model.extend({
  defaults: {
      depth: null,
      display_name: "",
      latitude: null,
      longitude: null,
      maxdepth: null,
      mindepth: null,
      reason: null,
      reference_designator: "",
      status: "",
      uid: "",
      waterDepth: null
  },
  toGeoJSON: function() {
    var attrs = _.clone(this.attributes),
      newArray = [attrs.longitude.toFixed(5), attrs.latitude.toFixed(5)];

    var geoJSON = {
      "type": "Feature",
      "properties": {
        "description": "<span>"+attrs.display_name+"</span>",
        "code": attrs.reference_designator,
        "title": attrs.display_name,
        "marker-symbol": (attrs.reference_designator.indexOf('GL') > -1) ? 'airfield_icon' : 'harbor_icon',
        "depth": attrs.depth,
        "status": attrs.status
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

var SiteStatusCollection = Backbone.Collection.extend({
  model: SiteStatusModel,
/*  url: function(reference_designator) {
    // if the constructor contains a searchId, modify the url.
    var url = '/api/uframe/status/sites/';
    console.log(this);
    return (reference_designator) ? url + reference_designator || "" : url;
  },*/
  toGeoJSON: function() {
    var geoJSONified = this.map(function(model) {
      return model.toGeoJSON();
    });
    return geoJSONified;
  },
  parse: function(response) {
      console.log(response);
    'use strict';
    // if the response is valid, return the results object
    if (response) { return response.sites; } else { return []; }
  },
  sortByField: function(field, direction){
    var sorted = _.sortBy(this.models, function(model){
      return model.get(field);
    });

    if(direction === 'descending'){
      sorted = sorted.reverse()
    }

    this.models = sorted;
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
        return platform.get('reference_designator').substr(0,2) === array;
      }
    });
    return new PlatformCollection(filtered);
  },
  initialize: function () {
  }
});
