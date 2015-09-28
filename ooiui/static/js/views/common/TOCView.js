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
        _.bindAll(this, "render", "derender", "renderArrays", "renderAssets", "renderStreams");
        this.arrayCollection = options.arrayCollection;
        this.assetCollection = options.assetCollection;
        this.streamCollection = options.streamCollection;
        this.listenTo(vent, 'toc:derenderItems', function() {
            this.derender();
        });
    },
    template: JST['ooiui/static/js/partials/TOC.html'],
    renderArrays: function(){
        "use strict";
        var arrayContainerView = this.arrayCollection.map(function(model) {
            return (new ArrayContainerView({ model:model })).render().el;
        });
        this.$el.find('ul.nav-list').append(arrayContainerView);
    },
    renderAssets: function(){
        "use strict";
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
                if ( document.getElementById( model.get('ref_des').substring(0,14)) === null ) {
                    // TODO: Remove this - only for 08/17/2015 demo: M@C
                    if ( model.get('ref_des').indexOf('-0000') < -1 ) {
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
                if ( document.getElementById(model.get('ref_des')) === null ) {
                    var platformCode = model.get('ref_des').substr(0,14);
                    // set the target to where this item will be inserted.

                    if ( document.getElementById(platformCode) === null ) {
                        platformCode = model.get('ref_des').substr(0,8);
                    }
                    var platformTarget = 'ul#'+platformCode;
                    var assetItemView = new AssetItemView({ model:model });
                    $( platformTarget ).append( assetItemView.render().el );
                }
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
        "use strict";
        if ( this.streamCollection !== undefined ) {
            this.streamCollection.map( function(model) {
                try {
                    var homelessStreamItem = '';
                    var instrumentCode = model.get('reference_designator');
                    var streamName = model.get('stream_name');
                    var instrumentTarget = '';
                    var streamItemView = '';
                    /* Not all streams have physical instruments, so the asset list won't
                     * render the streams.  If there are streams that have been detached
                     * from their instrument / platform, we'll need to append a 'logical'
                     * tree for the streams to live.*/
                    if ( document.getElementById(instrumentCode) === null ){
                        var arrayCode = model.get('reference_designator').substring(0,2);
                        var platformCode = model.get('reference_designator').substring(0,14);
                        if ( document.getElementById(platformCode) === null ) {
                            //platform
                            model.attributes.asset_class = '.AssetRecord';
                            homelessStreamItem = new HomelessStreamItemView({ model: model });
                            $.when( $('ul#array_'+arrayCode).append( homelessStreamItem.render().el ) ).done( function() {
                                //instrument
                                model.attributes.asset_class = '.InstrumentAssetRecord';
                                homelessStreamItem = new HomelessStreamItemView({ model: model });
                                $.when($('ul#'+platformCode).append( homelessStreamItem.render().el )).done(function() {
                                    //stream
                                    instrumentTarget = 'ul#'+instrumentCode;
                                    streamItemView = new StreamItemView({ model:model });
                                    $(instrumentTarget).append(streamItemView.render().el);
                                });
                            });
                        } else {
                            //instrument
                            model.attributes.asset_class = '.InstrumentAssetRecord';
                            homelessStreamItem = new HomelessStreamItemView({ model: model });
                            $.when($('ul#'+platformCode).append( homelessStreamItem.render().el )).done(function() {
                                //stream
                                instrumentTarget = 'ul#'+instrumentCode;
                                streamItemView = new StreamItemView({ model:model });
                                $(instrumentTarget).append(streamItemView.render().el);
                            });
                        }

                    } else {
                        //stream
                        instrumentTarget = 'ul#'+instrumentCode;
                        streamItemView = new StreamItemView({ model:model });
                        $(instrumentTarget).append(streamItemView.render().el);
                    }
                } catch (e) {
                    console.log(e);
                }
            });
        }
    },
    render: function(){
        "use strict";
        this.$el.html(this.template());
        this.renderArrays();
        this.$el.find('[data-toggle="tooltip"]').tooltip();
        return this;
    },
    derender: function() {
        "use strict";
        this.remove();
        this.unbind();
    },
});

