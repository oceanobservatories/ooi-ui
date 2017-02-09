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

            var map = L.map(this.id, {
                zoomControl: true,
                minZoom: 9,
                maxZoom: 14
            }).setView([this.lat, this.lng], 9);
            // Commenting this out for now until security and web mapping service performance are resolved
            L.tileLayer.wms('http://gmrt.marine-geo.org/cgi-bin/mapserv?map=/public/mgg/web/gmrt.marine-geo.org/htdocs/services/map/wms_merc.map&', {
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

                // map.dragging.disable();
                // map.touchZoom.disable();
                map.doubleClickZoom.disable();
                // map.scrollWheelZoom.disable();
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
                    otherSites.push(geoJSON);
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

                L.geoJson(otherSites, {
                    pointToLayer: function(feature, latlng) {
                        return new L.Marker(latlng, {icon: otherMooringIcon});
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

                L.geoJson(marker, {
                    pointToLayer: function(feature, latlng) {
                        return new L.Marker(latlng, {icon: mooringIcon});
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on('mouseover', function(e) {
                            var content = feature.properties.description + '<br>' + '<span>' + JSON.stringify(Number(e.latlng.lat.toFixed(4))) + ', ' + JSON.stringify(Number(e.latlng.lng.toFixed(4))) + '</span>' ;
                            document.getElementById('info').innerHTML = content;

                        });
                        // layer.on('click', function(e) {
                        //     window.open("/platformnav?id="+ btoa(feature.properties.code) +"&lat=" + btoa(JSON.stringify(Number(e.latlng.lat.toFixed(4)))) + "&lng=" + btoa(JSON.stringify(Number(e.latlng.lng.toFixed(4)))),'_self');
                        // });
                    }
                }).addTo(map);
            });
        } catch (error) {
            console.log(error);
            debugger;
        }
    }
});
