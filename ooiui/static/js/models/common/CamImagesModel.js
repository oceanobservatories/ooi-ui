"use strict";

var CamImageModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
    datetime:"",
    filename: "",
    reference_designator: "",
    url:"",
    thumbnail:"",
    baseUrl:"/api/uframe/get_cam_image/"
  }
});

var CamImageCollection = Backbone.Collection.extend({
  url: '/api/uframe/cam_images',
  model: CamImageModel,
  parse: function(response) {
    if(response) {
      return response.cam_images;
    }
    return [];
  }
});
