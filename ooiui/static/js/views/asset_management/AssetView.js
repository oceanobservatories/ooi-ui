// Parent class for asset views.
var ParentAssetView = Backbone.View.extend({
    /* Parent class for the asset views.
     *  - initialize()
     *  - render()
     *  - derender()
     */
    initialize: function() {
        _.bindAll(this, 'render', 'derender');
    },
    render: function() {
        if (this.model) { this.$el.html(this.template(this.model.toJSON())) } else { this.$el.html(this.template())};
        return this;
    },
    derender: function() {
        this.remove();
        this.unbind();
        this.model.off;
    }
});

//Header for the asset table.
var AssetTableHeaderView = ParentAssetView.extend({
    /* This will render the search field, pagination boxes,
     * and the 'create asset' link button.
     * - initialize()
     * - createAsset()
     */
    template: JST['ooiui/static/js/partials/AssetTableHeader.html'],
    initialize: function() {
        _.bindAll(this, 'createAsset');
    },
    events: {
        "click #assetCreatorBtn" : "createAsset"
    },
    createAsset: function() {
        var assetCreatorModal = new AssetCreatorModalView();
        $(assetCreatorModal.render().el).appendTo('#assetCreatorModal');
        assetCreatorModal.setupFields();
        return this;
    }

});

//Container for the list of all assets.
var AssetsTableView = ParentAssetView.extend({
    /* This is the meat and potatoes of the page;
     * all the assets in the collection are rendered
     * out through this view.
     * - render()
     */
    tagName: 'tbody',
    render: function() {
        var assetsRowView = this.collection.map(function(model) {
            return (new AssetsTableRowView({ model:model })).render().el;
        });
        this.$el.html(assetsRowView);
        return this;
    }
});

//Asset item subview, as a table row.
var AssetsTableRowView = ParentAssetView.extend({
    /* Each asset is itemized in it's own row for display.
     * - initialize()
     * - renderSubViews()
     */
    tagName: 'tr',
    template: JST['ooiui/static/js/partials/AssetsTableRow.html'],
    initialize: function() {
        _.bindAll(this, 'renderSubViews');
        this.listenToOnce(vent, 'asset:tableDerender', function(model) {
            this.derender();
        });
        this.listenTo(vent, 'asset:modelChange', this.render);
    },
    events: {
        "click" : "renderSubViews"
    },
    renderSubViews: function() {
        $('#assetDetailsPlaceholder').remove();
        vent.trigger('asset:renderSubViews', this.model);
    }
});

//Asset inspector panel.
var AssetInspectorView = ParentAssetView.extend({
    /* This will display the details of the asset after it's row item
     * has been clicked.  It will live below the list of assets, on the left.
     * It contains 3 tabs, 'Overview', 'Meta Data', and 'Aquision Data'.
     * This view also constructs the 'Edit Asset' button, and renders own the
     * view associated.
     * - initialize()
     * - editAsset()
     */
    template: JST['ooiui/static/js/partials/AssetInspector.html'],
    initialize: function() {
        _.bindAll(this, 'editAsset');
        this.listenToOnce(vent, 'asset:derender', function(model) {
            this.derender();
        });
        this.listenTo(vent, 'asset:modelChange', this.render);
    },
    events: {
        "click #assetEditorBtn": "editAsset",
    },
    editAsset: function() {
        // before editing the asset, make sure it's up to date.
        this.model.fetch();
        var assetEditorModal = new AssetEditorModalView({ model:this.model });
        $(assetEditorModal.render().el).appendTo('#assetEditorModal');
        return this;
    }
});

//Asset event detail view.
var AssetEventsTableView = ParentAssetView.extend({
    /* This view lists out all the events associated with the asset.
     * A special note: when clicking the Calibration Event, the calibration
     * coeffcients will display.
     * - initialize()
     */
    template: JST['ooiui/static/js/partials/AssetEventsTable.html'],
    initialize: function() {
        this.listenToOnce(vent, 'asset:derender', function(model) {
            this.derender();
        });
    }
});

