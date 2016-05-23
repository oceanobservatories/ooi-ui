// Parent class for asset views.
var ParentView = Backbone.View.extend({
    /* Parent class for views.
     *  - initialize()
     *  - render()
     *  - derender()
     */
    initialize: function() {
        _.bindAll(this, 'render', 'derender');
    },
    render: function() {
        if (this.model) {
            // we're using geoJSON here.  Make sure when you access the
            // object in the partial you are referencing the ArrayModel's .toJSON() method
            // return, and not the actual model.
            // e.g. properties.description NOT this.model.attributes. . .
            this.$el.html(this.template(this.model.toJSON()));
        } else {
            this.$el.html(this.template());
        }

        return this;
    },
    derender: function() {
        this.remove();
        this.unbind();
        this.model.off();
    }
});

var ArrayContentSummary = ParentView.extend({
    render: function() {
        var arrayContentContext = this;

        var arrayContentSummaryItem = this.collection.arrayCollection.map(function(model) {
            // lets get all the platforms for this particular array...
            var platforms = arrayContentContext
                                .collection
                                .platformCollection
                                .byArray(model.attributes.array_code);

            // then we can set an object on the array model, so we have a geoJSON
            // representation of all of the array's platforms, with lng/lat
            model.set({platforms: platforms.toJSON()});

            // finally, return the array content summary, which will also contain
            // it's platforms to be displayed after the array is inspected.
            return (new ArrayContentSummaryItem({model: model})).render().el;
        });

        // prepend the arrays to the page.
        this.$el.prepend(arrayContentSummaryItem);
    }
});

