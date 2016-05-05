var TileMap = Backbone.View.extend({
    initialize: function() {
        // The geoJSON data, d3.json();
        this.listenTo(this.collection, 'change', this.render);
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

                return map;

        } catch (error) {
            console.log(error);
            debugger;
        }
    },
    render: function() {
        try {
            var renderContext = this;

            // global
            map = this._onBeforeRender();

            $.when(map).done(function() {
                var arrayData = [];
                _.each(renderContext.collection.arrayCollection.toJSON(), function(geoJSON) {
                    arrayData.push(geoJSON);
                });

                var platformData = [];
                _.each(renderContext.collection.platformCollection.toJSON(), function(geoJSON) {
                    platformData.push(geoJSON);
                });

                var mooringIcon = L.icon({
                    iconUrl: '/img/mooring.png',
                    iconSize:     [50, 50], // size of the icon
                    iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
                    popupAnchor:  [0, -10] // point from which the popup should open relative to the iconAnchor
                });

                L.geoJson(platformData, {
                    style: function(feature) {
                        return {color: 'yellow'};
                    },
                    pointToLayer: function(feature, latlng) {
                        return new L.CircleMarker(latlng, {radius: 3, fillOpacity: 0.85});
                    },
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup('<span>'+feature.properties.description+'</span>');
                    }
                }).addTo(map);

                L.geoJson(arrayData, {
                    style: function(feature) {
                        return {color: 'green'};
                    },
                    pointToLayer: function(feature, latlng) {
                        return new L.CircleMarker(latlng, {radius: 10, fillOpacity: 0.85});
                    },
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup('<span>'+feature.properties.description+'</span>');
                    }
                }).addTo(map);
            });
        } catch (error) {
            console.log(error);
            debugger;
        }
    }
});
