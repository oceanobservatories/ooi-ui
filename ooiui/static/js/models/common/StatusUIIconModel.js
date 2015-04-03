var StatusUIIconModel = Backbone.Model.extend({
  //url: "json/statusIcon.json", 
   url: "/api/asset_deployment",
 // url: "http://localhost:4000/uframe/assets",
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
  }
});
var StatusUIIconCollection = Backbone.Collection.extend({
  //url: "json/statusIcon.json",
  url: "/api/asset_deployment", 
 // url: "http://localhost:4000/uframe/assets",
  parse: function(response) {
    return response.assets;
  }
});
