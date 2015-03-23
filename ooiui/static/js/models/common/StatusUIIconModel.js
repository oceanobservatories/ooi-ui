var StatusUIIconModel = Backbone.Model.extend({
  url: "json/statusIcon.json", 
  //localhoset:4000/uframe/assets
  defaults: {
    assetId: "",
    assetInfo: "",
    description: "",
    name: "",
    owner: "",
    type: "",
    coordinates: "",
    launch_date_time: "",
    manufacturer: "",
    notes: "",
    ref_des: "",
    uframe_url: "",
    water_depth: "",
    seriesClassifiction: ""
  }
});
var StatusUIIconCollection = Backbone.Collection.extend({
  url: "json/statusIcon.json",// ooi-ui/ooiui/static/json/statusUIIcon.json
  //localhoset:4000/uframe/assets
  
  // model: StatusUIIconModel,
  parse: function(response) {
    console.log('response');
    console.log(response);
    return response.assets;
  }
});
