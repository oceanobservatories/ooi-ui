"use strict";
/*
 * ooiui/static/js/views/common/CamImageView.js
 *
 * Dependencies
 * - slick
 * Partials
 * -
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var CamImageView = Backbone.View.extend({
    className: 'cam-image-list',
    events: {

    },
    initialize: function() {
        _.bindAll(this, "render");
    },
    template: _.template('<div id="camImageGallery"> </div>'),
    add:function(subview){
        this.$el.find('#camImageGallery').append(subview.el);
    },
    render: function(options) {
        var self = this;
        this.$el.html(this.template(options));

        this.collection.each(function(model) {
            var subview = new CamImageItemView({
                model: model
            });
            self.add(subview);
        });

        this.$el.find('#camImageGallery').slick({
            infinite: true,
            lazyLoad: 'ondemand',
            speed: 500,
            slidesToShow: 5,
            slidesToScroll: 5,
            dots: true
        });

    }
});

var CamImageItemView = Backbone.View.extend({
    className: 'cam-image-item',
    events: {
        "click a" : "itemClick"
    },
    initialize: function() {
        _.bindAll(this, "render","itemClick");
        this.render();
    },
    itemClick:function(evt){
        var self = this;
        evt.preventDefault();
        if (!_.isUndefined(self.model.get('url'))){
            var text = "<small>"+moment().utc(self.model.get("datetime")).format('YYYY-MM-DD')+"</small>";
            bootbox.dialog({
                title: "<h5>"+self.model.get("reference_designator")+"</h5>"+text,
                size:'large',
                message: "<a class='download-full-image' href='"+ self.model.get('url') +"' download='" + self.model.get('filename') +"' title='"+moment().utc(self.model.get("datetime")).format('YYYY-MM-DD')+"'><img height='100%' width='100%' src='" + self.model.get('url') + "'></a>",
                buttons: {
                    success: {
                        label: "Download Image",
                        className: "btn-success",
                        callback: function() {
                            $(this).find('.download-full-image img').click();
                        }
                    },
                    main: {
                        label: "Close",
                        className: "btn-default",
                        callback: function() {
                            //nothing and close
                        }
                    }
                }
            });
        }
    },
    template: JST['ooiui/static/js/partials/CamImageItem.html'],
    render: function(options) {
        this.$el.html(this.template({model:this.model}));
    }
});


var CamImageView2 = Backbone.View.extend({
    //className: 'cam-image-grid',
    events: {

    },
    initialize: function() {
        _.bindAll(this, "render");
    },
    template: _.template('<div class="thumbnail-grid"></div>'),
    add:function(subview){
        this.$el.find('.thumbnail-grid').append(subview.el);
    },
    render: function(options) {
        var self = this;
        this.$el.html(this.template(options));

        var valid_arrays = [];
        var valid_instruments = [];
        var valid_years = [];

        this.collection.each(function(model) {
            var subview = new CamImageItemView2({
                model: model
            });
            // subview.setElement($('#cam-image-grid'));
            self.add(subview);

            var ref_des = model.get('reference_designator');
            var array = ref_des.split('-')[0].substring(0,4).toLowerCase();
            if(array.substring(0,2) !== 'rs') {
                array = ref_des.split('-')[0].substring(0,2).toLowerCase();
            }
            valid_arrays.push(array);

            var instrument = model.get('reference_designator').split('-')[3].substring(0,5).toLowerCase();
            valid_instruments.push(instrument);

            var year = model.get('date').split('-')[0];
            valid_years.push(year);

        });

        var valid_arrays_unique = $.unique(valid_arrays);
        var valid_instruments_unique = $.unique(valid_instruments);
        var valid_years_unique = $.unique(valid_years);

        var all_buttons = $('button').not('[data-filter="*"]');
        all_buttons.prop('disabled',true);

        console.log(valid_arrays_unique);
        valid_arrays_unique.forEach(function(array){
            $('[data-filter=".'+array+'"]')[0].disabled = false;
        });

        console.log(valid_instruments_unique);
        valid_instruments_unique.forEach(function(instrument){
            $('[data-filter=".'+instrument+'"]')[0].disabled = false;
        });

        console.log(valid_years_unique);
        valid_years_unique.forEach(function(year){
            $('[data-filter=".'+year+'"]')[0].disabled = false;
        });

        let filters = {};

        let valid_instrument_cateogries = ['OSMOI', 'MASSP', 'PPS', 'RAS', 'FLOBN', 'CAMDS', 'ZPL'];

        // init Isotope
        let $thumbnailgrid = $('.thumbnail-grid').isotope({
            itemSelector: '.element-item',
            layoutMode: 'packery',
            getSortData: {
                name: '.name',
                symbol: '.symbol',
                number: '.number parseInt',
                category: '[data-category]',
                weight: function( itemElem ) {
                    var weight = $( itemElem ).find('.weight').text();
                    return parseFloat( weight.replace( /[\(\)]/g, '') );
                },
                year: '.year parseInt'
            }
        });

        // filter functions
        var filterFns = {
            // show if number is greater than 50
            numberGreaterThan50: function() {
                var number = $(this).find('.number').text();
                return parseInt( number, 10 ) > 50;
            },
            // show if name ends with -ium
            ium: function() {
                var name = $(this).find('.name').text();
                return name.match( /ium$/ );
            },
            byYear: function() {
                var year = $(this).find('.year').text();
                console.log(year)
                return parseInt( year, 10 ) === 2019;
            }
        };



        // flatten object by concatting values
        function concatValues( obj ) {
            var value = '';
            for ( var prop in obj ) {
                value += obj[ prop ];
            }
            return value;
        }

        // bind filter button click
        $('.filters').on( 'click', '.button', function( event ) {
            //var filterValue = $( this ).attr('data-filter');
            // use filterFn if matches value
            //filterValue = filterFns[ filterValue ] || filterValue;


            var $button = $( event.currentTarget );
            // get group key
            var $buttonGroup = $button.parents('.button-group');
            var filterGroup = $buttonGroup.attr('data-filter-group');
            // set filter for group
            filters[ filterGroup ] = $button.attr('data-filter');
            console.log('filters');
            console.log(filters);
            // combine filters
            var filterValue = concatValues( filters );
            while(filterValue.includes("**"))
                filterValue = filterValue.replace("**", "*");
            console.log('filterValue');
            console.log(filterValue);

            $thumbnailgrid.isotope({ filter: filterValue });
        });

        // change is-checked class on buttons
        $('.button-group').each( function( i, buttonGroup ) {
            var $buttonGroup = $( buttonGroup );
            $buttonGroup.on( 'click', 'button', function() {
                $buttonGroup.find('.is-checked').removeClass('is-checked');
                $( this ).addClass('is-checked');
            });
            $buttonGroup.find('.is-checked').click();
        });


    }
});

var CamImageItemView2 = Backbone.View.extend({
    //className: 'element-item',
    events: {
        "click a" : "itemClick"
    },
    initialize: function() {
        _.bindAll(this, "render","itemClick");
        this.render();
    },
    itemClick:function(evt){
        var self = this;
        evt.preventDefault();
        if (!_.isUndefined(self.model.get('url'))){
            var text = "<small>"+moment().utc(self.model.get("datetime")).format('YYYY-MM-DD')+"</small>";
            bootbox.dialog({
                title: "<h5>"+self.model.get("reference_designator")+"</h5>"+text,
                size:'large',
                message: "<a class='download-full-image' href='"+ self.model.get('url') +"' download='" + self.model.get('filename') +"' title='"+moment().utc(self.model.get("datetime")).format('YYYY-MM-DD')+"'><img height='100%' width='100%' src='" + self.model.get('url') + "'></a>",
                buttons: {
                    success: {
                        label: "Download Image",
                        className: "btn-success",
                        callback: function() {
                            $(this).find('.download-full-image img').click();
                        }
                    },
                    main: {
                        label: "Close",
                        className: "btn-default",
                        callback: function() {
                            //nothing and close
                        }
                    }
                }
            });
        }
    },
    template: JST['ooiui/static/js/partials/CamImageItem2.html'],
    render: function(options) {
        this.setElement(this.template({model:this.model}));
    }
});
