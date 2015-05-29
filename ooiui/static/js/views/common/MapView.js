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

    var nearNow = new Date();
    nearNow.setMinutes(0);
    nearNow.setSeconds(0);  

    var layerParams = [
                        {
                          url:"http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs",
                          name:"Precipitation",
                          layers:"RAS_RIDGE_NEXRAD",
                          format: "image/png",
                          transparent: true
                        },
                        {
                          url:"http://gis.srh.noaa.gov/arcgis/services/NDFDTemps/MapServer/WMSServer",
                          name:"Temperature",
                          layers:16,
                          format: "image/png",
                          transparent: true
                        },
                        {
                          url:"http://coastmap.com/ecop/wms.aspx",
                          name:"GFS WIND Model",
                          layers:"NAM_WINDS",
                          format: "image/png",
                          styles : "WINDS_VERY_SPARSE_GRADIENT-False-2-0-45-High",
                          transparent: true,
                          time: moment(nearNow).format()
                        },
                        {
                          url:"http://coastmap.com/ecop/wms.aspx",
                          name:"Wave Watch III Model Waves",                          
                          styles: "",
                          layers:"WW3_WAVE_HEIGHT",
                          format: "image/png",
                          transparent: true,
                          time: moment(nearNow).format()
                        },
                        {
                          url:"http://coastmap.com/ecop/wms.aspx",
                          name:"HYCOM Currents",                          
                          styles: "CURRENTS_RAMP-Jet-False-4-True-0-2-high",
                          layers:"HYCOM_GLOBAL_NAVY_CURRENTS",
                          format: "image/png",
                          transparent: true,
                          time: moment(nearNow).format()
                        }                       
                      ]
   
    var wmsLayers = {}
    $.each(layerParams, function( index, value ) {
      var params = _.clone(value);
      var new_layer = L.WMS.overlay(value.url, params)
      wmsLayers[value.name] = new_layer      
    });
    //wmsLayers['Glider Track'] = this.generate_glider_layer();
    this.wmsLayers = wmsLayers;
    this.mapLayerControl = L.control.layers(baseLayers,wmsLayers).addTo(this.map);

    var gl = this.generate_glider_layer();
    gl.addTo(this.map);
    self.gliderLayer = gl

    this.listenTo(ooi.models.mapModel, 'change', this.setMapView)


    this.collection.fetch({success: function(collection, response, options) {
      self.render();
      return this
    }});

    return this
	},
  update_track_glider: function(reference_designator,show_track){
    var self = this;
    var map = this.map;
    console.log("CLICK!");
    map.removeLayer(self.gliderLayer)
    if (show_track){      
      var gliderModel = new GliderTrackModel(reference_designator+'-00-ENG000000');
      var ref = gliderModel.get('reference_designator')
      gliderModel.fetch({
          data: $.param({id:ref}),
          success: function(collection, response, options) {          
            var gl = self.generate_glider_layer(response);
            gl.addTo(map);
            self.gliderLayer = gl            
          },
          reset: true
      });
    }
  },
  showLayers:function(){
    /*
    test function to list the layers
    */
    //console.log("layers-----------")
    this.map.eachLayer(function (layer) {
      //console.log(layer.options.color);
    });
  },
  generate_glider_layer:function(geojson){  
    if (geojson === undefined){    
      var gliderTrackLine = {
          "type": "LineString",
          "coordinates": []
      };
    }else{
      var gliderTrackLine = geojson;
    }

    var gliderTrackStyle = {
      "color": "#ff7800",
      "weight": 5,
      "opacity": 0.65
    };
    //returnt he new glider layer
    var gliderTrackLayer = L.geoJson(gliderTrackLine, {style: gliderTrackStyle});
    return gliderTrackLayer
  },
 	//renders a simple map view
	render: function() {
		//needs to be set
		L.Icon.Default.imagePath = '/img';
   
    var map = this.map;
		var markerCluster = new L.MarkerClusterGroup();   

    this.collection.each(function(platform) {
      if (platform.get('coordinates')) {         
        if (platform.get('coordinates').length ==2){   
          var name = platform.get('assetInfo')['name']              
          if (name == null){
            name = "Undefined"          
          }          

          if (platform.get('coordinates')[0]!=0 && platform.get('coordinates')[1]!=0){           
            var platformFeature = L.marker(platform.get('coordinates'));            

            var ref_des = platform.get('ref_des')
            if (typeof(ref_des) != "undefined"){             
              var ref_des_split = ref_des.split("-")
              //get the current location
              if (!location.origin)
                location.origin = location.protocol + "//" + location.host;
              
              //get the parts
              var array = ref_des.substring(0, 2);
              var mooring = ref_des_split[0]
              var platform_val = ref_des_split[1]
              if (ref_des_split.length > 2){                
                var instrument = ref_des
                var instrument_url = [array, mooring, platform_val , instrument].join("/");                
              }else{
                var instrument_url = [array, mooring, platform_val].join("/");
              }
              var instrument_plot = '<br><a href="/plotting/' + instrument_url + '">Plotting</a>&nbsp;&ndash;&nbsp;'
            }else{
              var instrument_plot = ""
            }

            var popupContent = '<p><strong>' + name + '</strong><br>' +
                '<strong>Launch Date</strong>: '+platform.get('launch_date_time')+'<br>'+
                'Lat: ' + platform.get('coordinates')[0] + '&nbsp;|&nbsp;Lon: ' + platform.get('coordinates')[1] +
                instrument_plot+
                '<br><a href="/streams">Data Catalog</a>&nbsp;&ndash;&nbsp;' +
                '<a href="/assets/list?' + platform.get('ref_des') + '">Asset Management</a></p>';

                platformFeature.bindPopup(popupContent);
            markerCluster.addLayer(platformFeature);
          }
       }
      }
    });
    map.addLayer(markerCluster);
    L.Util.requestAnimFrame(map.invalidateSize,map,!1,map._container);
	},
  setMapView: function(lat_lon,zoom){    
    this.map.setView(new L.LatLng(lat_lon[0], lat_lon[1]),zoom)
  }
	//end
});

var GliderTrackModel = Backbone.Model.extend({
  urlRoot: '/api/uframe/glider_tracks',
  defaults: {
        reference_designator: ""     
  },
  initialize: function(ref){
    this.set('reference_designator',ref);
  },

});
