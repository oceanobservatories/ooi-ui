var StatusUIIconModel = Backbone.Model.extend({
   url: "/api/asset_deployment",
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
        serialNumber: "0000",
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
  url: "/api/asset_deployment",
  parse: function(response) {
    console.log('response');
    console.log(response);
    return response.assets;
  }
});


