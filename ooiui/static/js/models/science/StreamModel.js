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
    variables: [],
    variable_types: {},
    preferred_timestamp: ""
  },
  getURL: function(type) {
    if(type == 'json') {
      var url = '/api/uframe/get_json/' + this.get('stream_name') + '/' + this.get('reference_designator');
    } else if(type == 'netcdf') {
      var url = '/api/uframe/get_netcdf/' + this.get('stream_name') + '/' + this.get('reference_designator');
    } else if(type == 'csv') { 
      var url = '/api/uframe/get_csv/' + this.get('stream_name') + '/' + this.get('reference_designator');
    }
    return url;
  },
  getData: function(options) {
    $.ajax({
      url: this.getURL('json'),
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

var StreamCollection = Backbone.Collection.extend({
  url: '/api/uframe/stream',
  model: StreamModel,
  parse: function(response) {
    if(response) {
      return response.streams;
    }
    return [];
  }
});
