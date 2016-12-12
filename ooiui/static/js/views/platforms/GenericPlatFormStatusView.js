"use strict";
/*
 * ooiui/static/js/views/platforms/GenericPlatForm.js
 * Builds a list of the arrays subsequent items
 *
 * Dependencies
 * CSS:
 * Partials:
 * - ooiui/static/js/partials/GenericPlatForm.html
 * - ooiui/static/js/partials/GenericPlatFormTable.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */


var StatusRow = Backbone.View.extend({
    tagName:'tbody',
    initialize: function(options){
        _.bindAll(this, "render");
        var self = this;
        this.render();
    },
    template: JST['ooiui/static/js/partials/GenericPlatFormStatusTable.html'],
    render: function(){
        this.$el.html(this.template({model:this.model}));
    }

});

var GenericPlatFormStatus = Backbone.View.extend({

    events: {
        'click .js-expand': '_expand',
        'click .js-toggle-eng': '_toggleEngInstruments',
        'click .js-toggle-ref-des': '_toggleRefDesLabel'
    },
    _toggleEngInstruments: function(event) {
        $('[data-eng="true"]').toggle();
    },
    _toggleRefDesLabel: function(event) {
        $('.refDesLabel').toggle();
    },
    _expand: function(event) {
        var target = $(event.target).data('target');
        $(target).slideToggle();
    },
    initialize: function(options) {
        _.bindAll(this, "render","addTableRows");
        var self = this;
        this.streamCollection = this.collection.streamCollection.sort('display_name');
        this.platformCollection = this.collection.platformCollection;
        this.platformLat = this.streamCollection.options.searchLat;
        this.platformLng = this.streamCollection.options.searchLng;
        this.platformId = this.streamCollection.options.searchId;
//
        var platforms = this.streamCollection.fetch({
            data: {order: 'reverse'},
            success:function(collection, response, options){

                // first, lets identify only unique reference designators.
                var uniqueRefDes = _.uniq(collection.pluck('reference_designator'));

                // and identify the index of the model's reference designator in
                // the list of unique items.
                var filtered = collection.filter(function (model) {
                    var index = _.indexOf(uniqueRefDes, model.get('reference_designator'));

                    // if the item DOES exist in the list, lets get into this if ...
                    if (index !== -1) {

                        // once the item is rendered on the page, remove the reference
                        // designator from the unique list, thereby preventing a duplicate
                        // instrument from showing up on the page.
                        uniqueRefDes.splice(index, 1);

                        // and return the model.
                        return model;
                    }
                });

                // I don't really like doing this here...but lets refresh the collection
                // to only what we need.
                self.streamCollection = new StreamStatusCollection(filtered);
                self.render();
            }
        });
        $.when(platforms).done(function(){
            self.addTableRows();
        });
    },

    addTableRows: function(){
        var self = this;

        this.streamCollection.comparator = "depth";
        this.streamCollection.sort();
        this.streamCollection.each(function(model){
            var row = new StatusRow({
                model : model
            });

            var tableID = model.get("reference_designator").substring(0,11);

            self.$el.find("#"+ tableID).append(row.el);

        });
    },
    template: JST['ooiui/static/js/partials/GenericPlatFormStatus.html'],
    initialRender:function(){
        this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
    },
    render: function() {
        try {
            var _this = this;
            var siteInfo = {
                site: this.streamCollection.models[0].attributes.assetInfo.site,
                refDes: this.streamCollection.models[0].attributes.ref_des.substr(0,8),
            };

            var platformList = this.streamCollection.map(function(model) {
                return  {
                    name: model.get('assembly_name'),
                    refDes: model.get('reference_designator').substr(0,11)
                };
            });

            var uniqueList = _.uniq(platformList, function(item, key, a) {
                return item.refDes;
            });

            this.$el.html(this.template({collection: uniqueList, siteInfo: siteInfo}));

            // set to 'tile' to use tile maps, set to 'vector' to use vector maps.
            // both maps require a valid geoJson as a toJSON override.
            $.when(this.platformCollection.fetch()).done(function() {
                var vectorMap = new TileMap({id: 'map', collection: _this.platformCollection, lat: _this.platformLat, lng: _this.platformLng, platformId: _this.platformId});
                vectorMap.render();
            });

            $("#loadingSpinner").hide();
        } catch (exception) {

            alert("We're sorry, this site, " + this.streamCollection.options.searchId + " doesn't appear to be communicating.  You'll be redirected back to the home page.");
            window.location = '/';
        }
    }
});
