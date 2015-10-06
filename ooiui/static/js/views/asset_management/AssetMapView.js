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
      maxZoom: 10,
      minZoom: 2
    });

    var southWest = L.latLng(-80, -170),
    northEast = L.latLng(80, 170),
    bounds = L.latLngBounds(southWest, northEast);

    self.map = L.map('map', {
      center: [39.73, -104.99],
      zoom: 2,
      maxZoom: 10,
      minZoom: 2,
      maxBounds: bounds,
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
                      }else if (_.indexOf(clusterStatus, "inactive")>-1){
                        c += 'inactive';
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
      return 'darkblue';
    }else{
      return 'gray';
    }
  },
  addStations:function(){    
    var self = this;    
    self.collection.each(function(station_model,i){            
      if (station_model.get('coordinates') && !_.isUndefined(station_model)){              
        var add_marker = true;
        if (station_model.get('event_type') == "unknown" && station_model.get('coordinates')[0] == 0 && station_model.get('coordinates')[1] == 0){
          add_marker = false;
        }

        if (add_marker){
          var statusMarker = L.AwesomeMarkers.icon({
            icon: 'info',
            prefix: 'fa',
            markerColor: self.getColor(station_model.get('event_type')),
            data:station_model.get('event_type')
          });
                
          var marker = L.marker(station_model.get('coordinates'), {icon: statusMarker});

          var status = station_model.get('event_type');
          if (status == 'inactive'){
            status = "healthy";
          }

          var popupContent = "<div style='width:460px'>"
          popupContent += '<h4 id="popTitle"><strong>' + station_model.get('name') + '</strong></h4>';        
          popupContent += '<h5 id="latLon">';
          popupContent += '<div class="latFloat">'+ '<strong>Latitude:</strong> ' + station_model.get('coordinates')[0].toFixed(3) + '</div>';
          popupContent += '<div class="lonFloat">'+ '<strong>Longitude:</strong> ' + station_model.get('coordinates')[1].toFixed(3) + '</div>';

          popupContent += '<br><br><div><a href="/plotting/#'+ station_model.get('reference_designator') +'"><i class="fa fa-bar-chart">&nbsp;</i>Plotting</a>&nbsp;&nbsp;&#124;&nbsp;&nbsp;';
          // Data Catalog
          popupContent+='<a href="/streams/#'+  station_model.get('reference_designator') +'"><i class="fa fa-database">&nbsp;</i>Data Catalog</a>&nbsp;&nbsp;&#124;&nbsp;&nbsp;';
          // Asset Managment
          popupContent+='<a href="/assets/list#' +  station_model.get('reference_designator') + '"><i class="fa fa-sitemap">&nbsp;</i>Asset Management</a></div></h5>';
          
        
          popupContent += "<div style=''>"
          //popupContent += '<h5 id="deployEvents"></h5>';
          popupContent += '<div style="" class="map-pop-container">';        
          popupContent += "<div style='margin-top:30px;'>"
          popupContent += '<h5 id="deployEvents"><strong>Overview'+'</strong></h5>';
          popupContent +=   '<div class="floatLeft" style="width:100%">';
          popupContent +=   '<h6><strong>Reference Designator: </strong>'+ station_model.get('reference_designator') +'</h6>';        
          popupContent +=   '<h6><strong>Current Status: </strong>'+ status +'</h6>';        
          popupContent +=   '</div>';
          popupContent +=   '</div>';
          popupContent += '</div>';
          popupContent +='</div>';
          popupContent +='</div>';
          

          marker.bindPopup(popupContent);      
          self.markers.addLayer(marker);
        }
      }
      try{
        self.map.fitBounds(self.markers.getBounds(),{maxZoom:10}); 
      }catch(e){

      }
      
    });

  }
});