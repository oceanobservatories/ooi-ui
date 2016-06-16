/*
 * Created by M@Campbell 04/20/2016
 *
 * The following are set as global for use in the array_content sidebar.
 * @global map
 * @global popup
 *
 */

var VectorMap = Backbone.View.extend({
    initialize: function(options) {
        if (options) {
            this.lat = options.lat || 5;
            this.lng = options.lng || -90;
        }
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
                center: [this.lng, this.lat],
                zoom: 5,
                interactive: true
            });

            // add some methods that can be useful to our map object.
            map._resizeMap = this._resizeMap;

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


                    map.addSource('marker', {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [{
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [renderContext.lng, renderContext.lat]
                                }
                            }]
                        }
                    });

                    map.addLayer({
                        id: 'marker',
                        source: 'marker',
                        type: 'circle',
                        paint: {
                            'circle-radius': 10,
                            'circle-color': 'orange'
                        }
                    });

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

                    } else {

                    }
                });

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
