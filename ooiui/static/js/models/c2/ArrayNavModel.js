var ArrayNavModel = Backbone.Model.extend({

});

var ArrayNavCollection = Backbone.Collection.extend({
  url: '/api/c2/arrays',
  model: ArrayNavModel,
  parse: function(response, options) {
    return response.arrays;
  }
});

var ArrayHistoryModel = Backbone.Model.extend({
  url: '/api/array',
  parse: function(response, options) {
    return response.history;
  }
});

var ArrayPlatformModel = Backbone.Model.extend({
  url: '/api/array',
  parse: function(response, options) {
    return response.current_status_display;
  }
});

/*var ArrayMissionModel = Backbone.Model.extend({
  url: '/api/array',
  parse: function(response, options) {
    return response.arrays;
  }
});*/