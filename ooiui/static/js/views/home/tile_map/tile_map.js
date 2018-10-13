var TileMap = Backbone.View.extend({
  initialize: function() {
    // The geoJSON data, d3.json();
    return this;
  },
  _onBeforeRender: function() {
    try {
      // Maximum bounds for the map
      //o.LatLngBounds_northEast: o.LatLnglat: 71.7728104733597lng: -1.1705977958376423__proto__: Object_southWest: o.LatLnglat: -67.85566059478718lng: -186.72639774827587__proto__: Object__proto__: Object
      var sw = L.latLng(-67.85566059478718, -186.72639774827587),
          ne = L.latLng(71.7728104733597, -1.1705977958376423),
          // arrayMapBounds = L.latLngBounds(sw, ne),
          arrayMapBounds = L.latLngBounds([]);

      // ESRI Map - Save until GMRT is fully operational (https and performance on AWS)
      var highResMap1 = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
        maxZoom: 12,
        minZoom: 2.6,
        bounceAtZoomLimits: false
        // crs: L.CRS.EPSG3857
      });

      // ESRI Map - Save until GMRT is fully operational (https and performance on AWS)
      var esriOceanReference = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}', {
        // attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
        // maxZoom: 12,
        // minZoom: 2.6,
        // bounceAtZoomLimits: true,
        // crs: L.CRS.EPSG3857,
        // format: 'image/png',
        // transparent: true
      });

      // Commenting this out for now until security and web mapping service performance are resolved
      var highResMap = L.tileLayer.wms('https://maps.oceanobservatories.org/mapserv?map=/public/mgg/web/gmrt.marine-geo.org/htdocs/services/map/wms_merc.map&', {
        // maxZoom: 12,
        // minZoom: 2.6,
        attribution: 'Global Multi-Resolution Topography (GMRT), Version 3.2',
        layers: 'topo',
        format: 'image/png',
        transparent: true,
        bounceAtZoomLimits: false,
        // crs: L.CRS.EPSG4326,
        crs: L.CRS.EPSG3857
      });

      var map = new L.map(this.id, {
        zoomControl: false,
        trackResize: true,
        bounceAtZoomLimits: false
        // layers: [highResMap]
      });

      // map.addLayer(baseMap);
      map.addLayer(highResMap);
      map.addLayer(esriOceanReference);

      var baseMaps = {
        // "ESRI Oceans": baseMap,
        "GMRT Hi-Res": highResMap
      };

      var mapLayers = {
        "ESRI Ocean Reference": esriOceanReference
      };

      // L.control.layers(baseMaps, mapLayers).addTo(map);

      // Add the optimal glider tracks
      var track = new L.KML("/kmz/OOI_Glider_Lines.kml", {async: true});
      track.on("loaded", function(e) {
        track.on("mouseover", function(e) {
          // console.log(e);
          // console.log('map.mouseEventToLatLng(e.originalEvent)');
          // console.log(map.mouseEventToLatLng(e.originalEvent));
          // e.layer.openPopup({LatLng: map.mouseEventToLatLng(e.originalEvent), options: {autoPan: false}});
        });
        track.on("mouseout", function(e) {
          e.layer.closePopup();
        });
      });

      // var rsn_cabled_array = new L.KML("/kmz/Primary_Cables.kml", {async: true});

      var rsn_primary_cables = new L.KML("/kmz/Primary_Cables.kml", {async: true});
      var rsn_secondary_cables = new L.KML("/kmz/Secondary_Cables.kml", {async: true});
      var rsn_moorings = new L.KML("/kmz/Moorings.kml", {async: true});
      var rsn_mooring_anchors = new L.KML("/kmz/Mooring_Anchors.kml", {async: true});
      var rsn_primary_nodes = new L.KML("/kmz/Primary_Nodes.kml", {async: true});
      var rsn_secondary_nodes = new L.KML("/kmz/Secondary_Nodes.kml", {async: true});
      var rsn_instruments = new L.KML("/kmz/Instruments.kml", {async: true});
      var rsn_cable_equipment = new L.KML("/kmz/Cable_Equipment.kml", {async: true});
      var rsn_cable_burial = new L.KML("/kmz/Cable_Burial.kml", {async: true});

      var arrayLayerControl = null;

      var kml_layers_list = {
        'rsn_primary_cables': [rsn_primary_cables, 'show', 'Primary Cables'],
        'rsn_secondary_cables': [rsn_secondary_cables, 'show', 'Secondary Cables'],
        'rsn_moorings': [rsn_moorings, 'show', 'Moorings'],
        'rsn_mooring_anchors': [rsn_mooring_anchors, 'show', 'Mooring Anchors'],
        'rsn_primary_nodes': [rsn_primary_nodes, 'show', 'Primary Nodes'],
        'rsn_secondary_nodes': [rsn_secondary_nodes, 'show', 'Secondary Nodes'],
        'rsn_instruments': [rsn_instruments, 'show', 'Instruments'],
        'rsn_cable_equipment': [rsn_cable_equipment, 'show', 'Cable Equipment'],
        'rsn_cable_burial': [rsn_cable_burial, 'show', 'Cable Burial']
      };

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

      // Turn on/off map functionalities
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
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
      map._gliderTrackLayer = track;
      // map._cabledArrayLayer = cabled_array;
      map._kmlLayersList = kml_layers_list;
      map._getPlatformBounds = this._getPlatformBounds;
      map._platformCenter = [0,0];
      map._platformZoom = 2.6;
      map._arrayLayerControl = arrayLayerControl;

      L.Control.zoomHome = L.Control.extend({
        options: {
          position: 'topleft',
          zoomInText: '+',
          zoomInTitle: 'Zoom in',
          zoomOutText: '-',
          zoomOutTitle: 'Zoom out',
          zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>',
          zoomHomeTitle: 'Zoom home'
        },

        onAdd: function (map) {
          var controlName = 'gin-control-zoom',
            container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
            options = this.options;

          this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
            controlName + '-in', container, this._zoomIn);
          this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
            controlName + '-home', container, this._zoomHome);
          this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
            controlName + '-out', container, this._zoomOut);

          this._updateDisabled();
          map.on('zoomend zoomlevelschange', this._updateDisabled, this);

          return container;
        },

        onRemove: function (map) {
          map.off('zoomend zoomlevelschange', this._updateDisabled, this);
        },

        _zoomIn: function (e) {
          this._map.zoomIn(e.shiftKey ? 3 : 1);
          map.dragging.enable();
        },

        _zoomOut: function (e) {
          this._map.zoomOut(e.shiftKey ? 3 : 1);
        },

        _zoomHome: function (e) {
          map.setView(map._platformCenter, map._platformZoom);
          map.dragging.disable();
        },

        _createButton: function (html, title, className, container, fn) {
          var link = L.DomUtil.create('a', className, container);
          link.innerHTML = html;
          link.href = '#';
          link.title = title;

          L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', fn, this)
            .on(link, 'click', this._refocusOnMap, this);

          return link;
        },

        _updateDisabled: function () {
          var map = this._map,
            className = 'leaflet-disabled';

          L.DomUtil.removeClass(this._zoomInButton, className);
          L.DomUtil.removeClass(this._zoomOutButton, className);

          if (map._zoom === map.getMinZoom()) {
            L.DomUtil.addClass(this._zoomOutButton, className);
          }
          if (map._zoom === map.getMaxZoom()) {
            L.DomUtil.addClass(this._zoomInButton, className);
          }
        }
      });

      var zoomHome = new L.Control.zoomHome();
      zoomHome.addTo(map);

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
    // map.setView([5.7, -94], 2.6);
    map.invalidateSize();
    var minBoundsZoom = map.getBoundsZoom(map._arrayMapBounds, false);
    var maxBoundsZoom = map.getBoundsZoom(map._arrayMapBounds, true);
    // console.log('minBoundsZoom');
    // console.log(minBoundsZoom);
    map.removeLayer(map._gliderTrackLayer);
    var zoomLevelMapping = [
      {1: 90},
      {2: 70},
      {3: 40}
    ];
    var baseZoomLevel = 1.0;
    var browserZoomLevel = Math.round((window.devicePixelRatio*100));
    // console.log('browserZoomLevel');
    // console.log(browserZoomLevel);
    // console.log('new minZoom');
    var newMinZoom = Math.round(baseZoomLevel/(browserZoomLevel/100));
    // console.log(newMinZoom);
    // console.log('map._arrayMapBounds');
    // console.log(map._arrayMapBounds);
    $.when(
      /*map.fitBounds(map._arrayMapBounds,
        {
          reset: true,
          animate: false
          ,
          // minZoom: minBoundsZoom,
          maxZoom: minBoundsZoom
        })
        */
      map.setView(map._arrayMapBounds.getCenter(), minBoundsZoom,{
          reset: true,
          animate: false
          // ,
          // minZoom: minBoundsZoom,
          // maxZoom: minBoundsZoom
        })
    )
      .done(function() {
        map.setMaxBounds(map._arrayMapBounds);

        map.setMinZoom(minBoundsZoom);
        // map.setMaxZoom(minBoundsZoom);
        // console.log('setting zoom to: ');
        // console.log(newMinZoom);


        /*$.when(map.setZoom(-100)).done(function() {
          console.log('map.getZoom()');
          console.log(map.getZoom());
        });*/

      });

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
  _getPlatformBounds: function(arrayCode) {
    'use strict';
    // console.log('arrayCode');
    // console.log(arrayCode);

    var platformBounds = L.latLngBounds([]);

    // When we're in the platform view, we don't want to see any array icons.
    _.each(map._layers, function(platform) {
      if(!_.isUndefined(platform.feature)){
        // console.log('platform');
        // console.log(platform);
        if(platform._icon && platform.feature.properties.code.indexOf(arrayCode) == 0){
          platformBounds.extend(platform._latlng);
        }
      }
    });
    // console.log('map._platformBounds');
    // console.log(platformBounds);
    return platformBounds
  },
  _showPlatformView: function() {
    'use strict';
    this.isArrayView = false;
    map.dragging.enable();
    map.touchZoom.enable();
    map.scrollWheelZoom.enable();

    $('div.leaflet-control-zoom.leaflet-bar.leaflet-control').show();
    map.addLayer(map._gliderTrackLayer);

    // Add KML layers for cabled array to the map
    var layerTitle = {};
    $.each(map._kmlLayersList, function(key, value){
      if(value[1] === 'show'){
        var title = value[2];
        var layer = value[0];
        layerTitle[title] = layer;
        map.addLayer(value[0]);
      }
    });

    // Add the layer control for the cabled layers to the map
    if(map._arrayLayerControl === null){
      map._arrayLayerControl = new L.Control.Layers({}, layerTitle);
      map._arrayLayerControl.addTo(map);
    }

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
    $('div.leaflet-control-zoom.leaflet-bar.leaflet-control').hide();
    // map.dragging.disable();
    map.touchZoom.disable();
    map.scrollWheelZoom.disable();
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
    // map.removeLayer(map._cabledArrayLayer);
    // map.removeLayer(map._rsnCableArray);
    // if(map._arrayLayerControl !== null){
    //   map.removeControl(map._arrayLayerControl);
    //   map._arrayLayerControl = null;
    // }
    if(map._arrayLayerControl !== null){
      // console.log(map._arrayLayerControl);
      map._arrayLayerControl.remove();
      map._arrayLayerControl = null;
    }

    $.each(map._kmlLayersList, function(key, value){
      if(value[1] === 'show'){
        map.removeLayer(value[0]);
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


          _.each(geoJSON.properties.platforms, function(geoJSONplatform) {
            // console.log('geoJSON in platform');
            // console.log(geoJSON);

            if (geoJSONplatform.properties.code.indexOf('MOAS') == -1) {
              geoJSONplatform['properties']['array_name'] = geoJSON.properties.title;
              platformData.push(geoJSONplatform);
            }else{
              // console.log('geoJSONplatform');
              // console.log(geoJSONplatform);
            }
          });
        });

        /*        var platformData = [];
         _.each(renderContext.collection.arrayCollection.toGeoJSON(), function(geoJSON) {
         if (geoJSON.properties.code.indexOf('MOAS') == -1) {
         platformData.push(geoJSON);
         }
         });*/

        var arrayLayer = L.geoJson(arrayData, {

          pointToLayer: function(feature, latlng) {
            return new L.Marker(latlng, {icon: arrayIcon, zIndexOffset: 1000000, riseOnHover: true});
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
        });

        var platformLayer = L.geoJson(platformData, {

          pointToLayer: function(feature, latlng) {
            // console.log(feature);
            return new L.Marker(latlng, {icon: platformIcon, riseOnHover: true});
          },
          onEachFeature: function (feature, layer) {
            // console.log(feature);
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
                window.open("/platformnav?id="+ btoa(feature.properties.code) + "&array=" + btoa(feature.properties.array_name) + "&lat=" + btoa(JSON.stringify(Number(e.latlng.lat.toFixed(4)))) + "&lng=" + btoa(JSON.stringify(Number(e.latlng.lng.toFixed(4)))),'_self');
              });
            }
          }

        });

        arrayLayer.addTo(map);
        platformLayer.addTo(map);

        map._arrayMapBounds.extend(arrayLayer.getBounds());
        map._arrayMapBounds.extend(platformLayer.getBounds());
        map._arrayMapBounds.extend(map._gliderTrackLayer.getBounds());
        map._arrayMapBounds.extend([68.5, -30.0]);
        map._arrayMapBounds.extend([-57.0, -30.0]);
        map._arrayMapBounds.extend([-57.0, -156.0]);
        map._arrayMapBounds.extend([68.5, -156]);
        // console.log('map._arrayMapBounds.extend(arrayLayer.getBounds())');
        // console.log(map._arrayMapBounds);

        // $.when(map.setView([5.7, -94], 2.59)).done(function() {
        //   var currentMapBounds = map._arrayMapBounds;
          // console.log('currentMapBounds');
          // console.log(currentMapBounds);
          // $.when(map.fitBounds(map._arrayMapBounds, {reset: true, animate: false})).done(function() {
          //   map.setMaxBounds(map._arrayMapBounds);
          // });
        // });

        map._isArrayView = true;
        map._setArrayView();
        map._hidePlatformView();
      });
    } catch (error) {
      console.log(error);
      debugger;
    }
  }
});
