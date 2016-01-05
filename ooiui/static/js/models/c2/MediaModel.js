"use strict";
/*
 * ooiui/static/js/models/c2/MediaModel.js
 */

//Used to handle camera media

var MediaModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
    "type":"camera",
    "name":"",
    "cameraId":"",
    "url":"",
    "fileSize":"",
    "date":""
  }
});

var MediaCollection = Backbone.Collection.extend({
  url: '/json/media_assets.json',
  model: MediaModel,
  parse: function(response) {
    if(response) {
      return response.media;
    } else {
      return [];
    }
  }
});
