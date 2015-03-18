var MapView = Backbone.View.extend({
	initialize: function() {    
		var self = this;

    var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      mbUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';


    var grayscale   = L.tileLayer(mbUrl, {id: 'examples.map-20v6611k', attribution: mbAttr});    
    
    var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{  
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    var Esri_OceanBasemap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
      maxZoom: 13
    });

    var Esri_WorldTerrain = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
      maxZoom: 13
    });


    this.map = L.map(this.el,{
	       center: [20.505, -80.09],
	       zoom: 3,
	       maxZoom: 10,
         minZoom: 3,
         layers: [Esri_OceanBasemap]
   	});

    var baseLayers = {
      "ESRI Oceans": Esri_OceanBasemap,      
      "ESRI Terrain": Esri_WorldTerrain,
      "World Imagery" :Esri_WorldImagery,
      "Grayscale": grayscale,
    };

    //create some simple data layers
    var layer_link = ['http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs']
    var layer_list = ['RAS_RIDGE_NEXRAD'] 
    var layer_name = ['Precipitation'] 
    var wmsLayers = {}
    for (var i = 0; i < layer_list.length; i++) {
      var new_layer = L.tileLayer.wms(layer_link[i], {
        format: 'image/png',
        transparent: true,
        layers: layer_list[i]
      })
      wmsLayers[layer_name[i]] = new_layer      
    }; 

    L.control.layers(baseLayers,wmsLayers).addTo(this.map);

    this.listenTo(ooi.models.mapModel, 'change', this.setMapView)


    this.collection.fetch({success: function(collection, response, options) {
      self.render();
      return this
    }});
    return this
	},
 	//renders a simple map view
	render: function() {
		//needs to be set
		L.Icon.Default.imagePath = '/img';
   
    var map = this.map;
		var markerCluster = new L.MarkerClusterGroup();   

    this.collection.each(function(platform) { 	    	
      var display_name = platform.get('display_name')
      var ref_name = platform.get('reference_designator')
      var array_id = platform.get('array_id')

      platform.attributes.geo_location.properties = {'display_name':display_name,
                              'ref':ref_name,
                              'array_id':array_id
                              }
      
      var geojsonFeature =L.geoJson(platform.attributes.geo_location, {				
      onEachFeature: function (feature, layer) {
        var dis = '<b>'+feature.properties.display_name+'</b>'					
        var ref = '<b>'+feature.properties.ref+'</b>'					
        layer.bindPopup(dis+"<br>"+ref);
       // console.log(dis);
        }
      });
     // console.log(platform.toJSON());
      markerCluster.addLayer(geojsonFeature);
    });
    map.addLayer(markerCluster);
    L.Util.requestAnimFrame(map.invalidateSize,map,!1,map._container);
	},
  setMapView: function(){
    var loco = ooi.models.mapModel.get('mapCenter')
    //loco = loco.reverse()
    //apparently reverse is too slow set explicitly
    this.map.setView(loco,5)
     
  }
	//end
});
