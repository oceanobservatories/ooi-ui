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
"use strict";

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
                    var refDes = model.get('ref_des');
                    platformCode = refDes.substr(0,14);
                    assemblyCode = (refDes.indexOf('MOAS') < -1) ? refDes.substr(9,5) : refDes.substr(9,2);
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
        var self = this;
        if ( this.streamCollection !== undefined ) {
            var homelessStreamItem, instrumentCode, streamName, instrumentTarget, streamItemView, arrayCode, platformCode, platformTarget, assemblyCode, assemblyItemView;
            this.streamCollection.map( function(model) {
                try {
                    if ("showIcons" in self.streamCollection){
                        model.set('showIcons',self.streamCollection.showIcons);
                    }
                    if ("selectedStreams" in self.streamCollection){
                        //see if the model has already been selected
                        var alreadySelected = self.streamCollection.selectedStreams.where({reference_designator:model.get('reference_designator'),stream_name:model.get('stream_name')});
                        //if so set the model attribute
                        if (alreadySelected.length == 1){
                            model.set('isSelectedStream',true);
                        }
                    }
                    instrumentCode = model.get('reference_designator');
                    streamName = model.get('stream_name');
                    /* Not all streams have physical instruments, so the asset list won't
                     * render the streams.  If there are streams that have been detached
                     * from their instrument / platform, we'll need to append a 'logical'
                     * tree for the streams to live.*/
                    if ( document.getElementById(instrumentCode) === null ){
                        var refDes = model.get('reference_designator');
                        arrayCode = refDes.substring(0,2);
                        platformCode =  refDes.substring(0,8);
                        assemblyCode =  (refDes.indexOf('GL') !== -1) ? refDes.substr(9,5) : refDes.substr(9,2);
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
        this.listenTo(vent, 'toc:noKids', function() {
            // if the item doesn't have any children, grey it out.
            if ( this.$el.find('ul.tree').children().length === 0 ) {
                this.$el.addClass('no-children');
            }
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
        this.listenTo(vent, 'toc:filter', function() {
            // if the item doesn't have any children, grey it out.
            if ( this.$el.find('ul.tree').children().length === 0 ) {
                this.$el.remove();
            }
        });
        this.listenTo(vent, 'toc:showStreamingStreams', function() {
            //only shows the streaming data items in the toc
            if (this.model.get('stream_name').indexOf('streamed') == -1){
                this.$el.remove();
            }
        });
        this.listenTo(vent, 'toc:hideInstruments', function() {
            this.$el.find('.instrument').toggle();
        });
        this.listenTo(vent, 'toc:hideNoStreamingInstruments', function() {
            var selector = (this.$el.find('li.instrument'));
            _.each(selector,function(instrument){
                var results = $(instrument).find('li.row[id*="streamed"]');
                //display if for engineering streams
                if (results.length < 1 && !($(instrument).css('display') == 'none')){
                    $(instrument).trigger('toc:noKids');
                }
            });
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
                ref_des = ref_des.substr(0,11);
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
        var assName, platformName, platformId, label, instrumentId, instrumentName, assId, refDes;
        if (this.model.get('asset_class') === '.AssetRecord') {
            platformName = this.model.get('assetInfo').name;
            if (platformName.indexOf('Glider') > -1){
               platformName = platformName.substring(0, platformName.lastIndexOf(" "))+'s';

            }
            refDes = this.model.get('ref_des');
            platformId = refDes.substr(0,8);
            assId = (refDes.indexOf('GL') !== -1) ? refDes.substr(9,14) : refDes.substr(9,11);
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
            label = (instrumentName === '' || instrumentName === null) ? instrumentId : '<span>' + instrumentName + '</span><font class="ref-des-item">' + instrumentId.substr(11) + '</font>';
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
            var assetSite = this.model.get('assetInfo').site,
                assetPlatform = this.model.get('assetInfo').platform;
            platformName = ((assetSite) ? assetSite : '');
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
            label = (instrumentName === '' || instrumentName === null) ? instrumentId : '<span>' + instrumentName + '</span><font class="ref-des-item">' + instrumentId.substr(11) + '</font>';
            this.$el.append('<label class="instrument tree-toggler nav-header">'+ label + '</label>'+
                            '<ul id="'+ instrumentId +'" class="nav-list tree" style="display: none"></ul>');
        }
        return this;
    }
});

var AssemblyItemView = AssetItemView.extend({
    render: function() {
        "use strict";
        var refDes = this.model.get('ref_des');
        var assemblyCode = (refDes.indexOf('GL') !== -1) ? refDes.substr(9,5) : refDes.substr(9,2) || "",
            assemblyName = this.model.get('assetInfo').assembly || this.model.get('assembly_name') || assemblyCode,
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
    className: "row",
    events: {
        'click a': 'onClick',
        'click .toc-icon-marker': 'onMarkerClick'
    },
    initialize: function(options) {
        _.bindAll(this, 'render', 'derender', 'onClick','onMarkerClick');
        this.listenTo(vent, 'toc:denrenderItems', function() {
            this.derender();
        });
        this.listenTo(vent, 'toc:hideStreams', function() {
            this.$el.attr('style','display:none;');
        });
    },
    onMarkerClick: function(e) {
        var self = this;
        e.stopImmediatePropagation();

        var marker = self.$el.find('.toc-icon-marker')
        if (marker.hasClass('toc-icon-marker-unselected')){
            ooi.trigger('toc:addStream', { model: this.model,toc:marker });
        }else{
            ooi.trigger('toc:removeStream', { model: this.model,toc:marker });
        }
    },
    onClick: function(e) {
        $(".active-toc-item").removeClass("active-toc-item");
        e.stopImmediatePropagation();
        $(e.target).addClass("active-toc-item");
        ooi.trigger('toc:selectStream', { model: this.model });
    },
    template: _.template('<a href="#<%= reference_designator %>/<%= stream_name %>" title="<%= stream_name %>"><%= stream_name %></a>'),
    derender: function() {
        this.remove();
        this.unbind();
        this.model.off();
    },
    render: function() {
        this.$el.attr('id', this.model.get('reference_designator') + '-' + this.model.get('stream_name'));
        if(this.model.get('stream_name').indexOf('metadata') > -1) {
            this.$el.addClass('meta-data-item');
        }
        this.$el.html( this.template(this.model.toJSON()) );

        if ('showIcons' in this.model.attributes && this.model.get('showIcons') && this.model.get('stream_name').indexOf('streamed') > -1){
            //check to see if it was already selected, if so change the call
            if ('isSelectedStream' in this.model.attributes && this.model.get('isSelectedStream')){
                this.$el.append('<i class="toc-icon-marker toc-icon-marker-selected pull-left"></i>')
            }else{
                this.$el.append('<i class="toc-icon-marker toc-icon-marker-unselected pull-left"></i>')
            }
        }else{
            this.$el.append('<i style="" class="pull-left"></i>')
        }
        return this;
    }
});
