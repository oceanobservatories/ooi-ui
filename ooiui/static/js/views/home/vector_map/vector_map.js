/*
 * Created by M@Campbell 04/20/2016
 *
 * The following are set as global for use in the array_content sidebar.
 * @global map
 * @global popup
 *
 */

var VectorMap = Backbone.View.extend({
    cameraControls: {resetZoom:1.,resetPitch:0,resetBearing:0},
    initialize: function() {
        'use strict';
        //this.listenTo(this.collection, 'change', this.render);
        return this;
    },
    _onBeforeRender: function() {
        'use strict';
        // Hook to handle processes needed before the actual map is loaded.
        try {
            mapboxgl.accessToken = 'pk.eyJ1IjoicnBzbWFrYSIsImEiOiJjaWo4dDI2dnAwMDFqdXhseDNlOWdodHVqIn0.Xev64hHKuuUXS5TBgrozfQ';
            var map = new mapboxgl.Map({
                container: this.id,
                style: 'mapbox://styles/rpsmaka/cinc29jhd000rb2kvn2v8zfv0',
                center: [-90, 5],
                maxBounds: [[-179,-70],[0,70]],
                interactive: true
            });

            // add some methods that can be useful to our map object.
            map._resizeMap = this._resizeMap;
            map._setArrayView = this._setArrayView;
            map._setPlatformView = this._setPlatformView;

            // Once we've created the map object, pass it back to continue with the page
            // rendering.
            return map;

        } catch (error) {
            console.log(error);
            //debugger;
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

            /* Initialize the map singleton to be used across the entire page session.
             * @global map
             */
            map = this._onBeforeRender();
            var originalZoom = map.getZoom();
            /* Initialize the popup singleton to be used whenever we need a popup.
             * @global popup
             */
            popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });


            $.when(map).done(function() {
               /* ****************************************************
                * Begin Map Load
                * ***************************************************/
                map.on('load', function() {
                    // define some map interaction restrictions
                    map.scrollZoom.disable();
                    map.dragPan.disable();
                    map.doubleClickZoom.disable();
                    map.dragRotate.disable();

                    // someone couldn't figure out where north was...
                    map.addControl(new mapboxgl.Navigation({
                        position: 'bottom-left'
                    }));

                    // Take our array collection and separate out the RS and CE arrays from the rest
                    // These two arrays overlap, so lets try to keep them apart as much as
                    // possible.
                    var arrayData = [],
                        rsArrayData = [],
                        ceArrayData = [];
                    _.each(renderContext.collection.arrayCollection.toJSON(), function(geoJSON) {
                        if (geoJSON.properties.code === 'RS') {
                            rsArrayData.push(geoJSON);
                        } else if (geoJSON.properties.code === 'CE') {
                            ceArrayData.push(geoJSON);
                        } else {
                            arrayData.push(geoJSON);
                        }
                    });


                    // Setup the mooring data by filtering out ... the moorings.
                    var mooringData = [];
                    _.each(renderContext.collection.platformCollection.byMoorings().toJSON(), function(geoJSON) {
                        mooringData.push(geoJSON);
                    });

                    // Likewise we'll get the gliders out of the platform collection.
                    var gliderData = [];
                    _.each(renderContext.collection.platformCollection.byGliders().toJSON(), function(geoJSON) {
                        gliderData.push(geoJSON);
                    });

                    // Maps need sources.  Lets get some.
                    map.addSource('arrays', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': arrayData
                        }
                    }).addSource('rsArray', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': rsArrayData
                        }
                    }).addSource('ceArray', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': ceArrayData
                        }
                    }).addSource('moorings', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': mooringData
                        }
                    }).addSource('gliders', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': gliderData
                        }
                    });

                    // Maps need their layers with sources in them.  Do it.
                    map.addLayer({
                        'id': 'arrays',
                        'source': 'arrays',
                        'type': 'symbol',
                        'layout': {
                            'visibility': 'visible',
                            'icon-image': '{marker-symbol}',
                            'text-field': '{title}',
                            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                            'text-offset': [0, -1],
                            'text-anchor': 'bottom',
                            'text-size': 14,
                            'icon-size': 1.0,
                            'icon-allow-overlap': true
                        }
                    }).addLayer({
                        'id': 'rsArray',
                        'source': 'rsArray',
                        'type': 'symbol',
                        'layout': {
                            'visibility': 'visible',
                            'icon-image': '{marker-symbol}',
                            'text-field': '{title}',
                            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                            'text-offset': [0.5, -1],
                            'text-anchor': 'left',
                            'text-size': 14,
                            'icon-size': 1.0,
                            'icon-allow-overlap': true
                        }
                    }).addLayer({
                        'id': 'ceArray',
                        'source': 'ceArray',
                        'type': 'symbol',
                        'layout': {
                            'visibility': 'visible',
                            'icon-image': '{marker-symbol}',
                            'text-field': '{title}',
                            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                            'text-offset': [-0.5, 1],
                            'text-anchor': 'left',
                            'text-size': 14,
                            'icon-size': 1.0,
                            'icon-allow-overlap': true
                        }
                    }).addLayer({
                        'id': 'gliders',
                        'source': 'gliders',
                        'type': 'circle',
                        'paint': {
                            'circle-radius': 5,
                            'circle-color': 'orange'
                        },
                        'layout': {
                            'visibility': 'none'
                        }
                    }).addLayer({
                        'id': 'moorings',
                        'source': 'moorings',
                        'type': 'circle',
                        'paint': {
                            'circle-radius': 7,
                            'circle-color': 'yellow',
                            'circle-opacity': 0.5
                        },
                        'layout': {
                            'visibility': 'none'
                        }
                    });
                    map.addLayer({
                        "id": "route-hover",
                        "type": "fill",
                        "source": "arrays",
                        "layout": {},
                        "paint": {
                            "fill-color": "#627BC1",
                            "fill-opacity": 1
                        },
                        "filter": ["==", "name", ""]
                    });
                    /*
                     * At some point, we'll need to get the icons loaded.  For now, overlap/clustering
                     * will cause some discomfort.  Painting is far more accurate, but is not ideal.
                     *
                     * map.addLayer({
                        'id': 'gliders',
                        'source': 'gliders',
                        'type': 'symbol',
                        'layout': {
                            'visibility': 'none',
                            'icon-image': '{marker-symbol}',
                            "text-anchor": "top"
                       }
                    });

                    map.addLayer({
                        'id': 'moorings',
                        'source': 'moorings',
                        'type': 'symbol',
                        'layout': {
                            'visibility': 'none',
                            'icon-image': '{marker-symbol}',
                            "text-anchor": "top"
                        }
                    });
                    */

                   // Maps need to be poked and prodded.  Set that up.
                });
               /* ****************************************************
                * End Map Load
                * ***************************************************/

               /* ****************************************************
                * Begin Map Events
                * ***************************************************/
                map.on('click', function (e) {
                    // Use queryRenderedFeatures to get features at a click event's point
                    // Use layer option to avoid getting results from other layers
                    var features = map.queryRenderedFeatures(e.point, { layers: ['arrays', 'rsArray', 'ceArray', 'moorings', 'gliders'] });
                    // if there are features within the given radius of the click event,
                    // fly to the location of the click event
                    if (features.length) {
                        if (features[0].layer.id === 'arrays' || features[0].layer.id === 'rsArray' || features[0].layer.id === 'ceArray') {
                            // Get coordinates from the symbol and center the map on those coordinates
                            // show the layer
                            map._setPlatformView();

                            // We need to tightly couple the array_content view in order to cause the
                            // array list to move when a map point is clicked.
                            //
                            // Simulate a click on the array_content.
                            $('#'+features[0].properties.code + ' .js-expand').trigger('click');


                        } else if (features[0].layer.id === 'moorings' || 'gliders') {
                            console.log('platforms');
                            // show the layer
                            map._setPlatformView();

                        }
                    } else {
                            map.setLayoutProperty('ceArray', 'visibility', 'visible');
                            map.setLayoutProperty('rsArray', 'visibility', 'visible');
                            map._setArrayView();
                            map.flyTo({center:[-90, 5],
                                uaxBounds: [[-179,-70],[0,70]],
                                speed: 1.,
                                zoom: originalZoom,
                                pitch: 0, 
                                bearing: 0});
                            $('.js-array').removeClass('active');
                            $('.js-array').fadeIn();
                            $('.js-platform-table').css('display', 'none');
                            renderContext.cameraControls.resetZoom = 1.;
                            renderContext.cameraControls.resetPitch = 0;
                            renderContext.cameraControls.resetBearing = 0;
                       
                    }
                });

                // When we're zoomed in, click to open a popup, this will give us some ability to interact with
                // the popup for navigation to other pages.
                map.on('click', function(e) {
                    if (map.getZoom() > 2.2) {
                        var features = map.queryRenderedFeatures(e.point, { layers: ['moorings', 'gliders'] });
                        // Change the cursor style as a UI indicator.
                        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

                        if (!features.length) {
                            return;
                        }

                        var feature = features[0];

                        console.log(feature);

                        // Populate the popup and set its coordinates
                        // based on the feature found.
                        popup.setLngLat(feature.geometry.coordinates)
                        .setHTML(feature.properties.description)
                        .addTo(map);
                    }
                });

                // Only listen to the mouse move event for popups at predefined zoom levels.  That way we won't
                // have popups being left behind when icons are close together.
                map.on('mousemove', function(e) {
                    if (map.getZoom() <= 2.2) {
                        var features = map.queryRenderedFeatures(e.point, { layers: ['moorings', 'gliders'] });
                        // Change the cursor style as a UI indicator.
                        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

                        if (!features.length) {
                            popup.remove();
                            return;
                        }

                        var feature = features[0];

                        // Populate the popup and set its coordinates
                        // based on the feature found.
                        popup.setLngLat(feature.geometry.coordinates)
                        .setHTML(feature.properties.description)
                        .addTo(map);

                    }
                });

                // This listener simply sets the cursor to 'pointer' for any feature in the layer list.
                map.on('mousemove', function (e) {
                    var features = map.queryRenderedFeatures(e.point, { layers: ['arrays', 'rsArray', 'ceArray', 'moorings', 'gliders'] });
                    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
                });

                // This listener will update the overlay with lat/lng and the name of the feature under cursor.
                //map.on('mousemove', function (e) {

                    //var features = map.queryRenderedFeatures(e.point, { layers: ['arrays', 'rsArray', 'ceArray', 'moorings', 'gliders'] });
                    //if (features.length) {
                    //    feature = features[0].properties.description + '<br>' + '<span>' + JSON.stringify(e.lngLat.lat) + ', ' + JSON.stringify(e.lngLat.lng) + '</span>' ;
                    //} else {
                    //    feature = "Mouse over icon to inspect";
                    //}

                    //document.getElementById('info').innerHTML = feature;
                //});
               /* ****************************************************
                * End Map Events
                * ***************************************************/
            });
        } catch (error) {
            console.log(error);
            //debugger;
        }
    }
});