var SearchResultView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function() {
        "use strict";
        _.bindAll(this, 'render', 'derender', 'onClick');
        this.listenTo(vent, 'toc:derenderItems', function() {
            this.derender();
        });

    },
    onClick: function() {
        "use strict";
        ooi.trigger('toc:selectItem', this.model);
    },
    render: function(){
        "use strict";
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
        "use strict";
        this.remove();
        this.unbind();
    },
});

var ArrayContainerView = Backbone.View.extend({
    tagName: 'li',
    attributes: function(){
        "use strict";
        return {
            'style': 'width:100%'
        };
    },
    events:{
        'click .nav-header' : 'onClick',
        'click label.tree-toggler': 'collapse'
    },
    initialize: function(options) {
        "use strict";
        _.bindAll(this, 'render', 'onClick', 'collapse');
        this.listenTo(vent, 'toc:derenderItems', function() {
            this.derender();
        });
    },
    collapse: function(e) {
        "use strict";
        e.stopImmediatePropagation();
        this.$el.children('ul.tree').toggle(300);
    },
    onClick: function(e) {
        "use strict";
                 ooi.trigger('toc:selectArray', this.model);
             },
    template: JST['ooiui/static/js/partials/ArrayItem.html'],
    render: function(){
        "use strict";
        this.$el.html( this.template(this.model.toJSON()) );
        this.$el.append('<li class="divider"></li>');
        return this;
    },
    derender: function() {
        "use strict";
        this.remove();
        this.unbind();
        this.model.off();
    },
});

var AssetItemView = Backbone.View.extend({
    tagName: 'li',
    events: {
        'click label.platform': 'onClickPlatform',
        'click label.instrument': 'onClickInstrument',
        'click label.tree-toggler': 'collapse'
    },
    initialize: function(options) {
        "use strict";
        _.bindAll(this,'render', 'onClickPlatform', 'onClickInstrument', 'collapse');
        this.listenTo(vent, 'toc:derenderItems', function() {
            this.derender();
        });
        this.listenTo(vent, 'toc:cleanUp', function() {
            // if the item doesn't have any children, grey it out.
            if ( this.$el.find('ul.tree').children().length === 0 ) {
                this.$el.addClass('no-children');
            }
        });
        this.listenTo(vent, 'toc:hideInstruments', function() {
            if(this.model.get('asset_class') == '.InstrumentAssetRecord') {
                this.$el.attr('style','display:none;');
            }
        });
    },
    onClickPlatform: function(e) {
        "use strict";
        $(".active-toc-item").removeClass("active-toc-item");
        this.$('label:first').addClass("active-toc-item");
        ooi.trigger('toc:selectPlatform', this.model);
        this.update_url();
    },
    onClickInstrument: function() {
        "use strict";
        $(".active-toc-item").removeClass("active-toc-item");
        this.$('label:first').addClass("active-toc-item");
        ooi.trigger('toc:selectInstrument', this.model);
        this.update_url();
    },
    update_url:function(){
        "use strict";
        var ref_des = this.model.get('ref_des');
        var newURL = '#'+ref_des;
        window.history.pushState(null, null, newURL);
    },
    collapse: function(e) {
        "use strict";
        e.stopImmediatePropagation();
        this.$el.children('ul.tree').toggle(300);
    },
    derender: function() {
        "use strict";
        this.remove();
        this.unbind();
        this.model.off();
    },
    render: function() {
        "use strict";
        // If the asset class is an AssetRecord, give the view an ID of the
        // first 8 characters of the Reference Designator
        var assName, platformName, platformId, label, instrumentId = '';
        if (this.model.get('asset_class') === '.AssetRecord') {
            platformName = this.model.get('assetInfo').name;
            platformId = this.model.get('ref_des').substr(0,8);
            assName = this.model.get('ref_des').substr(9,14);
            assName = (assName.length > 0) ? '-' + assName : "";
            this.$el.attr('id', platformId+assName);
            this.$el.attr('class', 'platform');
            // since this is an AssetRecord (platform / glider) lets assume
            // it'll need to have instruments attached to it...so create a container!
            label = (platformName === undefined) ? platformId+assName : '<span>' + platformName + '</span> | <font>' + platformId + assName +'</span>';
            this.$el.append('<label class="platform tree-toggler nav-header">'+ label + '</label><ul id="'+ platformId + assName +'" class="nav nav-list tree" style="display:none"></ul>');
        } else if(this.model.get('asset_class') == '.InstrumentAssetRecord') {
            // otherwise, if it's an InstrumentAssetRecord then give the view an ID
            // of the entire Reference Designator
            instrumentName = this.model.get('assetInfo').name;
            instrumentId = this.model.get('ref_des');
            this.$el.attr('id', instrumentId);
            this.$el.attr('class', 'instrument');
            label = (instrumentName === undefined) ? instrumentId : '<span>' + instrumentName + '</span><font>' + instrumentId.substr(9,27) + '</font>';
            this.$el.append('<label class="instrument tree-toggler nav-header">'+ label + '</label><ul id="'+ instrumentId +'" class="nav nav-list tree" style="display: none"></ul>');
        }
        return this;
    }
});

