/* Created by Jim Case
 *
 * @defaults
 *      id: The full object identification path. may be left out in response.
 *      name: The name of the document
 *      url: The downlaod URL of the ojbect.
 *
 */

/*{
 "platforms": [
 {
 "header": {
 "code": "SF",
 "status": "degraded",
 "title": "Shallow Profiler"
 },
 "items": [
 {
 "depth": null,
 "display_name": "CTD",
 "end": "2017-01-19T00:35:00.965Z",
 "latitude": 44.52897,
 "longitude": -125.38966,
 "maxdepth": 200.0,
 "mindepth": 5.0,
 "reason": null,
 "reference_designator": "RS01SBPS-SF01A-2A-CTDPFA102",
 "start": "2017-01-18T00:00:00.474Z",
 "status": "notTracked",
 "uid": "ATAPL-66662-00002",
 "waterDepth": null
 },
 {
 "depth": null,
 "display_name": "3-Wavelength Fluorometer",
 "end": "2017-01-08T23:59:58.407Z",
 "latitude": 44.52897,
 "longitude": -125.38966,
 "maxdepth": 200.0,
 "mindepth": 5.0,
 "reason": null,
 "reference_designator": "RS01SBPS-SF01A-3A-FLORTD101",
 "start": "2017-01-08T00:00:00.759Z",
 "status": "notTracked",
 "uid": "ATAPL-58322-00009",
 "waterDepth": null
 }
 ]
 }
 ]
 }*/

var PlatformsHeaderModel = Backbone.Model.extend({
  defaults: {
    code: "",
    status: "",
    title: ""
  }
});

var PlatformsInstrumentModel = Backbone.Model.extend({
  defaults: {
    depth: null,
    display_name: "",
    end: "",
    latitude: null,
    longitude: null,
    maxdepth: null,
    mindepth: null,
    reason: "",
    reference_designator: "",
    start: "",
    status: "",
    uid: "",
    waterDepth: null
  }
});
var PlatformsStatusModel = Backbone.Model.extend({
  defaults: {
    header: PlatformsHeaderModel,
    items: PlatformsInstrumentModel
  },
  toGeoJSON: function() {
    // console.log('in toGeoJSON');
    // console.log(this.attributes);
    var items = _.clone(this.attributes);
    var geoJSONArray = [];
    _.each(this.attributes.items, function(attrs) {
      // console.log('attrs');
      // console.log(attrs);
      var newArray = [attrs.longitude.toFixed(5), attrs.latitude.toFixed(5)];

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
      geoJSONArray.push(geoJSON);
    });




    return geoJSONArray;
  }
});


var PlatformsStatusCollection = Backbone.Collection.extend({
  model: PlatformsStatusModel,

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
    if (response) { return response.platforms; } else { return []; }
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
