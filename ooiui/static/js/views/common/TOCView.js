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
        var filteredPlatforms = this.assetCollection.byClass('.AssetRecord'),
            filteredInstruments = this.assetCollection.byClass('.InstrumentAssetRecord'),
            log = [],
            arrayCode,
            assetItemView, arrayTarget,
            platformCode, platformTarget,
            assemblyCode, assemblyName, assemblyItemView;

        filteredPlatforms.map(function(model) {
            try {
                // get the array code from the reference designator
                arrayCode = model.get('ref_des').substr(0,2);
                // set the target to where this item will be inserted.
                arrayTarget = '#array_'+ arrayCode;
                if ( document.getElementById( model.get('ref_des').substring(0,8)) === null ) {
                    assetItemView = new AssetItemView({ model:model });
                    $( arrayTarget ).append( assetItemView.render().el );
                }
            } catch(e) {
                log.push("Platform with invalid reference designator:" + model.get('id'));
                console.log(e);
            }
        });

        filteredInstruments.map(function(model) {
            try {
                if ( document.getElementById(model.get('ref_des')) === null ) {
                    platformCode = model.get('ref_des').substr(0,14);
                    assemblyCode = model.get('ref_des').substr(9,5);
                    assemblyName = model.get('assetInfo').assembly || assemblyCode;
                    // set the target to where this item will be inserted.

                    if ( document.getElementById(platformCode) === null ) {
                        platformCode = model.get('ref_des').substr(0,8);
                    }
                    platformTarget = 'ul#'+platformCode;
                    if($(platformTarget+' ul#'+assemblyCode).length === 0) {
                        assemblyItemView = new AssemblyItemView({ model:model });
                        $(platformTarget).append(assemblyItemView.render().el);
                    }

                    assetItemView = new AssetItemView({ model:model });
                    $(platformTarget+' ul#'+assemblyCode).append(assetItemView.render().el);
                }
            }catch (e) {
                console.log(e);
            }
        });
    },
    renderStreams: function(e) {
        "use strict";
        if ( this.streamCollection !== undefined ) {
            var homelessStreamItem, instrumentCode, streamName, instrumentTarget, streamItemView, arrayCode, platformCode, platformTarget, assemblyCode, assemblyItemView;
            this.streamCollection.map( function(model) {
                try {
                    instrumentCode = model.get('reference_designator');
                    streamName = model.get('stream_name');
                    /* Not all streams have physical instruments, so the asset list won't
                     * render the streams.  If there are streams that have been detached
                     * from their instrument / platform, we'll need to append a 'logical'
                     * tree for the streams to live.*/
                    if ( document.getElementById(instrumentCode) === null ){
                        arrayCode = model.get('reference_designator').substring(0,2);
                        platformCode = model.get('reference_designator').substring(0,8);
                        assemblyCode = model.get('reference_designator').substr(9,5);
                        platformTarget = 'ul#' + platformCode;
                        if ( document.getElementById(platformCode) === null ) {
                            //platform
                            model.attributes.asset_class = '.AssetRecord';
                            homelessStreamItem = new HomelessStreamItemView({ model: model });
                            $.when( $('ul#array_'+arrayCode).append( homelessStreamItem.render().el ) ).done( function() {
                                if ($(platformTarget+' ul#'+assemblyCode).length === 0) {
                                    assemblyItemView = new AssemblyItemView({model: model});
                                    $(platformTarget).append(assemblyItemView.render().el);
                                }

                                //instrument
                                model.attributes.asset_class = '.InstrumentAssetRecord';
                                homelessStreamItem = new HomelessStreamItemView({ model: model });
                                $.when($(platformTarget+' ul#'+assemblyCode).append( homelessStreamItem.render().el )).done(function() {
                                    //stream
                                    instrumentTarget = 'ul#'+instrumentCode;
                                    streamItemView = new StreamItemView({ model:model });
                                    $(instrumentTarget).append(streamItemView.render().el);
                                });
                            });
                        } else {
                            if ($(platformTarget+' ul#'+assemblyCode).length === 0) {
                                assemblyItemView = new AssemblyItemView({model: model});
                                $(platformTarget).append(assemblyItemView.render().el);
                            }
                            //instrument
                            model.attributes.asset_class = '.InstrumentAssetRecord';
                            homelessStreamItem = new HomelessStreamItemView({ model: model });
                            $.when($(platformTarget+' ul#'+assemblyCode).append( homelessStreamItem.render().el )).done(function() {
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
            'class': 'array'
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
        'click label.assembly': 'onClickAssembly',
        'click label.instrument': 'onClickInstrument',
        'click label.tree-toggler': 'collapse'
    },
    initialize: function(options) {
        "use strict";
        _.bindAll(this,'render', 'onClickPlatform', 'onClickAssembly', 'onClickInstrument', 'collapse', 'update_url', 'derender');
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
            this.$el.find('.instrument').toggle();
        });
        this.listenTo(vent, 'toc:hideNodes', function() {
            this.$el.find('.node').hide();
        });
    },
    onClickPlatform: function(e) {
        "use strict";
        $(".active-toc-item").removeClass("active-toc-item");
        this.$('label:first').addClass("active-toc-item");
        ooi.trigger('toc:selectPlatform', this.model);
        this.update_url('platform');
    },
    onClickAssembly: function(e) {
        "use strict";
        $(".active-toc-item").removeClass("active-toc-item");
        this.$('label:first').addClass("active-toc-item");
        ooi.trigger('toc:selectAssembly', this.model);
        this.update_url('assembly');
    },
    onClickInstrument: function() {
        "use strict";
        $(".active-toc-item").removeClass("active-toc-item");
        this.$('label:first').addClass("active-toc-item");
        ooi.trigger('toc:selectInstrument', this.model);
        this.update_url('instrument');
    },
    update_url:function(assetType){
        "use strict";
        var ref_des = this.model.get('ref_des');
        switch (assetType) {
            case 'platform':
                ref_des = ref_des.substr(0,8);
                break;
            case 'assembly':
                ref_des = ref_des.substr(0,14);
                break;
            case 'instrument':
                break;
        }
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
    // Watch out, this is render function isn't very DRY.  It's almost completely repeated in the
    // HomelessStreamItemView, so update each accoridingly.
    render: function() {
        "use strict";
        // If the asset class is an AssetRecord, give the view an ID of the
        // first 8 characters of the Reference Designator
        var assName, platformName, platformId, label, instrumentId, instrumentName, assId;
        if (this.model.get('asset_class') === '.AssetRecord') {
            platformName = this.model.get('assetInfo').name;
            if (platformName.indexOf('Glider') > -1){
               platformName = platformName.substring(0, platformName.lastIndexOf(" "))+'s';

            }
            platformId = this.model.get('ref_des').substr(0,8);
            assId = this.model.get('ref_des').substr(9,14);
            assId = (assId.length > 0) ? '-' + assId : "";
            this.$el.attr('id', platformId);
            this.$el.attr('class', 'platform');
            // since this is an AssetRecord (platform / glider) lets assume
            // it'll need to have instruments attached to it...so create a container!
            label = (platformName === '' || platformName === null) ? platformId+assId : '<span>' + platformName + '</span> <font class="ref-des-item">' + platformId +'</font>';
            this.$el.append('<label class="platform tree-toggler nav-header">'+ label + '</label><ul id="'+ platformId +'" class="nav-list tree" style="display:none"></ul>');
        } else if(this.model.get('asset_class') == '.InstrumentAssetRecord') {
            // otherwise, if it's an InstrumentAssetRecord then give the view an ID
            // of the entire Reference Designator
            instrumentName = this.model.get('assetInfo').name;
            instrumentId = this.model.get('ref_des');
            this.$el.attr('id', instrumentId);
            this.$el.attr('class', 'instrument');
            var ref_des = this.model.get('ref_des');
            if(ref_des.indexOf('ENG') > -1 || ref_des.indexOf('0000') > -1) {
                this.$el.addClass('eng-item');
            }
            label = (instrumentName === '' || instrumentName === null) ? instrumentId : '<span>' + instrumentName + '</span><font class="ref-des-item">' + instrumentId.substr(15) + '</font>';
            this.$el.append('<label class="instrument tree-toggler nav-header">'+ label + '</label><ul id="'+ instrumentId +'" class="nav-list tree" style="display: none"></ul>');
        }
        return this;
    }
});

var HomelessStreamItemView = AssetItemView.extend({
    render: function() {
        "use strict";
        var platformId, platformName, label, instrumentId, instrumentName;
        if ( this.model.get('asset_class') === '.AssetRecord' ) {
            this.model.set('ref_des', this.model.get('ref_des'));
            platformId = this.model.get('ref_des').substr(0,8);
            this.$el.attr('id', platformId);
            platformName = this.model.get('assetInfo').site + ' ' + this.model.get('assetInfo').platform;
            if (platformName.indexOf('Glider') > -1){
               platformName = platformName.substring(0, platformName.lastIndexOf(" "))+'s';
            }
            this.$el.attr('class', 'platform detached');
            label = (platformName === '' || platformName === null) ? platformId : '<span>' + platformName + '</span><font class="ref-des-item">' + platformId.substr(0,8)+'</font>';
            this.$el.append('<label class="platform tree-toggler nav-header">'+ label + '</label>'+
                            '<ul id="'+ platformId +'" class="nav-list tree" style="display:none"></ul>');
        }
        if ( this.model.get('asset_class') === '.InstrumentAssetRecord' ) {
            instrumentId = this.model.get('ref_des');
            instrumentName = this.model.get('display_name');
            this.$el.attr('id', instrumentId);
            this.$el.attr('class', 'instrument detached');
            if(instrumentId.indexOf('ENG') > -1 || instrumentId.indexOf('0000') > -1) {
                this.$el.addClass('eng-item');
            }
            label = (instrumentName === '' || instrumentName === null) ? instrumentId : '<span>' + instrumentName + '</span><font class="ref-des-item">' + instrumentId.substr(15) + '</font>';
            this.$el.append('<label class="instrument tree-toggler nav-header">'+ label + '</label>'+
                            '<ul id="'+ instrumentId +'" class="nav-list tree" style="display: none"></ul>');
        }
        return this;
    }
});

var AssemblyItemView = AssetItemView.extend({
    render: function() {
        "use strict";
        var assemblyCode = this.model.get('ref_des').substr(9,5) || "",
            assemblyName = this.model.get('assetInfo').assembly,
            label;

        this.$el.attr('id', assemblyCode);
        this.$el.addClass('assembly')
            .addClass('node');

        if (assemblyCode.indexOf('GL') > -1) {
            this.$el.removeClass('node').addClass('glider');
        }

        label = (assemblyName === '' || assemblyName === null || assemblyName === undefined) ? assemblyCode.replace('GL', 'Glider ') : '<span>' + assemblyName + '</span><font class="ref-des-item">' + assemblyCode + '</font>';
        this.$el.append('<label class="assembly tree-toggler nav-header">'+ label +'</label>' +
                        '<ul id="'+ assemblyCode +'" class="nav-list tree" style="display: none"></ul>');
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
    template: _.template('<a href="#<%= reference_designator %>/<%= stream_name %>" title="<%= stream_name %>"><%= stream_name %></a>'),
    derender: function() {
        "use strict";
        this.remove();
        this.unbind();
        this.model.off();

    },
    render: function() {
        "use strict";
        this.$el.attr('id', this.model.get('reference_designator') + '-' + this.model.get('stream_name'));
        if(this.model.get('stream_name').indexOf('metadata') > -1) {
            this.$el.addClass('meta-data-item');
        }
        this.$el.html( this.template(this.model.toJSON()) );
        return this;
    }
});
