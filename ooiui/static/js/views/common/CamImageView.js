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
    daMap: {},
    dataBounds: {},
    $thumbnailgrid: null,
    filters: {},
    selectedRefDes: null,
    selectedYear: null,
    selectedMonth: null,
    events: {
        //'click input[name="instrument-types"]' : "instrumentTypeSelection",
        //"click .button#years-group" : "yearsButtonClick",
        //"click .filters .button" : "filterButtonClick",
        //"click .button#instruments-group" : "clickInstrumentsGroup"
    },
    initialize: function() {
        _.bindAll(this,
            "render",
            "instrumentTypeSelection",
            "yearsButtonClick",
            "monthsButtonClick",
            "filterButtonClick",
            "clickInstrumentsGroup"
            );
    },
    template: _.template('<div class="thumbnail-grid"></div>'),
    concatValues: function(obj){
        let value = '';
        for ( let prop in obj ) {
            value += obj[ prop ];
        }
        return value;
    },
    // Clicked on the instrument type
    instrumentTypeSelection: function(event){
        console.log('instrumentTypeSelection');
        console.log(event);
        //event.preventDefault();

        let self = this;
        //var filterValue = $( this ).attr('data-filter');
        // use filterFn if matches value
        //filterValue = filterFns[ filterValue ] || filterValue;


        var $button = $( event.currentTarget );
        // get group key
        var $buttonGroup = $button.parents('.button-group');
        var filterGroup = $buttonGroup.attr('data-filter-group');
        // set filter for group
        self.filters[ filterGroup ] = $button.attr('data-filter');
        let instrumentGroup = $button.attr('title');
        //console.log('filters');
        //console.log(filters);
        // combine filters
        var filterValue = self.concatValues( self.filters );
        while(filterValue.includes("**"))
            filterValue = filterValue.replace("**", "*");
        //console.log('filterValue');
        //console.log(filterValue);

        self.$thumbnailgrid.isotope({ filter: filterValue });

        $('.element-item').remove();
        $('#years-group').empty();
        $('#months-group').empty();
        $('#days-group').empty();

        self.collectionInstruments.reset();

        $.when(self.collectionInstruments.fetch({url: '/api/uframe/media/get_instrument_list/'+instrumentGroup})).done(function(data){
            console.log(data);
            $('#instruments-group').empty();
            //$('#instruments-group').append('<button class="button is-checked" data-filter="*">Choose Instrument</button>');
            $.each(data.instruments, function(key, instrument){
                //$.when(self.collectionVocab.fetch({url: '/api/uframe/streams_for/'+instrument})).done(function (vocab) {
                $.when(self.collectionVocab.fetch({url: '/api/uframe/media/get_display_name/'+instrument})).done(function (vocab) {
                    console.log(vocab);
                    $('#instruments-group').append('<button class="button" data-filter=".'+instrument+'" title="'+instrument+'" data-ref_des="'+instrument+'">'+vocab.vocab.long_name+'</button>');
                });
            })
        });
    },
    yearsButtonClick:function(event){
        console.log('yearsButtonClick');
        event.preventDefault();

        let self = this;

        // Clicked on a year
        // Go get the months
        let $button = $( event.currentTarget );
        let selectedYear = $button.attr('title');
        let ref_des = $button.attr('data-ref_des');

        $('.element-item').remove();
        $('#days-group').empty();

        // Populate the months
        self.collectionMonths.reset();
        $.when(self.collectionMonths.fetch({url: '/api/uframe/media/'+ref_des+'/da/'+selectedYear}).done(function (data) {
            console.log('months');
            console.log(data);

            $('#months-group').empty();
            //$('#instruments-group').append('<button class="button is-checked" data-filter="*">Choose Instrument</button>');
            $.each(data.months, function(key, month){
                $('#months-group').append('<button class="button" data-filter=".'+month+'" title="'+month+'" data-ref_des="'+ref_des+'">'+month+'</button>');
            })
        }))
    },
    monthsButtonClick:function(event){
        console.log('monthsButtonClick');
        //event.preventDefault();

        let self = this;

        // Clicked on a year
        // Go get the months
        let $button = $( event.currentTarget );
        let selectedMonth = $button.attr('title');
        let ref_des = $button.attr('data-ref_des');

        $('.element-item').remove();

        // Fetch the thumbnails and re-render
        self.collectionDataBounds.reset();
        $.when(self.collectionDataBounds.fetch({url: '/api/uframe/media/get_data_bounds/'+ref_des})).done(function(data){
            let first_date = data.bounds['first_date'];
            let last_date = data.bounds['last_date'];

            let chosenYear = $('#years-group .is-checked')[0].title;
            let chosenMonth = ("0" + $('#months-group .is-checked')[0].title).slice(-2);

            $.when(self.collectionDays.fetch({url: '/api/uframe/media/'+ref_des+'/da/'+chosenYear+'/'+chosenMonth})).done(function (days) {
                let firstDay = ("0" + days.days[0]).slice(-2);
                let lastDay = ("0" + days.days.slice(-1)[0]).slice(-2);
                first_date = [chosenYear, chosenMonth, firstDay].join("-");
                last_date = [chosenYear, chosenMonth, lastDay].join("-");

                $.when(self.collection.fetch({url: '/api/uframe/media/'+ref_des+'/range/'+first_date+'/'+last_date})).done(function(data){
                    console.log(data);
                    self.render({'first_time': false})
                });
            });
        });
    },
    filterButtonClick:function(event){
        console.log('filterButtonClick');
        event.preventDefault();

        let self = this;

        //var filterValue = $( this ).attr('data-filter');
        // use filterFn if matches value
        //filterValue = filterFns[ filterValue ] || filterValue;

        var $button = $( event.currentTarget );
        // get group key
        var $buttonGroup = $button.parents('.button-group');
        var filterGroup = $buttonGroup.attr('data-filter-group');
        // set filter for group
        self.filters[ filterGroup ] = $button.attr('data-filter');
        //console.log('filters');
        //console.log(filters);
        // combine filters
        var filterValue = self.concatValues( self.filters );
        while(filterValue.includes("**"))
            filterValue = filterValue.replace("**", "*");
        //console.log('filterValue');
        //console.log(filterValue);

        $thumbnailgrid.isotope({ filter: filterValue });
    },
    // Clicked on the Instrument
    clickInstrumentsGroup:function(event){
        console.log('clickInstrumentsGroup');
        event.preventDefault();

        let self = this;

        let $button = $( event.currentTarget );
        let instrumentGroup = $button.attr('title');

        $('.element-item').remove();
        $('#months-group').empty();
        $('#days-group').empty();

        self.collectionMap.reset();
        $.when(self.collectionMap.fetch({url: '/api/uframe/media/'+instrumentGroup+'/da/map'})).done(function(data){
            console.log(data);
            self.daMap = data;
            $('#years-group').empty();
            //$('#years-group').append('<button class="button" data-filter="*" title="*">All Years</button>');

            $.each(data.map, function(year, months){
                $('#years-group').append('<button class="button" data-filter=".'+year+'" title="'+year+'" data-ref_des="'+instrumentGroup+'">'+year+'</button>');
            });
        });
    },
    add:function(subview){
        this.$el.find('.thumbnail-grid').append(subview.el);
    },
    render: function(options) {
        console.log('render');
        console.log(options);
        let self = this;
        this.$el.html(this.template(options));

        if(options['first_time']){
            // init Isotope
            self.$thumbnailgrid = $('.thumbnail-grid').isotope({
                itemSelector: '.element-item',
                layoutMode: 'packery',
                getSortData: {
                    name: '.name',
                    symbol: '.symbol',
                    number: '.number parseInt',
                    category: '[data-category]',
                    weight: function (itemElem) {
                        var weight = $(itemElem).find('.weight').text();
                        return parseFloat(weight.replace(/[\(\)]/g, ''));
                    },
                    year: '.year parseInt'
                }
            });

            // filter functions
            var filterFns = {
                // show if number is greater than 50
                numberGreaterThan50: function () {
                    var number = $(this).find('.number').text();
                    return parseInt(number, 10) > 50;
                },
                // show if name ends with -ium
                ium: function () {
                    var name = $(this).find('.name').text();
                    return name.match(/ium$/);
                },
                byYear: function () {
                    var year = $(this).find('.year').text();
                    console.log(year)
                    return parseInt(year, 10) === 2019;
                }
            };

            // Clicked on the instrument type
            $('[id^=instrument-types]').on('click','.checkmark', function(event){
               self.instrumentTypeSelection(event)
            });

            // Clicked on the instrument
            $('[id^=instruments-group]').on('click','.button', function(event){
               self.clickInstrumentsGroup(event)
            });

            $('[id^=years-group]').on('click','.button', function(event){
               self.yearsButtonClick(event)
            });

            $('[id^=months-group]').on('click','.button', function(event){
               self.monthsButtonClick(event)
            });

            // change is-checked class on buttons
            $('.button-group').each( function( i, buttonGroup ) {
                var $buttonGroup = $( buttonGroup );
                $buttonGroup.on( 'click', 'button', function() {
                    $buttonGroup.find('.is-checked').removeClass('is-checked');
                    $( this ).addClass('is-checked');
                });
                //$buttonGroup.find('.is-checked').click();
            });
        } else {
            if(this.collection.length > 0) {
                // Loop through the media and add to the image gallery
                this.collection.each(function (model) {
                    let subview = new CamImageItemView2({
                        model: model
                    });
                    // subview.setElement($('#cam-image-grid'));
                    self.add(subview);
                });
            }
        }
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
