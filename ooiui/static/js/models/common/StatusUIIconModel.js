var StatusUIIconModel = Backbone.Model.extend({
  url: "json/statusUIIcon.json",
  defaults: {
    value: "",
    key: "",
    metaId: "",
    assetId: "",
    classCode: ""
  }
});
var StatusUIIconCollection = Backbone.Collection.extend({
  url: "json/statusUIIcon.json",// ooi-ui/ooiui/static/json/statusUIIcon.json
  // model: StatusUIIconModel,
  parse: function(response) {
    console.log('response');
    console.log(response);
    return response;
  }
});
