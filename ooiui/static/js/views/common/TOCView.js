"use strict";
/*
 * ooiui/static/js/views/common/TOCView.js
 * View definitions to build the table of contents
 *
 * Dependencies
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 */


var TOCView = Backbone.View.extend({
    id: 'assetBrowser',
    events: {
        'keyup #search-filter' : 'filterToc'
    },
    initialize: function(options){
        _.bindAll(this, "render", "derender", "renderArrays", "renderAssets", "renderStreams", "renderHomelessStreams");
        this.arrayCollection = options.arrayCollection;
        this.assetCollection = options.assetCollection;
        this.streamCollection = options.streamCollection;
        this.listenTo(vent, 'toc:derenderItems', function() {
            this.derender();
        });
    },
    template: JST['ooiui/static/js/partials/TOC.html'],
    renderArrays: function(){
        var arrayContainerView = this.arrayCollection.map(function(model) {
            return (new ArrayContainerView({ model:model })).render().el;
        });
        this.$el.find('ul.nav-list').append(arrayContainerView);
    },
    renderAssets: function(){
        // create a model for each item in the collection, and based on it's class,
        // render it in the browser as a platform or instrument.
        var filteredPlatforms = this.assetCollection.byClass('.AssetRecord');
        var filteredInstruments = this.assetCollection.byClass('.InstrumentAssetRecord');
        var log = [];
        filteredPlatforms.map(function(model) {
            try {
                // get the array code from the reference designator
                var arrayCode = model.get('ref_des').substr(0,2);
                // set the target to where this item will be inserted.
                var arrayTarget = '#array_'+ arrayCode;
                if ( document.getElementById( model.get('ref_des').substring(0,14)) == null ) {
                    // TODO: Remove this - only for 08/17/2015 demo: M@C
                    if ( !(model.get('ref_des').indexOf('-000') > -1 ) ) {
                        var assetItemView = new AssetItemView({ model:model });
                        $( arrayTarget ).append( assetItemView.render().el );
                    }
                }
            } catch(e) {
                //log.push("Platform with invalid reference designator:" + model.get('id'));
                //console.log(e);
            }
        });

        filteredInstruments.map(function(model) {
            try {
                var platformCode = model.get('ref_des').substr(0,14);
                // set the target to where this item will be inserted.

                if ( document.getElementById(platformCode) == null ) {
                    platformCode = model.get('ref_des').substr(0,8);
                }
                var platformTarget = 'ul#'+platformCode;
                var assetItemView = new AssetItemView({ model:model });
                $( platformTarget ).append( assetItemView.render().el );
            }catch (e) {
                //log.push("Instrument with invalid reference designator:" + model.get('id'));
                //console.log(e);
            }
        });
        if (log.length > 0) {
            var errorObj = { 'TOC error' : log };
            console.log(errorObj);
        }
    },
    renderStreams: function(e) {
        if ( this.streamCollection != undefined ) {
            this.streamCollection.map( function(model) {
                try {
                    var instrumentCode = model.get('reference_designator');
                    if ( document.getElementById( instrumentCode ) == null ){
                        instrumentCode = model.get('reference_designator').substring(0,2);

                        var platformHome = model.get('reference_designator').substring(0,8);
                        if ( document.getElementById(platformHome) == null ) {
                            $('ul#array_'+instrumentCode).append('<li id="'+platformHome+'" class="platform detached">'+
                                '<label class="platform tree-toggler nav-header">'+platformHome+'</label>'+
                                '<ul id="'+platformHome+'" class="nav nav-list tree" style="display:none"></ul></li>');
                        }
                        if ( document.getElementById( instrumentCode ) == null ){
                            instrumentCode = model.get('reference_designator').substring(0,8);

                            var platformHome = model.get('reference_designator').substring(0,14);
                            if ( document.getElementById(platformHome) == null ) {
                                $('ul#array_'+instrumentCode).append('<li id="'+platformHome+'" class="platform detached">'+
                                    '<label class="platform tree-toggler nav-header">'+platformHome+'</label>'+
                                    '<ul id="'+platformHome+'" class="nav nav-list tree" style="display:none"></ul></li>');
                            }

                            if ( document.getElementById( instrumentCode ) == null ) {
                                instrumentCode = model.get('reference_designator').substring(0,14);
                                if ( document.getElementById( instrumentCode ) == null ) {
                                    // TODO: Since we've reached the end of the searchable
                                    // TODO: DOM for assets, we need to now build the tree from
                                    // TODO: the bottom up.
                                    console.log('calling all homeless');


                                    //this.renderHomelessStreams();
                                }
                            }
                        }
                    }
                    var instrumentTarget = 'ul#'+instrumentCode;

                    var streamItemView = new StreamItemView({ model:model });
                    $( instrumentTarget ).append( streamItemView.render().el );
                } catch (e) {
                    //console.log('Error: Asset does not have reference designator:'+model.get('id'));
                    //console.log(e);
                }
            });
        }
    },
    // should not be called by the controller.
    renderHomelessStreams: function() {
        console.log('no home');
    },
    render: function(){
        this.$el.html(this.template());
        this.renderArrays();
        this.$el.find('[data-toggle="tooltip"]').tooltip();
        return this;
    },
    derender: function() {
        this.remove();
        this.unbind();
    },
});

