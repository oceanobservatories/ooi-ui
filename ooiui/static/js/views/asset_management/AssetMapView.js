"use strict";


var AssetMapView = Backbone.View.extend({
  events: {    
  },
  initialize: function() {
    _.bindAll(this, "render");
    var self = this;
    self.render();
  },  
  template: JST['ooiui/static/js/partials/AssetMap.html'],
  render: function() {
    this.$el.html(this.template());
  },
  renderMap: function() {
    L.Icon.Default.imagePath = '/img';
    var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      mbUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';   
    var grayscale   = L.tileLayer(mbUrl, {id: 'examples.map-20v6611k', attribution: mbAttr});    

    this.map = L.map('map',{
         center: [20.505, -80.09],
         zoom: 3,
         maxZoom: 10,
         minZoom: 3,
         layers: [grayscale]
    });
        
  },
  clearContents: function() {
    console.log("render map")
  },
  addStation: function(filtered_model) {
    var self = this;
    var map = self.map;
    if (filtered_model.get('coordinates') !="NA"){
      if (filtered_model.get('coordinates')[0] != null && filtered_model.get('coordinates')[1] !=null){
        var marker = L.marker(filtered_model.get('coordinates'))
        marker.bindPopup("<b>"+filtered_model.get('display_name') + "</b> <br>")
        marker.addTo(map);
      };
    };
  }    
   
});