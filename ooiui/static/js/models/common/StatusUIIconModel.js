var StatusUIIconModel = Backbone.Model.extend({
  url: "json/statusUIIcon.json",
  defaults: {
    value: "",
    key: "",
    metaId: ""
  }
});
var StatusUIIconCollection = Backbone.Collection.extend({
  model: StatusUIIconModel,
  url: "json/statusUIIcon.json",// ooi-ui/ooiui/static/json/statusUIIcon.json
  parse: function(response, options) {
    console.log(response);
    return response.objects
  }
});