var ArrayContentSummaryItem = ParentView.extend({
    events: {
        'click .js-expand': '_flyFly',
        //'mouseover .js-platform-table tr': '_popUpForPlatform',
        'click .js-platform-table tr': '_goToPlatform',
    },
    _popUpForPlatform: _.debounce(function(event) {
        event.stopImmediatePropagation;
        var title = $(event.target).parent().data('title'),
            lat = $(event.target).parent().data('lat'),
            lon = $(event.target).parent().data('lon');


        // CE
        if ($(event.target).parent().data('title').indexOf('OR ') > -1 || $(event.target).parent().data('code').indexOf('CE05MOAS') > -1) {
            map.flyTo({
                center: [-124.6133, 44.6499],
                speed: 0.3, // make the flying slow
                curve: 1, // change the speed at which it zooms out
            });
        }

        if ($(event.target).parent().data('title').indexOf('WA ') > -1) {
            map.flyTo({
                center: [-124.6269, 46.9798],
                speed: 0.3, // make the flying slow
                curve: 1, // change the speed at which it zooms out
            });
        }

        // RS
        if ($(event.target).parent().data('title').indexOf('Axial') > -1) {
            map.flyTo({
                center: [-130.055, 45.900],
                speed: 0.4, // make the flying slow
                curve: 1, // change the speed at which it zooms out
            });
        }

        if ($(event.target).parent().data('title').indexOf('Continental') > -1) {
            map.flyTo({
                center: [-125.3707, 44.5028],
                speed: 0.4, // make the flying slow
                curve: 1, // change the speed at which it zooms out
            });
        }

        this._addPopup([lon, lat], title);
    }, 100),
    _goToPlatform: function(event) {
        event.stopImmediatePropagation;

        var code = $(event.target).parent().data('code');
        window.open("/platform?id="+code);

    },
    // _flyBye and flyFly are controls that interact directly with the global map variable.
    // because of this, the ArrayContentSummary Item is tightly coupled to the VectorMap
    _toggleActive: function(event) {
        var el = $('#'+this.model.attributes.array_code);

        if ($('.js-array').hasClass('active')) {
            $('.js-array').removeClass('active');
        }
        el.toggleClass('active');

    },
    _toggleOthers: function(event) {
        var el = $('#'+this.model.attributes.array_code),
            arrayEl = $('.js-array');

        _.each(arrayEl, function(item) {
            var id = $(item).attr('id'),
                elId = el.attr('id');

            if (id !== elId) {
                $(item).animate({
                    opacity: 'toggle',
                    height: 'toggle'
                }, 500);
            }
        });
    },
    _flyBye: function(originalZoom) {
        console.log(originalZoom)
        map.flyTo({center: [-90, 5], zoom: originalZoom, pitch: 0, bearing: 0});
        map.setLayoutProperty('rsArray', 'visibility', 'visible');
        map.setLayoutProperty('eaArray', 'visibility', 'visible');
        map._setArrayView();
        $('.js-array').removeClass('active');
        popup.remove();

        // when resetting the page, change the title back to 'Home'
        bannerTitle = 'Home';
        banner.changeTitle({bannerTitle});
    },
    _addPopup: function(loc, name) {
        popup.setLngLat(loc)
        .setHTML('<span>' +name+'</span>')
        .addTo(map);
    },
    _flyFly: _.debounce(function(event) {
        var flyFlyContext = this;
        event.stopImmediatePropagation();
        flyFlyContext.originalZoom;

        $.when(this._toggleActive(event)).done(function() {
            $.when(flyFlyContext._toggleOthers(event)).done(function() {
                var el = $('#'+flyFlyContext.model.attributes.array_code),
                    table = '#' + el.attr('id') + ' > .js-platform-table';
                $(table).slideToggle();

                // give the impression that the page has changed, change the title.
                bannerTitle = flyFlyContext.model.attributes.array_name;
                banner.changeTitle({bannerTitle});
            });
        });

        // helper monkies

        /* @private _compareGeoLoc
         * Given Point 1 (pt1), return bool if between a RANGE centered at Point 2 (pt2).
         *
         * @private _addPopup
         * Adds the global popup variable with HTML to the global map variable.
         */

        var _compareGeoLoc = (function (pt1, pt2) {
            var RANGE = 10;

            var isLngGreater = Math.round(pt1.lng) > Math.round(pt2[0]) - RANGE;
            var isLngLess = Math.round(pt1.lng) < Math.round(pt2[0]) + RANGE;
            var isPt1LngBetweenPt2Lng = isLngGreater && isLngLess;

            var isLatGreater = Math.round(pt1.lat) > Math.round(pt2[1]) - RANGE;
            var isLatLess = Math.round(pt1.lat) < Math.round(pt2[1]) + RANGE;
            var isPt1LatBetweenPt2Lat = isLatGreater && isLatLess;

            return ((isPt1LngBetweenPt2Lng) && (isPt1LatBetweenPt2Lat)) ? true : false;
        });

        // end helper monkies

        map._setPlatformView();
        var loc = [
                this.model.attributes.geo_location.coordinates[0][0][1],
                this.model.attributes.geo_location.coordinates[0][0][0]
            ],
            code = this.model.attributes.array_code,
            name = this.model.attributes.array_name;

        if (code === 'CE') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                map.setLayoutProperty('rsArray', 'visibility', 'none');
                map.flyTo({center: loc, zoom: 4});
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        } else if (code === 'RS') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                map.setLayoutProperty('ceArray', 'visibility', 'none');
                map.flyTo({center: loc, zoom: 4});
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        } else if (code === 'CP') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                map.flyTo({center: loc, zoom: 5});
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        } else if (code === 'GS') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                map.flyTo({center: loc, zoom: 4});
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        } else if (code === 'GI') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                map.flyTo({center: loc, zoom: 4});
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        } else if (code === 'GA') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                map.flyTo({center: loc, zoom: 4});
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        } else if (code === 'GP') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                map.setLayoutProperty('rsArray', 'visibility', 'none');
                map.setLayoutProperty('ceArray', 'visibility', 'none');
                map.flyTo({center: loc, zoom: 4});
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        }
    }, 500, true),
    template: JST['ooiui/static/js/partials/home/array_content/ArrayContentSummaryItem.html']
});

var PlatformContentTable = ParentView.extend({
    el: 'table',
    render: function() {
        var platformContentItem = this.collection.byMoorings().map(function(model) {
            return (new PlatformContentItem({model: model})).render().el;
        });

        this.$el.append(platformContentItem);
    },
    template: JST['ooiui/static/js/partials/home/array_content/PlatformTable.html']
});

// var PlatformContentItem = ParentView.extend({
//     tagName: 'tr',
//     template: JST['ooiui/static/js/partials/home/array_content/PlatformTableItem.html']
// });
