var StatusUIModel= Backbone.Model.extend({
  urlRoot: "/api/asset_deployment",
  defaults: {
    assets: "",
    assetId: "",
    assetInfo: "",
      description: "",
        name: "",
        owner: "",
        type: "",
    attachments: "",
    class: "",
    display_name: "Metadata Error: Name Not Found",
    coordinates: "NA",
    launch_date_time: "NA",
    manufactureInfo: "",
      manufacturer: "",
      modelNumber: "",
      serialNumber: "",
    notes: "",
    seriesClassifiction: "",
    ref_des: "",
    uframe_url: "",
    url: "",
    water_depth: "",
      unit: "",
      uvalue: ""
  },
   get_display_name: function(){
     var self = this;
     self.set('display_name', this.get('display_name'));
   }
});
var StatusUICollection= Backbone.Collection.extend({
 //url: "json/statusIcon.json",
 url: "/api/asset_deployment",
 // url: "http://localhost:4000/uframe/assets",
 model: StatusUIModel,
 parse: function(response, options) {
   return response.assets;
  }
});  
