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
    stream_display_name: "",
    download: "",
    start: "",
    end: "",
    reference_designator: "",
    display_name: "",
    long_display_name: "",
    platform_name: "",
    variables: [],
    variable_types: {},
    preferred_timestamp: "",
    provenance: "",
    annotations: "",
    email: "",
    user_name: "",
    parameter_display_name: "",
    site_name: "",
    assembly_name: "",
    lat_lon: "",
    depth: "",
    freshness: "",
    reference_designator_first14chars:""
  },

  getURL: function(type) {
    if(type == 'json') {
      var url = '/api/uframe/get_json/' + this.get('stream_name') + '/' + this.get('reference_designator')+"/"+this.get('start')+"/"+this.get('end')+"/"+this.get('provenance')+"/"+this.get('annotations')+"?user="+this.get('user_name')+'&email='+this.get('email');
    } else if(type == 'profile_json_download') {
      var url = '/api/uframe/get_profiles/' + this.get('stream_name') + '/' + this.get('reference_designator')+"/"+this.get('start')+"/"+this.get('end')+"?user="+this.get('user_name')+'&email='+this.get('email');
    } else if(type == 'netcdf') {
      var url = '/api/uframe/get_netcdf/' + this.get('stream_name') + '/' + this.get('reference_designator')+"/"+this.get('start')+"/"+this.get('end')+"/"+this.get('provenance')+"/"+this.get('annotations')+"?user="+this.get('user_name')+'&email='+this.get('email');
    } else if(type == 'csv') {
      var url = '/api/uframe/get_csv/' + this.get('stream_name') + '/' + this.get('reference_designator')+"/"+this.get('start')+"/"+this.get('end')+"?user="+this.get('user_name')+'&email='+this.get('email');
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
    data.ref_des = data.reference_designator;
    data.reference_designator_first14chars = data.reference_designator.substring(0,14);
    data.assetInfo = {  'name' : data.display_name,
                        'array': data.array_name,
                        'site' : data.site_name,
                        'platform': data.platform_name,
                        'assembly': data.assebly_name
                    };
    data.unique_id = data.reference_designator + data.stream_name;
    return data;
  }
});

var StreamCollection = Backbone.Collection.extend({
    initialize: function(options) {
        this.options = options || {};
        return this;
    },
    url: function() {
        // if the constructor contains a searchId, modify the url.
        var url = '/api/uframe/stream';
        return (this.options.searchId) ? url +  '?search=' + this.options.searchId || "" : url;
    },
    model: StreamModel,
    parse: function(response) {
        if(response) {
            this.trigger("collection:updated", { count : response.count, total : response.total, startAt : response.startAt } );
            return response.streams;
        }
        return [];
    },
    byArray: function(array) {
        var filtered = this.filter(function (model) {
            return model.get('reference_designator').substring(0,2) === array;
        });
        return new StreamCollection(filtered);
    },
    byEng: function(bool) {
        if (!bool) {
            var filtered = this.filter(function (model) {
                return model.get('reference_designator').indexOf('ENG') === -1;
            });
            return new StreamCollection(filtered);
        } else {
            return this;
        }
    },
    byEndTime: function(binary) {
        var filtered = this.filter(function (model) {
            var time = new Date(model.get('end')),
                timeSinceEnd = new Date().getTime() - time.getTime(),
                twentyFour = 86400000,
                allTime = 3,
                recent24 = 1,
                older = 2;

            switch (true) {

                case (binary === recent24):
                    return timeSinceEnd <= twentyFour;
                break;

                case (binary === older):
                    return timeSinceEnd > twentyFour;
                break;

                case (binary === allTime):
                    return true;
                break;

                default:
                    return false;
            }
        });
        return new StreamCollection(filtered);
    }
});