var SearchResultView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function() {
        _.bindAll(this, 'render', 'derender', 'onClick');
        this.listenTo(vent, 'toc:derenderItems', function() {
            this.derender();
        });

    },
    onClick: function() {
        ooi.trigger('toc:selectItem', this.model);
    },
    render: function(){
        var assetItemView = this.collection.map(function(model) {
            var coord = model.get('coordinates');
            if (coord) {
                return(new AssetItemView({ model:model }).render().el);
            }
        });
        this.$el.html(assetItemView);
        return this;
    },
    derender: function() {
        this.remove();
        this.unbind();
    },
});

var ArrayContainerView = Backbone.View.extend({
    tagName: 'li',
    attributes: function(){
        return {
            'style': 'width:100%'
        };
    },
    events:{
        'click .nav-header' : 'onClick',
        'click label.tree-toggler': 'collapse'
    },
    initialize: function(options) {
        _.bindAll(this, 'render', 'onClick', 'collapse');
        this.listenTo(vent, 'toc:derenderItems', function() {
            this.derender();
        });
    },
    collapse: function(e) {
        e.stopImmediatePropagation();
        this.$el.children('ul.tree').toggle(300);
    },
    onClick: function(e) {
                 ooi.trigger('toc:selectArray', this.model);
             },
    template: JST['ooiui/static/js/partials/ArrayItem.html'],
    render: function(){
        this.$el.html( this.template(this.model.toJSON()) );
        this.$el.append('<li class="divider"></li>');
        return this;
    },
    derender: function() {
        this.remove();
        this.unbind();
        this.model.off;
    },
})

