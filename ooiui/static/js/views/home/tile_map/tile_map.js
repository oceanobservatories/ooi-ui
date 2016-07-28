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
            var arrayIcon = new L.divIcon({className: 'mydivicon', iconSize: [20, 20]});

            // global
            map = this._onBeforeRender();

            $.when(map).done(function() {
                var arrayData = [];
                _.each(renderContext.collection.arrayCollection.toGeoJSON(), function(geoJSON) {
                    arrayData.push(geoJSON);
                });


                var mooringIcon = L.icon({
                    iconUrl: '/img/mooring.png',
                    iconSize:     [50, 50], // size of the icon
                    iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
                    popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
                });

                L.geoJson(arrayData, {
                    //style: function(feature) {
                    //    return {color: 'dimgray'};
                    //},
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

                map.on('click', function (e) {
                    map.setView([15.8, -90], 2);
                    $('.js-array').removeClass('active');
                    $('.js-array').fadeIn();
                    $('.js-platform-table').css('display', 'none');
                });
            });
        } catch (error) {
            console.log(error);
            debugger;
        }
    }
});
