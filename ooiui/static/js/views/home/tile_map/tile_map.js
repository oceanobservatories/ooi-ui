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
            L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri', maxZoom: 13})
                .addTo(map);

                map.dragging.disable();
                map.touchZoom.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.keyboard.disable();

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
        map.setView([15.8, -90], 2);

    },
    _showPlatformView: function() {
        'use strict';
        // When we're in the platform view, we don't want to see any array icons.
        _.each(map._layers, function(platform) {
            if(platform._icon && platform.feature.properties.code.length > 2){
                platform._icon.style.opacity = 1;
            };
            if(platform._icon && platform.feature.properties.code.length < 3){
                platform._icon.style.opacity = 0;
                platform._icon.style.zIndex = -1;
            };
        });
    },
    _hidePlatformView: function() {
        'use strict';
        // When we're in the platform view, we don't want to see any array icons.
        _.each(map._layers, function(platform) {
            if(platform._icon && platform.feature.properties.code.length > 2){
                platform._icon.style.opacity = 0;
            };
            if(platform._icon && platform.feature.properties.code.length < 3){
                platform._icon.style.opacity = 1;
                platform._icon.style.zIndex = 1000;
            };
        });
    },
    render: function() {
        try {
            var renderContext = this;
            var arrayIcon = new L.divIcon({className: 'mydivicon', iconSize: [20, 20], opacity: 1, zIndex: 1000});

            // global
            map = this._onBeforeRender();

            $.when(map).done(function() {
                var arrayData = [];
                _.each(renderContext.collection.arrayCollection.toGeoJSON(), function(geoJSON) {
                    arrayData.push(geoJSON);
                });
                
                var platformData = [];
                _.each(renderContext.collection.platformCollection.toGeoJSON(), function(geoJSON) {
                    platformData.push(geoJSON);
                });
                
                L.geoJson(arrayData, {

                    pointToLayer: function(feature, latlng) {
                        return new L.Marker(latlng, {icon: arrayIcon});
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on('click', function(event) {
                            $('#'+feature.properties.code + ' .js-expand').trigger('click');
                        });
                        layer.on('mouseover', function(event) {
                            $('#'+feature.properties.code + ' .js-expand').css("border", "4px solid orange");
                        });
                        layer.on('mouseout', function(event) {
                            $('#'+feature.properties.code + ' .js-expand').css("border", "");
                        });
                    }
                }).addTo(map);

                L.geoJson(platformData, {

                    pointToLayer: function(feature, latlng) {
                        return new L.Marker(latlng, {icon: arrayIcon});
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on('mouseover', function(event) {
                            $('#'+feature.properties.code.substring(0,2) + ' table tbody tr[data-code="'+feature.properties.code+'"]').css("border", "4px solid orange");
                        });
                        
                        layer.on('mouseout', function(event) {
                            $('#'+feature.properties.code.substring(0,2) + ' table tbody tr[data-code="'+feature.properties.code+'"]').css("border", "");
                        });
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
