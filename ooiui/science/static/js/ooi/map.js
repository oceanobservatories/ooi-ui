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

function OpenInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

function getStatusColor(status){
    if (status === undefined || status =="undefined"){
        return "blue";
    }else if (status == "na"){
        return "blue";
    }else if (status == "on"){
        return 'green';
    }else if (status == "off"){
        return 'red';
    }else{
        return 'orange';
    } 
}

function getMarkerIcon(stream_num){
    if (stream_num > 0){
        return "star";
    }else{
        return "ban";
    }   
}

function getStatusMarker(status,stream_num){    
    if (stream_num > 0){
        icon_style = "star";
        color = getStatusColor(status)
    }else{
        icon_style = "ban";
        color = 'darkred'
    }
    

    // Creates a red marker
    var marker = L.AwesomeMarkers.icon({
        icon: icon_style,
        markerColor: color,
        prefix: 'fa'
     });
    return marker;
}


function addMarkers(map,markers){

    /* PLATFORM MARKER EXTENDED FROM NORMAL MARKER*/
    PlatformMarker = L.Marker.extend({
		   options: { 
		      status: '',
		      platform: '',
		      instrument: ''
		   }
	});

	$.getJSON( "/gettoc/?", function( data ) {  
	  
      /* TOC Menu  */           	
      buildtocmenu(data['CP']);
      
	  var markerList = [];    
      $.each( data, function( array, list ) {        
        if (array == "CP"){
            $.each( list, function( platform_idx, platform_ob ) {
                
                lat = platform_ob['lat']
                //lon = -platform_ob['lon'] 
                lon = platform_ob['lon'] 
                status = platform_ob['status']
                d_type = platform_ob['type']

                platform_name = platform_ob['title']
                platform_id = platform_ob['id']

                //get the instruments
                instruments = platform_ob['children']                             

                //normal assets
                if (lat > -999 && lon > -999){
                	$.each( instruments, function( instrument_id, instrument ) {  
                        instrument_name = instrument['title'] 
                        instrument_id = instrument['id']    

                        if (instrument_name.length < 4){
                            instrument_name = instrument_id
                        }

                        stream_num = instrument.children.length
                        popup = getPopupContent(array,platform_name,instrument_name,status,instrument_id,platform_id);



                        markerIcon = getStatusMarker(status,stream_num)
	                    //create the marker and set the properties
	                    var marker = new PlatformMarker([lat,lon], 
	                    	{
	                    		icon: markerIcon,
	                    		status: status,
	                    		platform: platform_name,
                                platform_id: platform_id,
	                    		instrument: instrument_name,
                                instrument_id: instrument_id,
                                riseOnHover: true
	                    	}
	                    );

                        marker.on('popupclose', function () {
                            disablePlotting();
                        })

	                    marker.bindPopup(popup);         
	                    markerList.push(marker)
	                    markers.addLayer(marker);
                    }); 
                }                    		  		                
            }); 
        }
      });  
      markers.setMarkers(markerList);
      map.addLayer(markers);              
    });
	
}

function getPopupContent(array,platform,instrument, status,instrument_id,platform_id){
    
    popstr =   '<div array="'+array+'"' +' platform="'+platform+'"'+ ' instrument="'+instrument+'"'+' platform_id="'+platform_id+'"'+ ' instrument_id="'+instrument_id+'"' +' class="popup-map-btn">'+
            instrument+ ":" +  instrument_id +
            "<br> <b>Array:</b> "+ array+ 
            "<br> <b>Platform:</b> "+ platform_id + ":"+ platform+ " " +
            "<br> "+ "<b>Status:</b> "+ status + " "+
            "<br> "+ "<b>Stream #:</b> "+ stream_num + "<br>"+
            '<button type="button" class="popup-map-btn-plot btn btn-info btn-sm" data-toggle="modal" data-target="#myModal">'+                                
                '<span class="glyphicon glyphicon-stats"></span> Plot data'+
            '</button>'+
            '<button type="button" class="popup-map-btn-download btn btn-default btn-sm">'+                                
                '<span class="glyphicon glyphicon-save"></span> Download data'+
            '</button>'+
            "</div>"   
   
    return popstr

}
