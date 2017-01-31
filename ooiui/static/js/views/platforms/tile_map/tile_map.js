var TileMap = Backbone.View.extend({
    initialize: function(options) {
        // The geoJSON data, d3.json();
        this.listenTo(this.collection, 'change', this.render);
        if (options) {
            this.lat = options.lat || 5;
            this.lng = options.lng || -90;
            this.platformId = options.platformId || null;
        }

        return this;
    },
    _onBeforeRender: function() {
        try {

            var map = L.map(this.id, {
                zoomControl: true,
                minZoom: 7,
                maxZoom: 10
            }).setView([this.lat, this.lng], 7);
            // Commenting this out for now until security and web mapping service performance are resolved
            L.tileLayer.wms('http://gmrt.marine-geo.org/cgi-bin/mapserv?map=/public/mgg/web/gmrt.marine-geo.org/htdocs/services/map/wms_merc.map&', {
                layers: 'topo',
                format: 'image/png',
                transparent: true,
                crs: L.CRS.EPSG4326,
                attribution: 'Global Multi-Resolution Topography (GMRT), Version 3.2'
            })
                .addTo(map);

/*            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri', maxZoom: 13})
                .addTo(map);*/

                map.dragging.disable();
                map.touchZoom.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.keyboard.disable();

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

            $.when(map).done(function() {
                var arrayData = [];
                _.each(renderContext.collection.toGeoJSON(), function(geoJSON) {
                    if (String(geoJSON.properties.code).indexOf('MOAS') < 0) {
                        arrayData.push(geoJSON);
                    }
                });

                var mooringIcon = new L.divIcon({className: 'mooringIcon', iconSize: [15, 15]});
                var otherMooringIcon = new L.divIcon({className: 'otherMooringIcon', iconSize: [20, 20]});

                var referencePlatforms = [];
                var primaryArray = renderContext.platformId.substr(0,2);
                _.each(renderContext.collection.byArray(primaryArray).toGeoJSON(), function(geoJSON) {
                    referencePlatforms.push(geoJSON);
                });


                var marker = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [renderContext.lng, renderContext.lat]
                    }
                };

                L.geoJson(arrayData, {
                    pointToLayer: function(feature, latlng) {
                        return new L.Marker(latlng, {icon: otherMooringIcon});
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on('mouseover', function(e) {
                            var content = feature.properties.description + '<br>' + '<span>' + JSON.stringify(Number(e.latlng.lat.toFixed(4))) + ', ' + JSON.stringify(Number(e.latlng.lng.toFixed(4))) + '</span>' ;
                            document.getElementById('info').innerHTML = content;

                        });
                    }
                }).addTo(map);

                L.geoJson(marker, {
                    pointToLayer: function(feature, latlng) {
                        return new L.Marker(latlng, {icon: mooringIcon});
                    },
                }).addTo(map);
            });
        } catch (error) {
            console.log(error);
            debugger;
        }
    }
});
