"use strict";
/*
 * ooiui/static/js/models/science/StreamModel.js
 * Model definitions for Streams
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * - ooiui/static/js/models/science/PlatformDeploymentModel.js
 * Usage
 */

var StreamModel = Backbone.Model.extend({
  urlRoot: '/api/uframe/stream',
  defaults: {
    stream_name: "",
    download: "",
    start: "",
    end: "",
    reference_designator: "",
    display_name: "",
    variables: [],
    variable_types: {},
    preferred_timestamp: ""
  },
  getURL: function(type) {
    if(type == 'json') {
      var url = '/api/uframe/get_json/' + this.get('stream_name') + '/' + this.get('reference_designator') ;
    } else if(type == 'profile_json_download') {
      var url = '/api/uframe/get_profiles/' + this.get('stream_name') + '/' + this.get('reference_designator');
    } else if(type == 'netcdf') {
      var url = '/api/uframe/get_netcdf/' + this.get('stream_name') + '/' + this.get('reference_designator');
    } else if(type == 'csv') { 
      var url = '/api/uframe/get_csv/' + this.get('stream_name') + '/' + this.get('reference_designator');
    }
    return url;
  },
  getData: function(options) {
    console.log("testing",this.attributes)
    $.ajax({
      url: this.getURL('json')+"/"+moment(this.get('start')).format("YYYY-MM-DDTHH:mm:ss") +".0Z/" + moment(this.get('end')).format("YYYY-MM-DDTHH:mm:ss") + ".0Z/0",
      dataType: 'json',
      success: options.success,
      error: options.error
    });
  },
  parse: function(data, options) {
    if(data && data.start && data.end) {
      data.start = new Date(data.start * 1000);
      data.end = new Date(data.end * 1000);
    }
    return data;
  }
});

var StreamCollection = Backbone.Collection.Lunr.extend({
  url: '/api/uframe/stream',
  model: StreamModel,
  lunroptions: {
    fields: [
      { name: "stream_name" },
      { name: "reference_designator" }
    ]
  },
  parse: function(response) {
    if(response) {
      return response.streams;
    }
    return [];
  }
});
