var MapView = Backbone.View.extend({
  gliderCollection:null,
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

    var NGDC_WorldTerrain = L.tileLayer('http://maps.ngdc.noaa.gov/arcgis/rest/services/web_mercator/etopo1_hillshade/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Hillshade visualization by J. Varner and E. Lim, CIRES, University of Colorado at Boulder and NOAA/NGDC.',
      maxZoom: 13
    });

    self.arrayTitle =   {
                         "pioneer":"Coastal Pioneer",
                         "endurance":"Endurance & Cabled Array",
                         "papa":"Station Papa",
                         "irminger":"Irminger Sea",
                         "argentine":"Argentine Basin",
                         "southern":"Southern Ocean"
                        }

    self.arrayLinks =   {
                         "pioneer":"http://oceanobservatories.org/wp-content/uploads/2011/04/PioneerArray_2013-03-20_ver_1-03.png",
                         "endurance":"http://oceanobservatories.org/wp-content/uploads/Cabled_Array_Map_2014-12-02.jpg",
                         "papa":"http://oceanobservatories.org/wp-content/uploads/StationPapa_labeled_2015-02-05.jpg",
                         "irminger":"http://oceanobservatories.org/wp-content/uploads/southern-ocean-instruments-503x350.jpg",
                         "argentine":"http://oceanobservatories.org/wp-content/uploads/southern-ocean-instruments-503x350.jpg",
                         "southern":"http://oceanobservatories.org/wp-content/uploads/southern-ocean-instruments-503x350.jpg"
                        }

    self.arrayMapping = {"pioneer":new L.LatLngBounds([[42,-74],[36,-65]]),
                         "endurance":new L.LatLngBounds([[48,-133],[-42,-123]]),
                         "papa": new L.LatLngBounds([[52,-150],[46,-139]]),
                         "irminger": new L.LatLngBounds([[61,-43],[57,-35]]),
                         "argentine":new L.LatLngBounds([[-40,-46],[-46,-37]]),
                         "southern":new L.LatLngBounds([[-52,-95],[-56,-85]])
                        }

    self.sizeMapping = {"pioneer":[200,300],
                         "endurance":[200,400],
                         "papa":[250,250],
                         "irminger":[200,250],
                         "argentine":[200,250],
                         "southern":[200,250]
                        }


    this.map = L.map(this.el,{
         maxZoom: 10,
         minZoom: 2,
         layers: [Esri_OceanBasemap]
    });

    this.inititalMapBounds = [[63, -143],[-59, -29]]

    L.control.mousePosition().addTo(this.map);

    L.easyButton('fa-globe', function(btn, map){
      map.fitBounds(self.inititalMapBounds);
    },"Reset Zoom Level").addTo( this.map );

    var baseLayers = {
      "ESRI Oceans": Esri_OceanBasemap,
      "NGDC Bathymetry" : NGDC_WorldTerrain,
      "ESRI Terrain": Esri_WorldTerrain,
      "World Imagery" : Esri_WorldImagery,
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

    //glider layer
    this.gliderLayers = L.layerGroup();
    this.arrayLayers = L.layerGroup();

    wmsLayers['Array Titles'] = this.arrayLayers;
    wmsLayers['Glider Tracks'] = this.gliderLayers;
    this.mapLayerControl = L.control.layers(baseLayers,wmsLayers).addTo(this.map);

    this.listenTo(ooi.models.mapModel, 'change', this.setMapView)

    this.collection.fetch({success: function(collection, response, options) {
      self.render();
      return this
    }});

    return this
  },
  add_glider_tracks: function(){
    var self = this;
    //this.gliderCollection
    var gliderTrackStyle = {
      "color": "#ff7800",
      "weight": 5,
      "opacity": 0.65
    };

    self.gliderCollection.each(function(model) {
      var gliderTrackLayer = L.geoJson(model.toJSON(), {style: gliderTrackStyle});
      //popup
      var popupContent = '<p><strong>' + model.get('name') + '</strong><br>';
      //bind
      gliderTrackLayer.bindPopup(popupContent);
      //add
      self.gliderLayers.addLayer(gliderTrackLayer)
    });


  },
  //deprecated i think
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
  //deprecated i think
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
  //toc selected item
  selectMarker: function(select_model,type,show_popoup){
    var self = this;
    if (type == "stream"){
      var ref_des = select_model.model.get('reference_designator')
    }else{
      var ref_des = select_model.get('ref_des')
    }

    var split = ref_des.split('-');
    var new_split  = []
    new_split.push(split[0]);
    new_split.push(split[1]);
    ref_des = new_split.join('-');

    var found = false

    //close all open markers
    _.each(this.markerCluster.getLayers(), function(marker) {
        marker.closePopup();
    });

    //we only want to show popups on the expand
    if (show_popoup){
      //initial pass and open spider for popup
      _.each(this.markerCluster.getLayers(), function(marker) {
        if (marker.options.alt == ref_des){
          self.map.panTo(marker.getLatLng());
          if (!marker._icon) marker.__parent.spiderfy();
          marker.openPopup();
          found = true;
        }
      });

      //if its not found remove a section of the ref_des to identify it
      if (found == false){
        var ref_des = ref_des.split('-')[0];
        _.each(this.markerCluster.getLayers(), function(marker) {
          if (marker.options.alt == ref_des){
            self.map.panTo(marker.getLatLng());
            if (!marker._icon) marker.__parent.spiderfy();
            marker.openPopup();
            found = true;
          }
        });
      }
    }
  },
  //renders a simple map view
  render: function() {
    var self = this;
    //needs to be set
    L.Icon.Default.imagePath = '/img';

    var map = this.map;

    map.fitBounds(self.inititalMapBounds);


    //add labels
    _.each(self.arrayMapping, function(arrayMap,index) {
        var labelMarker = L.marker([arrayMap._northEast.lat, arrayMap._southWest.lng-2],{ opacity: 0.001 })
                            .bindLabel(self.arrayTitle[index], { className: "array-title-label", noHide: true });
        self.arrayLayers.addLayer(labelMarker);


    });

    self.arrayLayers.addTo(map);



    var popup = null;
    self.markerCluster = new L.MarkerClusterGroup({iconCreateFunction: function(cluster) {
                                                      return new L.DivIcon({ html: '<b class="textClusteredMarker">' + '</b>', //cluster.getChildCount() + '</b>' ,
                                                                             className: 'clusterdMarker',
                                                                             iconSize: L.point(40, 40)
                                                                            });
                                                  },
                                                  spiderfyDistanceMultiplier:2,
                                                  showCoverageOnHover: false
                                                  });

    self.markerCluster.on('clustermouseover', function (a) {
      if (map.getZoom() === 3 || map.getZoom()==4 ) {
        var url = null;
        var size = null;
        var title = null;
        _.each(self.arrayMapping, function(arrayMap,index) {
          if (arrayMap.contains(a.latlng)){
            url = self.arrayLinks[index];
            size = self.sizeMapping[index];
            title = self.arrayTitle[index];
          }
        })

        //generate array popup
        popup = L.popup({offset: new L.Point(0, -20)})
         .setLatLng(a.latlng)
         .setContent('<h4 id="arrayPopup">'+title+'</h4><br><img id="arrayImg" height="'+size[0]+'" width="'+size[1]+'" src="'+url+'">')

         .openOn(map);
      }else{
        _.each(self.arrayMapping, function(arrayMap,index) {
          if (arrayMap.contains(a.latlng)){
            url = self.arrayLinks[index];
            size = self.sizeMapping[index];
            title = self.arrayTitle[index];
          }
        })

        //generate normal popup
        popup = L.popup({offset: new L.Point(0, -20)})
         .setLatLng(a.latlng)
         .setContent('<div class="cluster-popup"><h4>'+title+'<img id="clusterImg" src="/img/sciMap/OOI_Logo.png"></h4><p>'+a.layer.getAllChildMarkers().length+' assets'+"</p></div>")
         .openOn(map);
      }


      //a.layer.getAllChildMarkers().length

    });
    map.on('zoomend', function(e) {
      if (map.getZoom() === 3 || map.getZoom()==4 ) {
        $('.array-title-label').css('display','');
      }else{
        $('.array-title-label').css('display','none');
      }
    });

    map.on('zoomstart', function(e) {
      if (popup && map) {
          map.closePopup(popup);
          popup = null;
      }
    });

    self.markerCluster.on('clustermouseout', function (e) {
        if (popup && map) {
          map.closePopup(popup);
          popup = null;
        }
    });

    var res_des_list = this.collection.map(function(model){
      return model.get('ref_des');
    });

    var mooringIcon = L.icon({
        iconUrl: '/img/mooring.png',
        iconSize:     [50, 50], // size of the icon
        iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
    });

    var platformIcon = L.icon({
        iconUrl: '/img/platform.png',
        iconSize:     [50, 50], // size of the icon
        iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
    });

    var gliderIcon = L.icon({
        iconUrl: '/img/glider.png',
        iconSize:     [50, 50], // size of the icon
        iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
    });


    var unique_res_des = _.uniq(res_des_list);
    _.each(unique_res_des, function(platform_id) {

      //get the stations
      var platforms = self.collection.where({ ref_des:platform_id , asset_class: '.AssetRecord' })

      var lat_lons = []

      if (platforms.length > 0 && platforms[0].get('coordinates').length == 2){



        //reset the event popup
        var eventPopup = ""
        var name = platforms[0].get('assetInfo')['name']

        if (name == null){
              name = platforms[0].get('ref_des')
        }


        // Plotting
        if (typeof(platform_id) != "undefined"){
          var ref_des_split = platform_id.split("-")
          //get the current location
          if (!location.origin)
            location.origin = location.protocol + "//" + location.host;

          //get the parts
          var array = platform_id.substring(0, 2);
          var mooring = ref_des_split[0]
          var platform_val = ref_des_split[1]

          var platformFeature = null
          if (_.isUndefined(platform_val)){
            //itemType = "mooring"
            platformFeature = new OOICustomMarker(platforms[platforms.length -1].get('coordinates'),{icon: mooringIcon});
          }else if (name.toLowerCase().indexOf("glider") > -1){
            platformFeature = new OOICustomMarker(platforms[platforms.length -1].get('coordinates'),{icon: gliderIcon});
          }else{
            //itemType = "platform"
            platformFeature = new OOICustomMarker(platforms[platforms.length -1].get('coordinates'),{icon: platformIcon});
          }

          platformFeature.options.alt = platforms[0].get('ref_des')

          if (ref_des_split.length > 2){
            var instrument = platform_id
            var instrument_url = [array, mooring, platform_val , instrument].join("/");
          }else{
            var instrument_url = [array, mooring, platform_val].join("/");
          }
//          var instrument_plot = '</div><br><br><div><a href="/plotting/' + instrument_url + '"><i class="fa fa-bar-chart">&nbsp;</i>Plotting</a>&nbsp;&nbsp;&#124;&nbsp;&nbsp;'
        }else{
          var instrument_plot = ""
        }

        var eventContent = '<h5 id="deployEvents"><strong>Deployment Event(s)</strong></h5><div class="map-pop-container">';
        var popupContent = ""
        var hasDeploymentEvent = false;

        //loop through each to create the popup
        _.each(platforms, function(platform_entry) {
            lat_lons.push(platform_entry.get('coordinates'))

            var events = platform_entry.get('events');
             _.each(events, function(item) {
                if (item['class'] == ".DeploymentEvent"){
                  if (!hasDeploymentEvent){
                    // Name
                    popupContent = '<h4 id="popTitle"><strong>' + name + '</strong></h4>';
                    // Lat & Lon
                    popupContent+= '<h5 id="latLon"><div class="latFloat"><strong>Latitude:</strong> '+platforms[platforms.length -1].get('coordinates')[0] + '</div><div class="lonFloat"><strong>Longitude:</strong> ' + platforms[platforms.length -1].get('coordinates')[1] + '</div>';
                    // Plotting
                    popupContent += '<br><br><div><a href="/plotting/#'+platforms[0].get('ref_des')+'"><i class="fa fa-bar-chart">&nbsp;</i>Plotting</a>&nbsp;&nbsp;&#124;&nbsp;&nbsp;';
                    // Data Catalog
                    popupContent+='<a href="/streams/#'+platforms[0].get('ref_des')+'"><i class="fa fa-database">&nbsp;</i>Data Catalog</a>&nbsp;&nbsp;&#124;&nbsp;&nbsp;';
                    // Asset Managment
                    popupContent+='<a href="/assets/list?' + platforms[0].get('ref_des') + '"><i class="fa fa-sitemap">&nbsp;</i>Asset Management</a></div></h5>';
                  }

                  hasDeploymentEvent = true;

                  if (_.isNull(item['endDate'])){
                    eventContent += '<div class="floatLeft">';
                    eventContent += '<h6><strong>Current</strong></h6><table><tr><td><strong>ID:&nbsp;</strong>'+ item['deploymentNumber'] +'</tr>';
                    eventContent += '<tr><td><strong>Start:&nbsp;</strong>'+ moment(item['startDate']).utc().format("YYYY-MM-DD")+'</td></tr>';
                    eventContent +='<tr><td><strong>End:&nbsp;</strong>'+ "Still Deployed"+'</td></tr></table></div>';

                  }else{
                    eventContent += '<div class="floatRight">';
                    eventContent += '<h6><strong>Previous</strong></h6><table><tr><td><strong>ID:&nbsp;</strong>'+ item['deploymentNumber'] +'</tr>';
                    eventContent += '<tr><td><strong>Start:&nbsp;</strong>'+ moment(item['startDate']).utc().format("YYYY-MM-DD")+'</td></tr>';
                    eventContent +='<tr><td><strong>End:&nbsp;</strong>'+ moment(item['endDate']).utc().format("YYYY-MM-DD")+'</td></tr></table></div>';
                  }
                }
            });
        });
        eventContent += '</div></div>';
        popupContent+=eventContent;


        //only add the item if there are deployment events
        if (hasDeploymentEvent){

          platformFeature.bindPopup(popupContent,{offset: new L.Point(0, 0),showOnMouseOver: true});

          self.markerCluster.addLayer(platformFeature);
        }
      }

    })

    map.addLayer(self.markerCluster);
    L.Util.requestAnimFrame(map.invalidateSize,map,!1,map._container);

  },
  setMapView: function(lat_lon,zoom){
    if ( lat_lon != undefined ){
        this.map.setView(new L.LatLng(lat_lon[0], lat_lon[1]),zoom)
    }
  }
  //end
});


