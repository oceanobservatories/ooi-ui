"use strict";
// Parent class for asset views.
var ParentView = Backbone.View.extend({
    /* Parent class for the asset views.
     *  - initialize()
     *  - render()
     *  - derender()
     */
    initialize: function() {
        _.bindAll(this, 'render', 'derender');
    },
    render: function() {
        if (this.model) { this.$el.html(this.template(this.model.toJSON())); } else { this.$el.html(this.template()); }
        return this;
    },
    derender: function() {
        this.remove();
        this.unbind();
        if (this.model)
            this.model.off();
    }
});

var ParentAssetModalView = ParentView.extend({
    initialize: function() {
        _.bindAll(this, 'save', 'addMetaData', 'loadControls', 'getFields');
    },
    loadControls: function() {
    },
    render: function() {
        if (this.model) { this.$el.html(this.template(this.model.toJSON())); } else { this.$el.html(this.template()); }
        this.metaData = [];
        this.metaDataCount = 0;
        this.metaItemList = [['assetRefDes', 'Reference Designator'], ['cruiseNumber', 'Cruise Number'], ['anchorLaunchTime', 'Anchor Launch Time'],
            ['anchorLaunchDate', 'Anchor Launch Date'], ['assetLat', 'Latitude'], ['assetLon', 'Longitude'],
            ['deploymentNum', 'Deployment Number'], ['waterDepth', 'Water Depth'], ['assetWeight', 'Weight'],
            ['assetLength', 'Length'], ['assetHeight', 'Height'], ['assetWidth', 'Width'], ['assetVoltage', 'Voltage'],
            ['assetWatts', 'Watts'], ['firmwareVer', 'Firmware Version'], ['storageLoc', 'Storage Location'],
            ['docURL', 'Document URL'], ['ooiDocs', 'OOI Document No.'], ['assetNotes', 'Notes'], ['assetDOI', 'DOI'],
            ['ooiPartNum', 'OOI Part No.'], ['ooiPropNum', 'OOI Property No.'], ['instPropNum', 'Institution Property No.'],
            ['platType', 'Platform Type'], ['poNum', 'Institution PO No.'], ['delOrderNum', 'Delivery Order No.'],
            ['softwareVer', 'Software Version No.'],['shelfLife', 'Shelf Life Expiration'], ['ooiSerNum', 'OOI Serial No.']
        ];
        return this;
    },
    addMetaData: function() {
        var metaItems = [];
        $.each(this.metaItemList, function(index, item) {
            metaItems.push('<div class="col-md-6 meta-input">' +
                '<label class="col-md-5 meta-key">'+item[1]+'</label>' +
                '<div class="col-md-7">' +
                '<input id="'+item[0]+'" class="meta-val form-control" type="text" placeholder="Value" for="'+item[1]+'">' +
                '</div>' +
            '</div>');
        });
        $('#metaDataList').append(metaItems.join(""));
    },
    //Get the values of all of the input fields and return an object representing the data.
    getFields: function(){
        var fields = {},
            inputs = this.$el.find('input'),
            selectInputs = this.$el.find('select'),
            i, input, select;

        for (i = 0, input; i < inputs.length; i++){
            input = $(inputs[i]);
            fields[input.attr('id')] = input.val();
        }

        for (i = 0, select; i < selectInputs.length; i++){
            select = $(selectInputs[i]);
            fields[select.attr('id')] = select.val();
        }

        return fields;
    },
    save: function(e) {
        e.stopImmediatePropagation();
        //TODO: make sure that this gets validated.
        var fields = this.getFields();
        // Create the new asset model that will be saved to the collection,
        // and posted to the server.
        this.model.set('asset_class', '.AssetRecord');
        this.model.set('assetInfo', {
            type: fields.assetType,
            owner: fields.assetOwner,
            description: fields.assetDescription,
            instrumentClass: fields.assetInstrumentClass
        });
        this.model.set('manufactureInfo', {
            serialNumber: fields.serialNumber,
            manufacturer: fields.manufacturer,
            modelNumber: fields.modelNumber
        });
        var metaItems = this.$el.find('.meta-input input');
        for (var i=0; i < metaItems.length; i++) {
            var metaKey = $(metaItems[i]).attr('for'),
                metaVal = $(metaItems[i]).val();
            this.metaData.push({
                "key": metaKey,
                "value": metaVal,
                "type": "java.lang.String"
            });
        }
        this.model.set('metaData', this.metaData);

        var isValid = this.model.isValid(true);
        if (isValid){
            this.model.save(null, {
                success: function(model, response){
                    alert('Success!');
                    vent.trigger('asset:changeCollection');
                },
                error: function(model, error) {
                    alert("Sorry, there was an unexpected error: " + error.responseJSON.statusCode + " - " + error.responseJSON.message);
                    vent.trigger('asset:changeCollection');
                }
            });
            this.cleanUp();
            this.model.off();
        } else {
            alert('Please fill in all fields');
            var missingFields = this.$el.find('input');
                missingFields.push(this.$el.find('select'));

            $.each(missingFields, function(index, item) {
                if ($(missingFields[index]).val() === "") {
                    $(missingFields[index]).closest('.row').addClass('has-error');
                } else {

                    $(missingFields[index]).closest('.row').removeClass('has-error');
                }
            });
        }
    },
});

