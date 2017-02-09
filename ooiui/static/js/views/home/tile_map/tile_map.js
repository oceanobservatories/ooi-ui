var TileMap = Backbone.View.extend({
  initialize: function() {
    // The geoJSON data, d3.json();
    return this;
  },
  _onBeforeRender: function() {
    try {
      // Maximum bounds for the map
      var sw = L.latLng(-67.85566059478718, -186.72639774827587),
          ne = L.latLng(71.7728104733597, -1.1705977958376423),
          arrayMapBounds = L.latLngBounds(sw, ne);

      var map = new L.map(this.id, {
        zoomControl: false
        // ,
        // maxBounds: arrayMapBounds
      });
      // Commenting this out for now until security and web mapping service performance are resolved
      L.tileLayer.wms('http://gmrt.marine-geo.org/cgi-bin/mapserv?map=/public/mgg/web/gmrt.marine-geo.org/htdocs/services/map/wms_merc.map&', {
        maxZoom: 12,
        minZoom: 2.6,
        layers: 'topo',
        format: 'image/png',
        transparent: true,
        bounceAtZoomLimits: true,
        crs: L.CRS.EPSG4326,
        attribution: 'Global Multi-Resolution Topography (GMRT), Version 3.2'
      }).addTo(map);

      // Add the optimal glider tracks
      var track = new L.KML("/kmz/OOI_Glider_Lines.kml", {async: true});
      track.on("loaded", function(e) {
        //map.fitBounds(e.target.getBounds());
      });
      map.addLayer(track);

      // Add a lat/lng mouse and custom position widget
      L.control.coordinates({
        position:"topleft", //optional default "bootomright"
        decimals: 6, //optional default 4
        decimalSeperator:".", //optional default "."
        labelTemplateLat:"Latitude: {y}", //optional default "Lat: {y}"
        labelTemplateLng:"Longitude: {x}", //optional default "Lng: {x}"
        enableUserInput:false, //optional default true
        useDMS:false, //optional default false
        useLatLngOrder: true, //ordering of labels, default false-> lng-lat
        markerType: L.marker, //optional default L.marker
        markerProps: {}
      }).addTo(map);

      /*      // ESRI Map - Save until GMRT is fully operational (https and performance on AWS)
       L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
       attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri', maxZoom: 13})
       .addTo(map);*/

      // Turn on/off map functionalities
      // map.dragging.disable();
      // map.touchZoom.disable();
      map.doubleClickZoom.disable();
      // map.scrollWheelZoom.disable();
      map.keyboard.disable();

/*      map.on('zoomstart', function(event){
        console.log(event);
        var mZoom = map.getZoom();
        console.log('mZoom');
        console.log(mZoom);
        if(event.target._zoom > mZoom){
          var currentMapBounds = map.getBounds();
          map.panInsideBounds(currentMapBounds)
        }
        // map.maxZoom(map.getZoom());
      });*/

            // Debugging alert with map information
/*      map.on('click', function onDragEnd(){
        var width = map.getBounds().getEast() - map.getBounds().getWest();
        var height = map.getBounds().getNorth() - map.getBounds().getSouth();

        console.log('south');
        console.log(map.getBounds().getSouth());
        console.log('west');
        console.log(map.getBounds().getWest());
        console.log('north');
        console.log(map.getBounds().getNorth());
        console.log('east');
        console.log(map.getBounds().getEast());
/!*        alert (
          'west:' + map.getBounds().getWest() +'\n'+
          'east:' + map.getBounds().getEast() +'\n'+
          'south:' + map.getBounds().getSouth() +'\n'+
          'north:' + map.getBounds().getNorth() +'\n'+
          'center:' + map.getCenter() +'\n'+
          'width:' + width +'\n'+
          'height:' + height +'\n'+
          'size in pixels:' + map.getSize()
        )*!/
      });*/

      // add some methods that can be useful to our map object.
      map._resizeMap = this._resizeMap;
      map._setArrayView = this._setArrayView;
      map._setSWNEBoundsView = this._setSWNEBoundsView;
      map._hidePlatformView = this._hidePlatformView;
      map._showPlatformView = this._showPlatformView;
      map._isArrayView = this.isArrayView;
      map._arrayMapBounds = arrayMapBounds;

      return map;

    } catch (error) {
      console.log(error);
      debugger;
    }
  },
  _resizeMap: function() {
    'use strict';
    // This can be used to redraw the map.  It is a bit strange, as it causes the
    // map to flash for a second.
    //
    // This hook will allow more advanced options to be done before the map is actually
    // resized. e.g. resize the map frame first so the focus persists.
    map.resize();
  },
  _setArrayView: function() {
    'use strict';
    // When we're in the array view, we don't want to show all the platforms
    map.setView([5.7, -94], 2.6);

  },
  _setSWNEBoundsView: function(sw, ne) {
    'use strict';
    // console.log('sw');
    // console.log(sw);
    // console.log('ne');
    // console.log(ne);
    var bounds = L.latLngBounds(sw, ne);
    map.fitBounds(bounds);
    // map.panInsideBounds(bounds);
  },
  _showPlatformView: function() {
    'use strict';
    // When we're in the platform view, we don't want to see any array icons.
    _.each(map._layers, function(platform) {
      // console.log('platform');
      // console.log(platform);
      if(!_.isUndefined(platform.feature)){
        // console.log('platform.feature.properties.code.length');
        // console.log(platform.feature.properties.code.length);

        if(platform._icon && platform.feature.properties.code.length > 2){
          $(platform._icon).show();
          platform._icon.style.opacity = 1;
          platform._icon.style.zIndexOffset = 10000000;
          // platform._icon.className = "leaflet-marker-icon mydivicon leaflet-zoom-animated leaflet-clickable"
        }
        if(platform._icon && platform.feature.properties.code.length < 3){
          // console.log('Are we turning off the arrays or not?');
          $(platform._icon).hide();
          platform._icon.style.opacity = 0;
          platform._icon.style.zIndex = -1;
          // platform._icon.className = "leaflet-marker-icon mydivicon-nopointer leaflet-zoom-animated"
        }
      }
    });
  },
  _hidePlatformView: function() {
    'use strict';

    this.isArrayView = true;

    // When we're in the platform view, we don't want to see any array icons.
    _.each(map._layers, function(platform) {
      if(!_.isUndefined(platform.feature)) {
        // console.log('platform.feature.properties.code.length');
        // console.log(platform.feature.properties.code.length);
        if (platform._icon && platform.feature.properties.code.length > 2) {
          $(platform._icon).hide();
          platform._icon.style.opacity = 0;
          platform._icon.style.zIndex = -1;
          // platform._icon.className = "leaflet-marker-icon mydivicon-nopointer leaflet-zoom-animated"
        }
        if (platform._icon && platform.feature.properties.code.length < 3) {
          $(platform._icon).show();
          platform._icon.style.opacity = 1;
          platform._icon.style.zIndexOffset = 10000000;
          // platform._icon.className = "leaflet-marker-icon mydivicon leaflet-zoom-animated leaflet-clickable"
        }
      }
    });
  },
  render: function() {
    try {
      var renderContext = this;
      // console.log('renderContext');
      // console.log(renderContext);
      var arrayIcon = new L.divIcon({className: 'mydivicon', iconSize: [20, 20], opacity: 1});
      var platformIcon = new L.divIcon({className: 'mydivicon-platform', iconSize: [20, 20], opacity: 1});

      // global
      map = this._onBeforeRender();

      $.when(map).done(function() {
        var arrayData = [];
        var platformData = [];

        // Sets switch for pop-up rendering
        map._isArrayView = true;

        _.each(renderContext.collection.arrayCollection.toGeoJSON(), function(geoJSON) {
          // console.log('geoJSON in array');
          // console.log(geoJSON);
          arrayData.push(geoJSON);

          // console.log('platform data inside arrayCollection toGeoJSON');
          // console.log(geoJSON.properties.platforms);


          _.each(geoJSON.properties.platforms, function(geoJSON) {
            // console.log('geoJSON in platform');
            // console.log(geoJSON);

            if (geoJSON.properties.code.indexOf('MOAS') == -1) {
              platformData.push(geoJSON);
            }
          });
        });

        /*        var platformData = [];
         _.each(renderContext.collection.arrayCollection.toGeoJSON(), function(geoJSON) {
         if (geoJSON.properties.code.indexOf('MOAS') == -1) {
         platformData.push(geoJSON);
         }
         });*/

        L.geoJson(arrayData, {

          pointToLayer: function(feature, latlng) {
            return new L.Marker(latlng, {icon: arrayIcon, zIndexOffset: 1000000});
          },
          onEachFeature: function (feature, layer) {
            if(!_.isUndefined(feature.properties)) {
              layer.on('click', function (event) {
                $('#' + feature.properties.code + ' .js-expand').trigger('click');
              });
              layer.on('mouseover', function (event) {
                $('#' + feature.properties.code + ' .js-expand').css("border", "4px solid orange");
              });
              layer.on('mouseout', function (event) {
                $('#' + feature.properties.code + ' .js-expand').css("border", "");
              });
            }
          }
        }).addTo(map);

        L.geoJson(platformData, {

          pointToLayer: function(feature, latlng) {
            // console.log(feature);
            return new L.Marker(latlng, {icon: platformIcon});
          },
          onEachFeature: function (feature, layer) {
            // Mouse over events to handle table indicators and point pop-ups
            if(!_.isUndefined(feature.properties)) {
              layer.on('mouseover', function (event) {
                // console.log(map._isArrayView);
                if(!map._isArrayView) {
                  // Set table row with an orange border
                  $('#' + feature.properties.code.substring(0, 2) + ' table tbody tr[data-code="' + feature.properties.code + '"]').css("border", "4px solid orange");

                  // Adds pop-up info on each point
                  content = '<pre class="infoInner" style="white-space: pre-wrap;">' + feature.properties.title + " (" + feature.properties.code + ")" + '<br>' + '<span>Latitude: ' + JSON.stringify(Number(event.latlng.lat.toFixed(4))) + '<br>Longitude: ' + JSON.stringify(Number(event.latlng.lng.toFixed(4))) + '</span></pre>';
                  $('pre.infoInner').replaceWith(content);
                  $('#infoArrayMap').css({
                    "display": "inline-block",
                    'top': event.originalEvent.clientY,
                    'left': event.originalEvent.clientX
                  });
                }
              });

              // Hide the pop-up info for a point
              layer.on('mouseout', function (event) {
                if(!map._isArrayView) {
                  $('#' + feature.properties.code.substring(0, 2) + ' table tbody tr[data-code="' + feature.properties.code + '"]').css("border", "");
                  $('pre.infoInner').replaceWith('<pre class="infoInner" style="white-space: pre-wrap;"></pre>');
                  $('#infoArrayMap').css({"display": "none"}).fadeOut(10);
                }
              });

              // Open new tab on platform point click
              layer.on('click', function(e) {
                window.open("/platformnav?id="+ btoa(feature.properties.code) +"&lat=" + btoa(JSON.stringify(Number(e.latlng.lat.toFixed(4)))) + "&lng=" + btoa(JSON.stringify(Number(e.latlng.lng.toFixed(4)))),'_self');
              });
            }
          }

        }).addTo(map);

        $.when(map.setView([5.7, -94], 2.59)).done(function() {
          var currentMapBounds = map.getBounds();
          // console.log('currentMapBounds');
          // console.log(currentMapBounds);
          $.when(map.fitBounds(currentMapBounds, {reset: true})).done(function() {
            map.setMaxBounds(currentMapBounds);
          })
        });

        map._hidePlatformView();
      });
    } catch (error) {
      console.log(error);
      debugger;
    }
  }
});
