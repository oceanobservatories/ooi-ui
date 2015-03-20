var ArrayNavModel = Backbone.Model.extend({


});

var ArrayNavCollection = Backbone.Collection.extend({
  url: '/api/array',
  model: ArrayNavModel,
  parse: function(response, options) {
    console.log(response);
    return response.arrays;
  }
});