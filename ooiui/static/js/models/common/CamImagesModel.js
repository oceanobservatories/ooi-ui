"use strict";

var CamImageModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
      baseUrl: "/api/uframe/get_cam_image/",
      data_link: null,
      date: "2009-12-07",
      datetime: "20091207T033351.474Z",
      filename: "CE02SHBP-MJ01C-08-CAMDSB107_20091207T033351,474Z.png",
      reference_designator: "CE02SHBP-MJ01C-08-CAMDSB107",
      thumbnail: "ooiservices/cam_images/imageNotFound404.png",
      url: "https://rawdata.oceanobservatories.org/files/CE02SHBP/MJ01C/08-CAMDSB107/2009/12/07/CE02SHBP-MJ01C-08-CAMDSB107_20091207T033351,474Z.png"
  }
});

var CamImageCollection = Backbone.Collection.extend({
  url: '/api/uframe/media/test',
  model: CamImageModel,
  parse: function(response) {
    if(response) {
      return response.media;
    }
    return [];
  }
});

var CamImageNavigationModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
      baseUrl: "/api/uframe/get_cam_navigation",
      arrays: {},
      platforms: {},
      instruments: {},
      media_toc: {}
  }
});

var CamImageNavigationCollection = Backbone.Collection.extend({
  url: '/api/uframe/media/get_cam_navigation',
  model: CamImageNavigationModel,
  parse: function(response) {
    if(response) {
      return response.navigation;
    }
    return [];
  }
});


