var MapView = Backbone.View.extend({
	initialize: function() {
		_.bindAll(this,"render","setMapView");
    console.log(this.model);
    ooi.mapCollection.on('add', this.setMapView, this)
		//this.render();
   
		var self = this;
    this.map = L.map(this.el,{
	       // center: [41.505, -80.09],
          center:[-54.0814, -89.6652],
          zoom: 5,
	        maxZoom: 10
   	});

    this.collection.fetch({success: function(collection, response, options) {
      self.render();
      return this
    }});
	},
 	//renders a simple map view
	render: function() {
		//needs to be set
		L.Icon.Default.imagePath = '/img';
   
    var map = this.map

		var markerCluster = new L.MarkerClusterGroup();

				var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	    });

	    var Stamen_TonerHybrid = L.tileLayer('http://{s}.tile.stamen.com/toner-hybrid/{z}/{x}/{y}.png', {
	        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
	        subdomains: 'abcd',
	        minZoom: 0,
	        maxZoom: 20
	    });     

	    //HERE_hybridDay.addTo(map);    
	    Esri_WorldImagery.addTo(map);
	    Stamen_TonerHybrid.addTo(map);

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
     // this.model.set({
       // mapCenter:[ 0, 0]
      //})
      console.log(this.model);
	},
  setMapView: function(){
    var loc = ooi.mapCollection.models[0]
    console.log(loc.get('id'))
    console.log("MAP MODEL HAS CHANGE!!!!")
    console.log(map)
    this.map.setView([54.0814, -89.6652])
  }
	
	//end
});
