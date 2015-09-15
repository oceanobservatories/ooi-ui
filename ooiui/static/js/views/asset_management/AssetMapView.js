"use strict";
/*
 * ooiui/static/js/models/asset_management/AssetMapView.js 
 */

var AssetMapView = Backbone.View.extend({
  events: {    
  },
  initialize: function() {
    _.bindAll(this, "render","renderMap","addStation",'clearStation');    
    this.render();
  },  
  template: JST['ooiui/static/js/partials/AssetMap.html'],
  render: function() {
    this.$el.html(this.template());
    this.renderMap(null);
  },
  renderMap: function(options) {
    var self = this;

    var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>';
    var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ';

    var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr});

    self.map = L.map('map', {
      center: [39.73, -104.99],
      zoom: 2,
      layers: [grayscale]
    });

    
  },
  clearStation:function(){

  },
  renderGeographicStatus:function(model,alert_info){ 
    //render geographic status for a region, platform, array    

    var self = this; 

    var states = [{
        "type": "Feature",
        "properties": {"array": "CE"},
        "geometry": model.attributes.geo_location
    }];

    var myStyle = {
        "color": "yellow",
        "weight": 5,
        "opacity": 0.75
    };   


    /*
    if (alert_info.get('event_type')){
      if(alert_info.get('event_type')=='alert'){
        myStyle['color'] = 'yellow';      
      }else if(alert_info.get('status')=='alarm'){
        myStyle['color'] = 'red';  
      }
    }
    */

    L.geoJson(states, {
        style: myStyle
    }).addTo(self.map);

  },
  addStation:function(station_model,alert_info){
    var self = this;    
    if (station_model.get('reference_designator') == "CE01ISSP-XX099-01-CTDPFJ999"){
      station_model.set('coordinates',[41,-72]);
    };

    //TODO GET POSITION
    if (station_model.get('coordinates') && !_.isUndefined(alert_info)){
      var circleStyleOptions = {
            radius: 14,
            fillColor: "#5e5e5e",
            color: "#2D2D2D",
            weight: 3,
            opacity: .9,
            fillOpacity: .9
      };

      if(alert_info.get('event_type')=='alert'){
        circleStyleOptions['fillColor'] = 'yellow';
      }else if(alert_info.get('status')=='alarm'){
        circleStyleOptions['fillColor'] = 'red';
      }else{
        circleStyleOptions['fillColor'] = 'gray';
      }

      var marker = L.circleMarker(station_model.get('coordinates'), circleStyleOptions);
      //TODO Create marker fucntion
      marker.bindPopup("<div><br>"+alert_info.get('event_type')+"<br></div>")
      marker.addTo(self.map);      
    }else{
      ooi.trigger('invalidLatLon');
    }
  }
});