var AssetItemView = Backbone.View.extend({
    tagName: 'li',
    events: {
        'click label.platform': 'onClickPlatform',
        'click label.instrument': 'onClickInstrument',
        'click label.tree-toggler': 'collapse'
    },
    initialize: function(options) {
        _.bindAll(this,'render', 'onClickPlatform', 'onClickInstrument', 'collapse');
        this.listenTo(vent, 'toc:derenderItems', function() {
            this.derender();
        });
        this.listenTo(vent, 'toc:cleanUp', function() {
            // if the item doesn't have any children, grey it out.
            if ( this.$el.find('ul.tree').children().length == 0 ) {
                this.$el.addClass('no-children');
            }
        });
    },
    onClickPlatform: function() {
        ooi.trigger('toc:selectPlatform', this.model);
    },
    onClickInstrument: function() {
        ooi.trigger('toc:selectInstrument', this.model);
    },
    collapse: function(e) {
        e.stopImmediatePropagation();
        this.$el.children('ul.tree').toggle(300);
    },
    template: _.template('<label class="tree-toggler nav-header><%= assetInfo.name %></label>'),
    derender: function() {
        this.remove();
        this.unbind();
        this.model.off;
    },
    render: function() {
        // If the asset class is an AssetRecord, give the view an ID of the
        // first 8 characters of the Reference Designator
        if (this.model.get('asset_class') == '.AssetRecord') {
            var platformName = this.model.get('assetInfo').name;
            var platformId = this.model.get('ref_des').substr(0,8);
            var assName = this.model.get('ref_des').substr(9,14);
            assName = (assName.length > 0) ? '-' + assName : "";
            this.$el.attr('id', platformId+assName);
            this.$el.attr('class', 'platform');
            this.$el.html( this.template(this.model.toJSON()) );
            // since this is an AssetRecord (platform / glider) lets assume
            // it'll need to have instruments attached to it...so create a container!
            var label = (platformName == undefined) ? platformId+assName : '<span>' + platformName + '</span> | <font>' + platformId + assName +'</span>';
            this.$el.append('<label class="platform tree-toggler nav-header">'+ label + '</label><ul id="'+ platformId + assName +'" class="nav nav-list tree" style="display:none"></ul>');
        } else if(this.model.get('asset_class') == '.InstrumentAssetRecord') {
            // otherwise, if it's an InstrumentAssetRecord then give the view an ID
            // of the entire Reference Designator
            var instrumentName = this.model.get('assetInfo').name;
            var instrumentId = this.model.get('ref_des');
            this.$el.attr('id', instrumentId);
            this.$el.attr('class', 'instrument');
            this.$el.html( this.template(this.model.toJSON()) );
            var label = (instrumentName == undefined) ? instrumentId : '<span>' + instrumentName + '</span><font>' + instrumentId.substr(9,27) + '</font>';
            this.$el.append('<label class="instrument tree-toggler nav-header">'+ label + '</label><ul id="'+ instrumentId +'" class="nav nav-list tree" style="display: none"></ul>');
        }
        return this;
    }
});

var StreamItemView = Backbone.View.extend({
    tagName: 'li',
    events: {
        'click': 'onClick'
    },
    initialize: function(options) {
        _.bindAll(this, 'render', 'derender', 'onClick');
        this.listenTo(vent, 'toc:denrenderItems', function() {
            this.derender();
        });
    },
    onClick: function(e) {
        $(".active-toc-item").removeClass("active-toc-item");
        e.stopImmediatePropagation();
        e.preventDefault();
        $(e.target).addClass("active-toc-item");

        var param_list = []
        var parameterhtml = "";
        for (var i = 0; i < this.model.get('variables').length; i++) {
            if (param_list.indexOf(this.model.get('variables')) == -1){
                var parameterId = this.model.get('parameter_id')[i];
                var units = this.model.get('units')[i];
                var variable = this.model.get('variables')[i];
                if (variable.toLowerCase() != "time"){
                    parameterhtml+= "<option pid='"+ parameterId +"' data-subtext='"+ units +"' >"+ variable +"</option>";
                    param_list.push(variable);
                }
                
            }
        }
        $.when( ooi.trigger('toc:selectStream', { model: this.model }) ).done(function() {
            $("div#yvar0-selection-default > div.form-group > select").append(parameterhtml);
            $("div#yvar1-selection > div.form-group > select").append(parameterhtml);
            $("div#yvar2-selection > div.form-group > select").append(parameterhtml);
            $("div#yvar3-selection > div.form-group > select").append(parameterhtml);
            $('#parameters_id').removeAttr('disabled');
            $('.selectpicker').selectpicker('refresh');
        });

    },
    template: _.template('<a href="#"><%= stream_name %></a>'),
    derender: function() {
        this.remove();
        this.unbind();
        this.model.off;
    },
    render: function() {
        this.$el.attr('id', this.model.get('reference_designator') + '-' + this.model.get('stream_name'));
        this.$el.html( this.template(this.model.toJSON()) );
        return this;
    }
});
