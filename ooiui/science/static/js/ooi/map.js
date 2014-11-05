function setupTileLayers(map){
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
}

function getStatusMarker(status,redMarker,greenMarker,naMarker){
	if (status == "na"){
		return naMarker;
	}else if (status == "on"){
		return onMarker;
	}else if (status == "off"){
		return offMarker;
	}	
}

function addMarkers(map,markers){

	// Creates a red marker
    var redMarker = L.AwesomeMarkers.icon({
        icon: 'star',
        markerColor: 'red'
    });

    var greenMarker = L.AwesomeMarkers.icon({
        icon: 'star',
        markerColor: 'green'
    });

    var naMarker = L.AwesomeMarkers.icon({
        icon: 'star',
        markerColor: 'blue'
    });

    /* PLATFORM MARKER EXTENDED FROM NORMAL MARKER*/
    PlatformMarker = L.Marker.extend({
		   options: { 
		      status: '',
		      platform: '',
		      instrument: ''
		   }
	});

	$.getJSON( "/json/stations.json", function( data ) {  
		


	  var markerList = [];    
      $.each( data, function( array, list ) {
        //console.log(array,list)
        if (array == "CP"){
            $.each( list, function( platform, ob ) {
                lat = ob['lat']
                lon = -ob['lon'] 
                status = ob['status']
                instruments = ob['instruments']                               		                          
                instruments_len = ob['instruments'].length                    

                //normal assets
                if (lat > -999 && lon > -999){
                	$.each( instruments, function( instrument_id, instrument ) {                		                	
	                	popup = instrument+ 
	                			" <br> Array: "+ array+ 
	                			"<br> Platform: " +platform+ " " +"<br> "+ "Status: "+ status
	                    //create the marker and set the properties
	                    var marker = new PlatformMarker([lat,lon], 
	                    	{
	                    		icon: getStatusMarker(status,redMarker,greenMarker,naMarker),
	                    		status: status,
	                    		platform: platform,
	                    		instrument: instrument,
                                riseOnHover: true
	                    	}
	                    );

	                    marker.bindPopup(popup);         
	                    markerList.push(marker)
	                    markers.addLayer(marker);
                    }); 
                }
                    
		  		/* TOC Menu  */	  		
		  		instrument_list = ob['instruments']
		  		platform_status = ob['status']

		  		addTocPlatform(array,
		  						platform,
					  			platform_status,						  									  			
					  			instrument_list)
                    
                
            }); 
        }
      });  
      markers.setMarkers(markerList);
      map.addLayer(markers);      
      $(function () {
        $('#tocmenu').metisMenu();
      });     
    });
	
}