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
      baseUrl: "",
      map: {}
  }
});

var CamImageNavigationCollection = Backbone.Collection.extend({
  url: '',
  model: CamImageNavigationModel,
  parse: function(response) {
    if(response) {
      return response.map;
    }
    return [];
  }
});

var CamImageInstrumentsModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
      baseUrl: "/api/uframe/media/get_instrument_list/CAMDS",
      instruments: []
  }
});

var CamImageInstrumentsCollection = Backbone.Collection.extend({
  url: '/api/uframe/media/get_instrument_list/CAMDS',
  model: CamImageInstrumentsModel,
  parse: function(response) {
    if(response) {
      return response.instruments;
    }
    return [];
  }
});

var CamImageDataBoundsModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
      baseUrl: "/api/uframe/media/get_data_bounds/",
      instruments: []
  }
});

var CamImageDataBoundsCollection = Backbone.Collection.extend({
  url: '/api/uframe/media/get_data_bounds/CE02SHBP-MJ01C-08-CAMDSB107',
  model: CamImageDataBoundsModel,
  parse: function(response) {
    if(response) {
      return response.bounds;
    }
    return [];
  }
});

var CamImageYearsModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
      baseUrl: "",
      years: []
  }
});

var CamImageYearsCollection = Backbone.Collection.extend({
  url: '',
  model: CamImageYearsModel,
  parse: function(response) {
    if(response) {
      return response.years;
    }
    return [];
  }
});

var CamImageMonthsModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
      baseUrl: "",
      months: []
  }
});

var CamImageMonthsCollection = Backbone.Collection.extend({
  url: '',
  model: CamImageMonthsModel,
  parse: function(response) {
    if(response) {
      return response.months;
    }
    return [];
  }
});

var CamImageDaysModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
      baseUrl: "",
      days: []
  }
});

var CamImageDaysCollection = Backbone.Collection.extend({
  url: '',
  model: CamImageDaysModel,
  parse: function(response) {
    if(response) {
      return response.days;
    }
    return [];
  }
});


var CamImageVocabModel = Backbone.Model.extend({
  urlRoot: '#',
  defaults: {
      baseUrl: "",
      days: []
  }
});

var CamImageVocabCollection = Backbone.Collection.extend({
  url: '', // /api/uframe/media/vocab/<string:ref_des>
  model: CamImageVocabModel,
  parse: function(response) {
    if(response) {
      return response.vocab;
    }
    return [];
  }
});

