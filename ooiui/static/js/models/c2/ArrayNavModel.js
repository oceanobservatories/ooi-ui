var ArrayNavModel = Backbone.Model.extend({

});

var ArrayNavCollection = Backbone.Collection.extend({
  url: '/api/c2/arrays',
  model: ArrayNavModel,
  parse: function(response, options) {
    return response.arrays;
  }
});

//this would be for sending in url parameter
var ArrayRequestModel = Backbone.Model.extend({
  url: function(){
    return this.instanceUrl;
  },
  initialize: function(props){
    this.instanceUrl = props.url;
  },
  parse: function(response, options) {
    return response;
  }
});


//easier to just define url when fetching
var ArrayDataModel = Backbone.Collection.extend({
  //url: '/api/c2/array/value',
  parse: function(response, options) {
    return response;
  }
});