//Header for the asset table.
var AssetTableHeaderView = ParentView.extend({
    /* This will render the search field, pagination boxes,
     * and the 'create asset' link button.
     * - initialize()
     * - createAsset()
     */
    template: JST['ooiui/static/js/partials/AssetTableHeader.html'],
    initialize: function() {
        _.bindAll(this, 'createAsset','exportAssets');
    },
    events: {
        "click #assetCreatorBtn" : "createAsset",
        "click #assetExportBtn" : "exportAssets",
    },
    exportAssets:function(e){
    },
    updateAssetExport:function(search){
        var url = '/api/asset_deployment?search='+search+'&sort=id&export=json';
        this.$el.find('#assetExportBtn').attr("href", url);
    },
    createAsset: function() {
        var assetModel = new AssetModel();
        var assetCreatorModal = new AssetCreatorModalView({ model: assetModel });
        $(assetCreatorModal.render().el).appendTo('#assetCreatorModal');
        assetCreatorModal.setupFields();
        assetCreatorModal.loadControls();
        assetCreatorModal.addMetaData();
        return this;
    }

});

//Container for the list of all assets.
var AssetsTableView = ParentView.extend({
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
var AssetsTableRowView = ParentView.extend({
    /* Each asset is itemized in it's own row for display.
     * - initialize()
     * - renderSubViews()
     */
    tagName: 'tr',
    attributes: function(){
        return {
            'style': 'cursor:pointer'
        };
    },
    template: JST['ooiui/static/js/partials/AssetsTableRow.html'],
    initialize: function() {
        _.bindAll(this, 'editAsset',  'renderSubViews');
        this.listenToOnce(vent, 'asset:tableDerender', function(model) {
            this.derender();
        });
        this.listenTo(vent, 'asset:modelChange', this.render);
    },
    events: {
        "click": "renderSubViews",
        "click .edit": "editAsset"
    },
    editAsset: function() {
        // before editing the asset, make sure it's up to date.
        this.model.fetch();
        var assetEditorModal = new AssetEditorModalView({ model:this.model });
        $(assetEditorModal.render().el).appendTo('#assetEditorModal');
        assetEditorModal.loadControls();
        assetEditorModal.addMetaData();
        assetEditorModal.populateFields();
        return this;
    },
    renderSubViews: function() {
        $('#assetDetailsPlaceholder').remove();
        vent.trigger('asset:renderSubViews', this.model);
        // this needs to be a call outside
        // the scope of this view, otherwise we have to put it in
        // strange places.
        $('#assetsTable tr').removeClass('highlight-row');

        if ( this.$el.attr('class') !== 'highlight-row' ) {
            this.$el.toggleClass('highlight-row');
        }
    }
});

//Asset inspector panel.
var AssetInspectorView = ParentView.extend({
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
        _.bindAll(this, 'loadDocs');
        this.listenToOnce(vent, 'asset:derender', function(model) {
            this.derender();
        });
        this.listenTo(vent, 'asset:modelChange', this.render);
        vent.trigger('asset:renderDocsTable', this.model);
    },
    events: {
        "click #loadDocs": "loadDocs"
    },
    loadDocs: function() {
        //vent.trigger('asset:renderDocsTable', this.model);
    }
});


//Asset creator modal view
var AssetCreatorModalView = ParentAssetModalView.extend({
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
        _.bindAll(this, 'save', 'cancel', 'setupFields');
        Backbone.Validation.bind(this);
    },
    events: {
        "click button#cancel" : "cancel",
        "click button#save" : "save"
    },
    setupFields: function() {
        this.$el.find('#assetLaunchDate').datepicker();
    },
    loadControls: function() {
        this.$el.find('.modal-footer').append('<button id="cancel" type="button" class="btn btn-default">Cancel</button>')
                                      .append('<button id="save" type="button" class="btn btn-primary">Save</button>');
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
var AssetEditorModalView = ParentAssetModalView.extend({
    /* This will render out a asset editor modal window.
     * Only certain fields are editable to date, noteably
     * the fields omitted are the reference designator.
     * - initialize()
     * - submit()
     * - cancel()
     * - destory() ... This will delete an asset...beware!
     * - cleanUp()
     */
    template: JST['ooiui/static/js/partials/AssetCreatorModal.html'],
    initialize: function() {
        _.bindAll(this, 'cancel', 'destroy', 'populateFields');
        Backbone.Validation.bind(this);
    },
    events: {
        "click button#cancelEdit" : "cancel",
        "click button#saveEdit" : "save",
        "click button#delete" : "destroy"
    },
    loadControls: function() {
        this.$el.find('.modal-footer').append('<button id="delete" type="button" class="btn btn-danger">Delete</button>')
                                      .append('<button id="cancelEdit" type="button" class="btn btn-default">Cancel</button>')
                                      .append('<button id="saveEdit" type="button" class="btn btn-primary">Save</button>');
    },
    populateFields: function() {

        $('#assetType').val(this.model.get('assetInfo').type);
        $('#assetOwner').val(this.model.get('assetInfo').owner);
        $('#assetDescription').val(this.model.get('assetInfo').description);
        $('#assetInstrumentClass').val(this.model.get('assetInfo').instrumentClass);

        if (this.model.get('manufactureInfo')) {
            $('#serialNumber').val(this.model.get('manufactureInfo').serialNumber);
            $('#modelNumber').val(this.model.get('manufactureInfo').modelNumber);
            $('#manufacturer').val(this.model.get('manufactureInfo').manufacturer);
        }
        $.each(this.model.get('metaData'), function(index, item) {
            $('input[for="'+item.key+'"]').val(item.value);
        });

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
        this.unbind();
    }
});
