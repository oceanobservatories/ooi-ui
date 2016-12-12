// Parent class for asset views.
var ParentView = Backbone.View.extend({
    /* Parent class for views.
     *  - initialize()
     *  - render()
     *  - derender()
     */
    initialize: function(options) {
        _.bindAll(this, 'render', 'derender');
    },
    render: function() {
        if (this.model) {
            // we're using geoJSON here.  Make sure when you access the
            // object in the partial you are referencing the ArrayModel's .toGeoJSON() method
            // return, and not the actual model.
            // e.g. properties.description NOT this.model.attributes. . .
            this.$el.html(this.template(this.model.toGeoJSON()));
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
    events: {
        'mouseover .js-expand': '_highlightArray',
        'mouseout .js-expand': '_lowlightArray',
        'mouseover tr': '_highlightPlatform',
        'mouseout tr': '_lowlightPlatform'
    },

    _highlightArray: function(event) {
        var arrayIconHighlight = new L.divIcon({className: 'mydivicon-hover', iconSize: [20, 20]});
        var targetCode = ($(event.target).parent().parent())[0];
        _.each(map._layers, function(layer) {
            if(layer._icon){
                if(targetCode.id.indexOf(layer.feature.properties.code) > -1 || targetCode.outerHTML.indexOf(layer.feature.properties.code) > -1)
                {

                    layer.setIcon(arrayIconHighlight);
                }
            }
        });
    },
    _lowlightArray: function(event) {
        var arrayIcon = new L.divIcon({className: 'mydivicon', iconSize: [20, 20]});
        var targetCode = ($(event.target).parent().parent());

        _.each(map._layers, function(layer) {
            if(layer._icon){
                if(layer.feature.properties.code.indexOf(targetCode[0].id) > -1){
                    layer.setIcon(arrayIcon);
                }
            }
        });
    },
    _highlightPlatform: function(event) {
        var platIconHighlight = new L.divIcon({className: 'mydivicon-hover', iconSize: [20, 20]});
        var targetGrandParent = ($(event.target).parent().parent())[0];
        var targetParent = ($(event.target).parent())[0];
        _.each(map._layers, function(layer) {
            if(layer._icon){
               if(targetParent.getAttribute("data-code") == layer.feature.properties.code || targetGrandParent.getAttribute("data-code") == layer.feature.properties.code && layer.feature.properties.code.length > 2){
                   layer.setIcon(platIconHighlight);
                }
            }
        });
    },
    _lowlightPlatform: function(event) {
        var platIconLowLight = new L.divIcon({className: 'mydivicon', iconSize: [20, 20]});
        var targetCode = ($(event.target).parent().parent());

        var targetGrandParent = ($(event.target).parent().parent())[0];
        var targetParent = ($(event.target).parent())[0];
        _.each(map._layers, function(layer) {
            if(layer._icon && targetParent.getAttribute("data-code")){

               if(layer.feature.properties.code.indexOf(targetCode[0].id) > -1){
                    layer.setIcon(platIconLowLight);
                }

            }
        });
    },
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
            model.set({platforms: platforms.toGeoJSON()});

            // finally, return the array content summary, which will also contain
            // it's platforms to be displayed after the array is inspected.
            //console.log('ArrayContentSummaryItem model');
            //console.log(model);
            return (new ArrayContentSummaryItem({model: model})).render().el;
        });

        // prepend the arrays to the page.
        setTimeout(function() {
            arrayContentContext.$el.prepend(arrayContentSummaryItem);
            $('.js-expand').css({height: Math.floor(vph/arrayContentContext.collection.arrayCollection.length) -
                2 * arrayContentContext.collection.arrayCollection.length + 'px'});
        }, 300);

        $("#loadingSpinner").hide();
    }
});

