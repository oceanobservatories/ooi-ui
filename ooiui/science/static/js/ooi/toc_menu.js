function buildTocMenu(data){
	console.log("build it")

	$.each( data, function( array, list ) {	  	
	  	if (array== "CP"){
	  		//addTocEntry(array)
		  	$.each( list, function( platform, ob ) {
		  		lat = ob['lat']
		  		lon = ob['lon']	
		  		if (lon > -999){
		  			lon = -lon		  		
			  		ports_len = ob['ports'].length	
			  		popup = array+ "  " +platform+ " ports: "+ ports_len

			  		var marker = L.marker([lat,lon]);
			  		marker.bindPopup(popup);                
			  		markers.addLayer(marker);	

			  		instrument_list = ["inst1","instr2","instr3"]
			  		platform_status = "off"			  		
			  		addTocPlatform(array,
			  						platform,
						  			platform_status,						  									  			
						  			instrument_list)
		  		}
		  	}); 
	  	}
	});  


	$(function () {
        $('#tocmenu').metisMenu();
    });
}

function addTocPlatform(array,platform,platform_status,instrument_list){
	platform_status_class = getPlatformStatusClass(platform_status)
	$( "#tocmenu" ).append( getTocPlatformTemplate(array,platform,platform_status,platform_status_class,instrument_list) );
}

function getPlatformStatusClass(status){
	/*
	generates a general status for a platform_status
	*/
	if (status=="na"){
		return "badge"
	}else if(status=="on"){
		return "badge badge-success"
	}else if(status=="off"){
		return "badge badge-error"
	}  

}

function getInstrumentStatus(id){
	/*
	uses the id to get the status
	*/
	
	if (id=="inst1"){
		return "na"
	}else if(id=="instr2"){
		return "off"
	}else if(id=="instr3"){
		return "on"
	}
	
	return "na"
}

function getInstrumentClass(id){
	/*
	uses the id to get the status
	*/
	if (id=="na"){
		return "badge"
	}else if(id=="on"){
		return "badge badge-success"
	}else if(id=="off"){
		return "badge badge-error"
	}
	return "badge" 
	
}

/*
function addTocEntry(array){
	$( "#tocmenu" ).append( getTocTemplate(array) );
}
*/

function getTocPlatformTemplate(array, platform,platform_status,platform_status_class,instrument_list){
	instrument_list_str = "<ul>"
	for (var i = 0; i < instrument_list.length; i++) {
		console.log(instrument_list[i])
		instrument_list_str+= "<li>"+ '<a class="instrumentMap" href="#">'+ instrument_list[i] +		
		'<span style="margin-left:5px;vertical-align:middle;" class="'+getInstrumentClass(getInstrumentStatus(instrument_list[i]))+'">'+ getInstrumentStatus(instrument_list[i]) +'</span>'+
		'</a>'+
		'</li>'
	};
  	instrument_list_str += "</ul>"

  str = '<li><a href="#" class="platformMap" >'+
  			'<span arrayCode="'+array+'" platformCode="'+platform+'" class="sidebar-nav-item-icon fa fa-code-fork"></span>'+            
            platform +
            '<span style="margin-left:5px;vertical-align:middle;" class="'+platform_status_class+'">'+platform_status+'</span>'+
            '<span class="glyphicon arrow">'+
            '<span style="margin-left:10px;vertical-align:middle;" class="badge">'+instrument_list.length+'</span>'+

            '</span></a>'+

             instrument_list_str+
          '</li>'
    return str
}

/*
function getTocTemplate(array){
	str =  '<li class="active">'+ 
      '<a href="#">'+
        '<span class="sidebar-nav-item-icon fa fa-github fa-lg"></span>'+
        '<span class="sidebar-nav-item">'+array+'</span>'+
        '<span class="glyphicon arrow"></span>'+
      '</a>' +
      '<ul id="array_'+array+'" >'+
        
      '</ul>' +
    '</li>'

    return str;
}
*/