//Asset Attachments View (nuxeo).
var AssetAttachmentsTableView = ParentAssetView.extend({
    /* TODO: enable this to interact with the NUXEO services.
     * This will display a table list of all attachements
     * associated with this asset.
     * WORK IN PROGRESS
     */
    template: JST['ooiui/static/js/partials/AssetAttachmentsTable.html'],
    initialize: function() {
        this.listenToOnce(vent, 'asset:derender', function(model) {
            this.derender();
        });
    },
});

//Asset creator modal view
var AssetCreatorModalView = ParentAssetView.extend({
    /* Renders out a modal window, which contains a form for
     * creating a new asset.
     * TODO: create field validations for each of the inputs.
     * - initialize()
     * - setupFields() ... this is useful, if there are modifications
     *      that need to be done to the template after it's rendered.
     * - save()
     * - cancel()
     * - cleanup()
     */
    template: JST['ooiui/static/js/partials/AssetCreatorModal.html'],
    initialize: function() {
        _.bindAll(this, 'save', 'cancel', 'setupFields', 'validateFields');
    },
    events: {
        "click button#cancel" : "cancel",
        "click button#save" : "save"
    },
    setupFields: function() {
        this.$el.find('#assetLaunchDate').datepicker();
    },
    validateFields: function() {
        /* TODO:
         * 1. assetInfo: Required (all)
         *      a. name: Valid Char ( - , A-Z , a-z , 0-9 )
         *      b. owner: Valid Char ( - , A-Z , a-z , 0-9 )
         *      c. description: Valid Char ( - , A-Z , a-z , 0-9 )
         *      d. type: Selected
         * 2. manufactureInfo: Optional (all)
         *      a. manufacturer: Valid Char ( - , A-Z , a-z )
         *      b. modelNumber:  Valid Char ( - , A-Z , 0-9 )
         *      c. serialNumber:  Valid Char ( - , A-Z , 0-9)
         * 3. metaData: Required (all)
         *      a. Ref Des: Valid Char ( - , A-Z , 0-9 )
         *      b. Anchor Launch Date: Not future.
         *      c. Anchor Launch Time: 24hr format, not future.
         *      d. Latitude: Decimal Degree, DegreeMinutes, Degree Minutes Seconds
         *      e. Longitutde: Decimal Degree, DegreeMinutes, Degree Minutes Seconds
         *          - Actually map the input and return approx location
         *            below input fields (non modifiable text field).
         *      f. Water Depth: Valid Char ( m, 0-9 )
         * 4. assetClassCode: String Length, Valid Char (A-Z, 0-9)
         * 5. assetNotes: Valid Char (A-Z, a-z, 0-9, . , (comma) , - )
         * 6. purchaseAndDeliveryInfo: Valid Char (A-Z, a-z, 0-9, . , (comma) , - , $ )
         * 7. assetClass: Selected
         * 8. assetSeriesClassification: <Unknown> ... leave out for now.
         *
         * Once Complete, change 'events:'
         *  from:
         *      "click button#save" : "save"
         *  to:
         *      "click button#save" : "validate",
         *
         * Then call this.save() at the successful validation.
         */
    },
    save: function() {
        // TODO: This entire function should be called
        // on a successful form validation.  A refactor will be
        // required to implement.
        var assetInfo = {};
        assetInfo.name = this.$el.find('#assetName').val();
        assetInfo.owner = this.$el.find('#assetOwner').val();
        assetInfo.description = this.$el.find('#assetDescription').val();
        assetInfo.type = this.$el.find('#assetType').val();

        // For now, this dict isn't implemented due to issues with uframe's
        // acceptance of this data.
        var manufactureInfo = {};
        manufactureInfo.manufacturer = this.$el.find('#assetManufacturer').val();
        manufactureInfo.modelNumber = this.$el.find('#assetModelNumber').val();
        manufactureInfo.serialNumber = this.$el.find('#assetSerialNumber').val();

        // The metaData field is very loosly defined.  These are the only
        // field supported for asset creation at this time.
        var metaData = [
        {
            "key": "Ref Des",
            "value": this.$el.find('#assetRefDes').val(),
            "type": "java.lang.String"
        },
        {
            "key": "Anchor Launch Date",
            "value": this.$el.find('#assetLaunchDate').val(),
            "type": "java.lang.String"
        },
        {
            "key": "Anchor Launch Time",
            "value": this.$el.find('#assetLaunchTime').val(),
            "type": "java.lang.String"
        },
        {
            "key": "Latitude",
            "value": this.$el.find('#assetLatitude').val(),
            "type": "java.lang.String"
        },
        {
            "key": "Longitude",
            "value": this.$el.find('#assetLongitude').val(),
            "type": "java.lang.String"
        },
        {
            "key": "Water Depth",
            "value": this.$el.find('#assetDepth').val(),
            "type": "java.lang.String"
        }];

        // Create the new asset model that will be saved to the collection,
        // and posted to the server.
        var newAsset = new AssetModel({});
        newAsset.set('assetInfo', assetInfo);
        newAsset.set('asset_class', this.$el.find('#assetClass').val());
        newAsset.set('manufactureInfo', manufactureInfo);
        newAsset.set('notes', [ this.$el.find('#assetNotes').val() ]);
        newAsset.set('purchaseAndDeliveryInfo', this.$el.find('#assetPurchaseAndDeliveryInfo').val());
        newAsset.set('metaData', metaData);
        newAsset.set('classCode', this.$el.find('#assetClassCode').val());
        newAsset.set('seriesClassification', this.$el.find('#assetSeriesClassification').val());
        newAsset.save(null, {
            success: function(model, response){
                vent.trigger('asset:changeCollection');
            }
        });
        this.cleanUp();
        newAsset.off();
    },
    cancel: function() {
        this.cleanUp();
    },
    cleanUp: function() {
        $('#assetCreatorModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        this.remove();
        this.unbind();
    }
});
//Asset editor modal view.
var AssetEditorModalView = ParentAssetView.extend({
    /* This will render out a asset editor modal window.
     * Only certain fields are editable to date, noteably
     * the fields omitted are the reference designator.
     * - initialize()
     * - submit()
     * - cancel()
     * - destory() ... This will delete an asset...beware!
     * - cleanUp()
     */
    template: JST['ooiui/static/js/partials/AssetEditorModal.html'],
    initialize: function() {
        _.bindAll(this, 'cancel', 'submit', 'destroy', 'validateFields');
    },
    events: {
        "click button#cancelEdit" : "cancel",
        "click button#saveEdit" : "submit",
        "click button#delete" : "destroy"
    },
    validateFields: function() {

    },
    submit: function() {
        var assetInfo = this.model.get('assetInfo');
        assetInfo.name = this.$el.find('#assetName').val();
        assetInfo.owner = this.$el.find('#assetOwner').val(),
        assetInfo.description = this.$el.find('#assetDescription').val();
        assetInfo.type = this.$el.find('#assetType').val();

        this.model.set('assetId', this.model.get('id'));
        this.model.set('notes', [ this.$el.find('#assetNotes').val() ]);
        this.model.set('asset_class', this.$el.find('#assetClass').val());
        this.model.set('classCode', this.$el.find('#assetClassCode').val());
        this.model.set('assetInfo', assetInfo);
        this.model.save(null, {
            success: function(model, response){
                vent.trigger('asset:modelChange', model);
            },
            error: function(model, response){
            }
        });

        this.cleanUp();
    },
    cancel: function() {
        this.cleanUp();
    },
    destroy: function() {
        var youSure = confirm("Are you sure you would like to delete this asset?");
        if (youSure) {
            this.model.destroy();
            vent.trigger('asset:derender');
            vent.trigger('asset:changeCollection');
            this.cleanUp();
        }
    },
    cleanUp: function() {
        $('#assetEditorModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        this.derender();
    }
});
