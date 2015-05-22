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
  //urlRoot: '/api/uframe/get_toc',
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
      var url = '/api/uframe/get_json/' + this.get('stream_name') + '/' + this.get('reference_designator')+"/"+this.get('start')+"/"+this.get('end');
    } else if(type == 'profile_json_download') {
      var url = '/api/uframe/get_profiles/' + this.get('stream_name') + '/' + this.get('reference_designator')+"/"+this.get('start')+"/"+this.get('end');
    } else if(type == 'netcdf') {
      var url = '/api/uframe/get_netcdf/' + this.get('stream_name') + '/' + this.get('reference_designator')+"/"+this.get('start')+"/"+this.get('end');
    } else if(type == 'csv') { 
      var url = '/api/uframe/get_csv/' + this.get('stream_name') + '/' + this.get('reference_designator')+"/"+this.get('start')+"/"+this.get('end');
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
    return data;
  }
});

var StreamCollection = Backbone.Collection.extend({
  url: '/api/uframe/stream',
  model: StreamModel,
  parse: function(response) {
    if(response) {
        this.trigger("collection:updated", { count : response.count, total : response.total, startAt : response.startAt } );
        return response.streams;
    }
    return [];
  }
});