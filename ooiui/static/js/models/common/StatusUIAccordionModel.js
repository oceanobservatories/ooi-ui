var StatusUIAccordionModel = Backbone.Model.extend({
  //url: "json/statusIcon.json", 
   //urlRool: "/api/display_name?reference_designator=",
 // url: "http://localhost:4000/uframe/assets",
   get_display_name: function(){
      
   var ref = this.get('ref_des');
   var xhr = new XMLHttpRequest();
   var self =this;


  xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        //add try and catch
        //console.log(xhr.responseText["proper_display_name"]);
        var myArr = JSON.parse(xhr.responseText);
        self.set('display_name', myArr["proper_display_name"]);
      }
      else{ 
        self.set('display_name', 'Undefined');
      }
   };

  
   xhr.open('GET', 'http://localhost:5000/api/display_name?reference_designator='+ref);
   xhr.send();   

   },

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
var StatusUIAccordionCollection = Backbone.Collection.extend({
// url: "json/statusIcon.json",
 url: "/api/asset_deployment", 
 // url: "http://localhost:4000/uframe/assets",
 model: StatusUIAccordionModel,

 parse: function(response, collection) {
      
    return response.assets;
  },
  });  