var OOICustomMarker = L.Marker.extend({

    bindPopup: function(htmlContent, options) {

    if (options && options.showOnMouseOver) {

      // call the super method
      L.Marker.prototype.bindPopup.apply(this, [htmlContent, options]);

      // unbind the click event
      this.off("click", this.openPopup, this);

      // bind to mouse over
      this.on("mouseover", function(e) {

        // get the element that the mouse hovered onto
        var target = e.originalEvent.fromElement || e.originalEvent.relatedTarget;
        var parent = this._getParent(target, "leaflet-popup");

        // check to see if the element is a popup, and if it is this marker's popup
        if (parent == this._popup._container)
          return true;

        // show the popup
        this.openPopup();

      }, this);

      // and mouse out
      this.on("mouseout", function(e) {

        // get the element that the mouse hovered onto
        var target = e.originalEvent.toElement || e.originalEvent.relatedTarget;

        // check to see if the element is a popup
        if (this._getParent(target, "leaflet-popup")) {

          L.DomEvent.on(this._popup._container, "mouseout", this._popupMouseOut, this);
          return true;

        }

        // hide the popup
        this.closePopup();

      }, this);

    }

  },

  _popupMouseOut: function(e) {

    // detach the event
    L.DomEvent.off(this._popup, "mouseout", this._popupMouseOut, this);

    // get the element that the mouse hovered onto
    var target = e.toElement || e.relatedTarget;

    // check to see if the element is a popup
    if (this._getParent(target, "leaflet-popup"))
      return true;

    // check to see if the marker was hovered back onto
    if (target == this._icon)
      return true;

    // hide the popup
    this.closePopup();

  },

  _getParent: function(element, className) {

    var parent = element.parentNode;

    while (parent != null) {

      if (parent.className && L.DomUtil.hasClass(parent, className))
        return parent;

      parent = parent.parentNode;

    }

    return false;

  }

});

