var TileMap = Backbone.View.extend({
  initialize: function() {
    // The geoJSON data, d3.json();
    return this;
  },
  _onBeforeRender: function() {
    try {

      var map = L.map(this.id, {
        zoomControl: false
      }).setView([15.8, -90], 2);
      // Commenting this out for now until security and web mapping service performance are resolved
      L.tileLayer.wms('http://gmrt.marine-geo.org/cgi-bin/mapserv?map=/public/mgg/web/gmrt.marine-geo.org/htdocs/services/map/wms_merc.map&', {
        max_zoom: 13,
        layers: 'topo',
        format: 'image/png',
        transparent: true,
        crs: L.CRS.EPSG4326,
        attribution: 'Global Multi-Resolution Topography (GMRT), Version 3.2'
      }).addTo(map);

      /*            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
       attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri', maxZoom: 13})
       .addTo(map);*/

      /*map.dragging.disable();
       map.touchZoom.disable();
       map.doubleClickZoom.disable();
       map.scrollWheelZoom.disable();
       map.keyboard.disable();*/

      // add some methods that can be useful to our map object.
      map._resizeMap = this._resizeMap;
      map._setArrayView = this._setArrayView;

      map._hidePlatformView = this._hidePlatformView;
      map._showPlatformView = this._showPlatformView;
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
    map.setView([30, -70], 2);

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
    // When we're in the platform view, we don't want to see any array icons.
    _.each(map._layers, function(platform) {
      if(!_.isUndefined(platform.feature)) {
        // console.log('platform.feature.properties.code.length');
        // console.log(platform.feature.properties.code.length);
        if (platform._icon && platform.feature.properties.code.length > 2) {
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
      console.log('renderContext');
      console.log(renderContext);
      var arrayIcon = new L.divIcon({className: 'mydivicon', iconSize: [20, 20], opacity: 1});
      var platformIcon = new L.divIcon({className: 'mydivicon-platform', iconSize: [20, 20], opacity: 1});

      // global
      map = this._onBeforeRender();

      $.when(map).done(function() {
        var arrayData = [];
        var platformData = [];
        _.each(renderContext.collection.arrayCollection.toGeoJSON(), function(geoJSON) {
          console.log('geoJSON in array');
          console.log(geoJSON);
          arrayData.push(geoJSON);

          console.log('platform data inside arrayCollection toGeoJSON');
          console.log(geoJSON.properties.platforms);


          _.each(geoJSON.properties.platforms, function(geoJSON) {
            console.log('geoJSON in platform');
            console.log(geoJSON);

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
            return new L.Marker(latlng, {icon: platformIcon});
          },
          onEachFeature: function (feature, layer) {
            if(!_.isUndefined(feature.properties)) {
              layer.on('mouseover', function (event) {
                $('#' + feature.properties.code.substring(0, 2) + ' table tbody tr[data-code="' + feature.properties.code + '"]').css("border", "4px solid orange");
              });

              layer.on('mouseout', function (event) {
                $('#' + feature.properties.code.substring(0, 2) + ' table tbody tr[data-code="' + feature.properties.code + '"]').css("border", "");
              });
            }
          }

        }).addTo(map);

        map._hidePlatformView();


        //map.on('click', function (e) {
        //    map.setView([15.8, -90], 2);
        //    $('.js-array').removeClass('active');
        //    $('.js-array').fadeIn();
        //    $('.js-platform-table').css('display', 'none');
        //});
      });
    } catch (error) {
      console.log(error);
      debugger;
    }
  }
});
