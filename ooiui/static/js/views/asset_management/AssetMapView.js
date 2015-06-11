"use strict";
/*
 *
 * ooiui/static/js/models/asset_management/AssetMapView.js
 * Validation model for Alerts and Alarms Page.
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/compiled/alertPage.js
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 * 
 */

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
  },

  addStation: function(filtered_model) {
    var self = this;
    var map = self.map;
    if (filtered_model.get('coordinates') !="NA"){
      if (!isNaN(filtered_model.get('coordinates')[0]) &&  !isNaN(filtered_model.get('coordinates')[1])){
        var latlong = filtered_model.get('coordinates');

        var circleStyleOptions = {
            radius: 14,
            fillColor: "#5e5e5e",
            color: "#2D2D2D",
            weight: 3,
            opacity: .9,
            fillOpacity: .9
        };
        
        //Not working now but if there were a status in the asset return
        if(filtered_model.get('status')){
          if(filtered_model.get('status')=='issue'){
            circleStyleOptions['fillColor'] = '#FFE944';
          }
          else if(filtered_model.get('status')=='ok'){
            circleStyleOptions['fillColor'] = '#006eff';
          }
          else if(filtered_model.get('status')=='error'){
            circleStyleOptions['fillColor'] = '#E03D2C';
          }
        }

        //currently everything is blue ok
        circleStyleOptions['fillColor'] = '#006eff';
        var marker = L.circleMarker(latlong, circleStyleOptions);

        marker.bindPopup(self.getPopupContent(filtered_model.get('@class'),filtered_model.get('assetInfo'),filtered_model.get('launch_date_time'),filtered_model.get('water_depth'),filtered_model.get('ref_des')))
        marker.addTo(map);
      };
    };
  },

  getPopupContent: function( classtype,info,launch_date,water_depth,ref_des){
    
    var popstr =   '<div class="popup-map-btn">'+
        "<br><b>"+  info['name']+ 
        "<br></b><br> <b>Launch Date:</b> "+ launch_date+ 
        "<br> <b>Class:</b> "+ classtype+ 
        "<br> <b>Type:</b> "+ info['type'] +
        "<br> "+ "<b>Depth:</b> "+ water_depth['value'] + " m "+
        /*'<button type="button" class="popup-map-btn-plot btn btn-info btn-sm" data-toggle="modal" data-target="#myModal">'+                                
            '<span class="glyphicon glyphicon-stats"></span> Plot data'+
        '</button>'+
        '<button type="button" class="popup-map-btn-download btn btn-default btn-sm">'+                                
            '<span class="glyphicon glyphicon-save"></span> Download data'+
        '</button>'+*/
        "</div>"   
   
    return popstr
  }   
});