var ArrayContentSummaryItem = ParentView.extend({
    events: {
        'click .js-expand': '_flyFly',
        'click .js-view-subsite span': '_flyToSubsite'
        //'mouseover .js-platform-table tr': '_popUpForPlatform',
        //'click .js-platform-table tr': '_goToPlatform',
    },
    _flyToSubsite: function(event) {
        var target = $(event.target),
            lat = target.data('lat').toString(),
            lng = target.data('lon').toString();

        if (this.activePlatform === target.attr('id')) {
            this.activePlatform = undefined;
            // map.setLayoutProperty('ceArray', 'visibility', 'none');
            // map.setLayoutProperty('rsMoorings', 'visibility', 'none');
            map.setView([45.769225,-128.804111], 5);
        } else {
            this.activePlatform = target.attr('id');

            // map.setLayoutProperty('rsMoorings', 'visibility', 'visible');
            map.setView([lat, lng]);
        }
    },
    _popUpForPlatform: _.debounce(function(event) {
        event.stopImmediatePropagation;
        var title = $(event.target).parent().data('title'),
            lat = $(event.target).parent().data('lat'),
            lon = $(event.target).parent().data('lon');


        // CE
        if ($(event.target).parent().data('title').indexOf('OR ') > -1 || $(event.target).parent().data('code').indexOf('CE05MOAS') > -1) {
            map.setView([44.6499, -124.6133]);
        }

        if ($(event.target).parent().data('title').indexOf('WA ') > -1) {
            map.setView([ 46.9798, -124.6269]);
        }

        // RS
        if ($(event.target).parent().data('title').indexOf('Axial') > -1) {
            map.setView([45.900, -130.055]);
        }

        if ($(event.target).parent().data('title').indexOf('Continental') > -1) {
            map.setView([44.5028, -125.3707]);
        }

        this._addPopup([lon, lat], title);
    }, 100),
    _goToPlatform: function(event) {
        event.stopImmediatePropagation;

        var code = $(event.target).parent().data('code');
        window.open("/platformnav?id="+code);

    },
    // _flyBye and flyFly are controls that interact directly with the global map variable.
    // because of this, the ArrayContentSummary Item is tightly coupled to the VectorMap
    _toggleActive: function(event) {
        var el = $('#'+this.model.attributes.array_code);
        //toggle current one class
        el.toggleClass('active');

        //remove any existing actives
        if ($( ".js-array" ).not(el).hasClass('active')) {
            $( ".js-array" ).not(el).removeClass('active');
        }
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
        map.setView([15.8, -90], originalZoom);
        // map.setLayoutProperty('rsArray', 'visibility', 'visible');
        // map.setLayoutProperty('ceArray', 'visibility', 'visible');
        map._hidePlatformView();
        $('.js-array').removeClass('active');
        //popup.remove();

        // when resetting the page, change the title back to 'Home'
        bannerTitle = 'Status Navigation';
        banner.changeTitle({bannerTitle});
    },
    _addPopup: function(loc, name) {
        popup.setLngLat(loc)
        .setHTML('<span>' +name+'</span>')
        .addTo(map);
    },
    _flyFly: _.debounce(function(event) {
        var flyFlyContext = this;
        map._showPlatformView();
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

            var isLngGreater = Math.round(pt1.lng) > Math.round(pt2[1]) - RANGE;
            var isLngLess = Math.round(pt1.lng) < Math.round(pt2[1]) + RANGE;
            var isPt1LngBetweenPt2Lng = isLngGreater && isLngLess;

            var isLatGreater = Math.round(pt1.lat) > Math.round(pt2[0]) - RANGE;
            var isLatLess = Math.round(pt1.lat) < Math.round(pt2[0]) + RANGE;
            var isPt1LatBetweenPt2Lat = isLatGreater && isLatLess;

            return ((isPt1LngBetweenPt2Lng) && (isPt1LatBetweenPt2Lat)) ? true : false;
        });

        // end helper monkies

        // map._setPlatformView();
        //console.log(this.model.attributes);
        var loc = [
                this.model.attributes.geo_location.coordinates[0][0][0],
                this.model.attributes.geo_location.coordinates[0][0][1]
            ],
            code = this.model.attributes.array_code,
            name = this.model.attributes.array_name;

        if (code === 'CE') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                // map.setLayoutProperty('rsArray', 'visibility', 'none');
                map.setView([loc[0]+1.8, loc[1]],7);
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        } else if (code === 'RS') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                // map.setLayoutProperty('ceArray', 'visibility', 'none');
                map.setView([loc[0], loc[1]+1],7);
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        } else if (code === 'CP') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                map.setView([loc[0], loc[1]],8);
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        } else if (code === 'GS') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                map.setView([loc[0], loc[1]],6);
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        } else if (code === 'GI') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                map.setView([loc[0], loc[1]],7);
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        } else if (code === 'GA') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                map.setView([loc[0], loc[1]],6);
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        } else if (code === 'GP') {
            if ( !_compareGeoLoc(map.getCenter(), loc) ) {
                flyFlyContext.originalZoom = map.getZoom();
                // map.setLayoutProperty('rsArray', 'visibility', 'none');
                // map.setLayoutProperty('ceArray', 'visibility', 'none');
                map.setView([loc[0], loc[1]],6);
            } else {
                this._flyBye(flyFlyContext.originalZoom);
            }
        }
    }, 500, true),
    template: JST['ooiui/static/js/partials/home/array_content/ArrayStatusSummaryItem.html']
});