var HomelessStreamItemView = AssetItemView.extend({
    render: function() {
        "use strict";
        var platformId, platformName, label, instrumentId, instrumentName = '';
        if ( this.model.get('asset_class') === '.AssetRecord' ) {
            this.model.set('ref_des', this.model.get('reference_designator'));
            platformId = this.model.get('reference_designator').substr(0,14);
            this.$el.attr('id', platformId);
            platformName = this.model.get('platform_name');
            this.$el.attr('class', 'platform detached');
            label = (platformName === undefined) ? platformId : '<span>' + platformName + '</span> | <font>' + platformId.substr(0,8)+'</span>';
            this.$el.append('<label class="platform tree-toggler nav-header">'+ label + '</label><ul id="'+ platformId +'" class="nav nav-list tree" style="display:none"></ul>');
        }
        if ( this.model.get('asset_class') === '.InstrumentAssetRecord' ) {
            this.model.set('ref_des', this.model.get('reference_designator'));
            instrumentId = this.model.get('ref_des');
            instrumentName = this.model.get('display_name');
            this.$el.attr('id', instrumentId);
            this.$el.attr('class', 'instrument detached');
            label = (instrumentName === undefined) ? instrumentId : '<span>' + instrumentName + '</span><font>' + instrumentId.substr(9,27) + '</font>';
            this.$el.append('<label class="instrument tree-toggler nav-header">'+ label + '</label><ul id="'+ instrumentId +'" class="nav nav-list tree" style="display: none"></ul>');
        }
        return this;
    }
});

var StreamItemView = Backbone.View.extend({
    tagName: 'li',
    events: {
        'click a': 'onClick'
    },
    initialize: function(options) {
        "use strict";
        _.bindAll(this, 'render', 'derender', 'onClick');
        this.listenTo(vent, 'toc:denrenderItems', function() {
            this.derender();
        });
        this.listenTo(vent, 'toc:hideStreams', function() {
            this.$el.attr('style','display:none;');
        });
    },
    onClick: function(e) {
        "use strict";
        $(".active-toc-item").removeClass("active-toc-item");
        e.stopImmediatePropagation();
        $(e.target).addClass("active-toc-item");
        ooi.trigger('toc:selectStream', { model: this.model });
    },
    template: _.template('<a href="#"><%= stream_name %></a>'),
    derender: function() {
        "use strict";
        this.remove();
        this.unbind();
        this.model.off();

    },
    render: function() {
        "use strict";
        this.$el.attr('id', this.model.get('reference_designator') + '-' + this.model.get('stream_name'));
        this.$el.html( this.template(this.model.toJSON()) );
        return this;
    }
});
