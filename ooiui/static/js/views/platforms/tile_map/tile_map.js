var TileMap = Backbone.View.extend({
    initialize: function(options) {
        // The geoJSON data, d3.json();
        this.listenTo(this.collection, 'change', this.render);
        // console.log('options');
        // console.log(options);
        if (options) {
            this.lat = options.lat || 5;
            this.lng = options.lng || -90;
            this.platformId = options.platformId || null;
        }

        return this;
    },
    _onBeforeRender: function() {
        try {
          var homeLat = this.lat;
          var homeLon = this.lng;

            var map = L.map(this.id, {
                zoomControl: false,
                minZoom: 9,
                maxZoom: 14
            }).setView([this.lat, this.lng], 9);
            // Commenting this out for now until security and web mapping service performance are resolved
            L.tileLayer.wms('https://maps.oceanobservatories.org/mapserv?map=/public/mgg/web/gmrt.marine-geo.org/htdocs/services/map/wms_merc.map&', {
                layers: 'topo',
                format: 'image/png',
                transparent: true,
                crs: L.CRS.EPSG4326,
                attribution: 'Global Multi-Resolution Topography (GMRT), Version 3.2'
            }).addTo(map);

/*            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri', maxZoom: 13})
                .addTo(map);*/

                // Add the optimal glider tracks
                var track = new L.KML("/kmz/OOI_Glider_Lines.kml", {async: true});
                track.on("loaded", function(e) {
                //map.fitBounds(e.target.getBounds());
                });
                map.addLayer(track);

                // var cabled_array = new L.KML("/kmz/Primary_Cables.kml", {async: true});
                // map.addLayer(cabled_array);

                // var rsn_cabled_array = new L.KML("kmz/RSN_2016_10_17.kml", {async: true});
                // map.addLayer(rsn_cabled_array);
                // map.addControl(new L.Control.Layers({}, {'RSN':rsn_cabled_array}));

                var rsn_primary_cables = new L.KML("kmz/Primary_Cables.kml", {async: true});
                var rsn_secondary_cables = new L.KML("kmz/Secondary_Cables.kml", {async: true});
                var rsn_moorings = new L.KML("kmz/Moorings.kml", {async: true});
                var rsn_mooring_anchors = new L.KML("kmz/Mooring_Anchors.kml", {async: true});
                var rsn_primary_nodes = new L.KML("kmz/Primary_Nodes.kml", {async: true});
                var rsn_secondary_nodes = new L.KML("kmz/Secondary_Nodes.kml", {async: true});
                var rsn_instruments = new L.KML("kmz/Instruments.kml", {async: true});
                var rsn_cable_equipment = new L.KML("kmz/Cable_Equipment.kml", {async: true});
                var rsn_cable_burial = new L.KML("kmz/Cable_Burial.kml", {async: true});

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

                var layerTitle = {};
                $.each(kml_layers_list, function(key, value){
                  console.log(key);
                  if(value[1] === 'show'){
                    var title = value[2];
                    var layer = value[0];
                    layerTitle[title] = layer;

                    map.addLayer(layer);
                  }
                });
                map.addControl(new L.Control.Layers({}, layerTitle));

                // map.dragging.disable();
                // map.touchZoom.disable();
                map.doubleClickZoom.disable();
                // map.scrollWheelZoom.disable();
                map.keyboard.disable();

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
            },

            _zoomOut: function (e) {
              this._map.zoomOut(e.shiftKey ? 3 : 1);
            },

            _zoomHome: function (e) {
              map.setView([homeLat, homeLon], 9);
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

                // add some methods that can be useful to our map object.
                map._resizeMap = this._resizeMap;

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
        map.setLayoutProperty('moorings', 'visibility', 'none');
        map.setLayoutProperty('rsMoorings', 'visibility', 'none');
        map.setLayoutProperty('gliders', 'visibility', 'none');
        map.setLayoutProperty('arrays', 'visibility', 'visible');
        map.setLayoutProperty('rsArray', 'visibility', 'visible');
        map.setLayoutProperty('ceArray', 'visibility', 'visible');
    },
    _setPlatformView: function() {
        'use strict';
        // When we're in the platform view, we don't want to see any array icons.
        map.setLayoutProperty('moorings', 'visibility', 'none');
        map.setLayoutProperty('gliders', 'visibility', 'none');
        map.setLayoutProperty('arrays', 'visibility', 'visible');
        map.setLayoutProperty('ceArray', 'visibility', 'visible');
        map.setLayoutProperty('rsArray', 'visibility', 'visible');
    },
    render: function() {
        try {
            var renderContext = this;

            // global
            map = this._onBeforeRender();

            // console.log('after onBeforeRender');
            // console.log(renderContext.collection);

            $.when(map).done(function() {
                var arrayData = [];
/*                _.each(renderContext.collection.toGeoJSON(), function(geoJSON) {
                    console.log('geoJSON');
                    console.log(geoJSON);

                    if (String(geoJSON.properties.code).indexOf('MOAS') < 0) {
                        arrayData.push(geoJSON);
                    }
                });*/

                var mooringIcon = new L.divIcon({className: 'mooringIcon', iconSize: [20, 20]});
                var otherMooringIcon = new L.divIcon({className: 'otherMooringIcon', iconSize: [20, 20]});
                var otherSitesIcon = new L.divIcon({className: 'otherSitesIcon', iconSize: [20, 20]});

                var referencePlatforms = [];
                var primaryArray = renderContext.platformId.substr(0,2);
                _.each(renderContext.collection.toGeoJSON(), function(geoJSON) {
                    referencePlatforms.push(geoJSON);
                });

                var otherSites = [];
                _.each(renderContext.collection.allSites.toGeoJSON(), function(geoJSON){
                    if (geoJSON.properties.code.indexOf('MOAS') == -1) {
                      otherSites.push(geoJSON);
                    }
                });
                // console.log('otherSites');
                // console.log(otherSites);


                var marker = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [renderContext.lng, renderContext.lat]
                    },
                    properties: {
                        code: renderContext.collection.siteData.get('reference_designator'),
                        description: renderContext.collection.siteData.get('display_name')
                    }
                };



                // console.log('referencePlatforms');
                // console.log(referencePlatforms);

                var refPlatforms = [];
                _.forEach(referencePlatforms, function(platforms){
                    $.merge(refPlatforms, platforms);
                });

                // console.log('refPlatforms');
                // console.log(refPlatforms);

              // console.log(renderContext.collection.arrayDisplayName);

                L.geoJson(otherSites, {
                    pointToLayer: function(feature, latlng) {
                        return new L.Marker(latlng, {icon: otherMooringIcon, riseOnHover: true});
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on('mouseover', function(e) {
                            var content = feature.properties.description + '<br>' + '<span>' + JSON.stringify(Number(e.latlng.lat.toFixed(4))) + ', ' + JSON.stringify(Number(e.latlng.lng.toFixed(4))) + '</span>' ;
                            document.getElementById('info').innerHTML = content;

                        });
                        layer.on('click', function(e) {
                            window.open("/platformnav?id="+ btoa(feature.properties.code) + "&array=" + renderContext.collection.arrayDisplayName + "&lat=" + btoa(JSON.stringify(Number(e.latlng.lat.toFixed(4)))) + "&lng=" + btoa(JSON.stringify(Number(e.latlng.lng.toFixed(4)))),'_self');
                        });
                    }
                }).addTo(map);

/*                L.geoJson(otherSites, {
                    pointToLayer: function(feature, latlng) {
                        return new L.Marker(latlng, {icon: otherSitesIcon});
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on('mouseover', function(e) {
                            var content = feature.properties.description + '<br>' + '<span>' + JSON.stringify(Number(e.latlng.lat.toFixed(4))) + ', ' + JSON.stringify(Number(e.latlng.lng.toFixed(4))) + '</span>' ;
                            document.getElementById('info').innerHTML = content;

                        });
                        layer.on('click', function(e) {
                            window.open("/platformnav?id="+ btoa(feature.properties.code) +"&lat=" + btoa(JSON.stringify(Number(e.latlng.lat.toFixed(4)))) + "&lng=" + btoa(JSON.stringify(Number(e.latlng.lng.toFixed(4)))),'_self');
                        });
                    }
                }).addTo(map);*/

                if (marker.properties.code.indexOf('MOAS') == -1) {
                  var currentMarker = L.geoJson(marker, {
                    pointToLayer: function (feature, latlng) {
                      return new L.Marker(latlng, {icon: mooringIcon, riseOnHover: true, zIndexOffset: 100000});
                    },
                    onEachFeature: function (feature, layer) {
                      layer.on('mouseover', function (e) {
                        var content = feature.properties.description + '<br>' + '<span>' + JSON.stringify(Number(e.latlng.lat.toFixed(4))) + ', ' + JSON.stringify(Number(e.latlng.lng.toFixed(4))) + '</span>';
                        document.getElementById('info').innerHTML = content;

                      });
                      // layer.on('click', function(e) {
                      //     window.open("/platformnav?id="+ btoa(feature.properties.code) +"&lat=" + btoa(JSON.stringify(Number(e.latlng.lat.toFixed(4)))) + "&lng=" + btoa(JSON.stringify(Number(e.latlng.lng.toFixed(4)))),'_self');
                      // });
                    }
                  }).addTo(map);
                }
            });
        } catch (error) {
            console.log(error);
            debugger;
        }
    }
});
