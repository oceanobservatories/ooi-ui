"use strict";
/*
 * ooiui/static/js/models/asset_management/AssetMapView.js 
 */

var AssetMapView = Backbone.View.extend({
  events: {    
  },
  initialize: function() {
    _.bindAll(this, "render","renderMap","addStations",'clearStations');    
    this.render();
  },  
  template: JST['ooiui/static/js/partials/AssetMap.html'],
  render: function() {
    this.$el.html(this.template());
    this.renderMap(null);
  },
  renderMap: function(options) {
    var self = this;

    var Esri_OceanBasemap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
      maxZoom: 13,
      minZoom: 2
    });

    self.map = L.map('map', {
      center: [39.73, -104.99],
      zoom: 2,
      layers: [Esri_OceanBasemap]
    });

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

          var div = L.DomUtil.create('div', 'info legend'),
              labels = ['Unknown','Healthy','Alert','Alarm'],
              colors = ['gray','blue','yellow','red'];

          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < labels.length; i++) {
              div.innerHTML += '<i style="background:'+colors[i]+'"></i> ' + 
              labels[i] +'<br><br>';
          }

      return div;
    };
    legend.addTo(self.map);




    //self.markers = new L.FeatureGroup();
    self.markers = new L.MarkerClusterGroup({iconCreateFunction: function (cluster) {
                      var childCount = cluster.getChildCount();
                      var childMarkers = cluster.getAllChildMarkers();

                      //get the unique list
                      var clusterStatus = _.uniq(_.map(childMarkers, function(item){return item.options.data}));
                      
                      var c = ' status-marker-cluster-';
                      if (_.indexOf(clusterStatus, "alarm")>-1){
                        c += 'alert';
                      }else if (_.indexOf(clusterStatus, "alarm")>-1){
                        c += 'alarm';
                      }else if (_.indexOf(clusterStatus, "healthy")>-1){
                        c += 'healthy';
                      }else{
                        c += 'unknown';
                      }  

                      return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
                    }, spiderfyDistanceMultiplier:2,showCoverageOnHover: false});


    self.map.addLayer(self.markers);
  },
  clearStations:function(){
    this.markers.clearLayers();
  },
  updateMap:function(){
    this.map.invalidateSize(false);  
  },
  renderGeographicStatus:function(model,alert_info){ 
    //render geographic status for a region, platform, array    

    var self = this; 

    var c = [{
        "type": "Feature",
        "properties": {"array": "CE"},
        "geometry": model.get('geo_location')
    }];

    var myStyle = {
        "color": "yellow",
        "weight": 5,
        "opacity": 0.75
    };   

    L.geoJson(filteredList, {
        style: myStyle
    }).addTo(self.map);

  },
  getColor:function(event_type){
    if(event_type=='alert'){
      return 'yellow';
    }else if(event_type=='alarm'){
      return 'red';      
    }else if (event_type=='inactive'){
      return 'steelblue';
    }else{
      return 'gray';
    }
  },
  addStations:function(){    
    var self = this;    
    self.collection.each(function(station_model,i){            
      if (station_model.get('coordinates') && !_.isUndefined(station_model)){      
        var circleStyleOptions = {
              radius: 12,
              fillColor: "#5e5e5e",
              color: "#2D2D2D",
              weight: 3,
              opacity: .9,
              fillOpacity: .9,
              data:station_model.get('event_type')
        };

        circleStyleOptions['fillColor'] = self.getColor(station_model.get('event_type'));

        var marker = L.circleMarker(station_model.get('coordinates'), circleStyleOptions);
        marker.bindPopup("<div><br>"+station_model.get('event_type')+"<br></div>")        
        self.markers.addLayer(marker);
      }
      try{
        self.map.fitBounds(self.markers.getBounds()); 
      }catch(e){

      }
      
    });

  }
});