// Parent class for asset views.
var ParentAssetView = Backbone.View.extend({
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
        // setup some fields once the modal renders

        return this;
    }

});

//Container for the list of all assets.
var AssetsTableView = ParentAssetView.extend({
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
        var assetEditorModal = new AssetEditorModalView({ model:this.model });
        $(assetEditorModal.render().el).appendTo('#assetEditorModal');
        return this;
    }
});

//Asset event detail view.
var AssetEventsTableView = ParentAssetView.extend({
    template: JST['ooiui/static/js/partials/AssetEventsTable.html'],
    initialize: function() {
        this.listenToOnce(vent, 'asset:derender', function(model) {
            this.derender();
        });
    }
});

//Asset Attachments View (nuxeo).
var AssetAttachmentsTableView = ParentAssetView.extend({
    template: JST['ooiui/static/js/partials/AssetAttachmentsTable.html'],
    initialize: function() {
        this.listenToOnce(vent, 'asset:derender', function(model) {
            this.derender();
        });
    },
});

//Asset creator modal view
var AssetCreatorModalView = ParentAssetView.extend({
    template: JST['ooiui/static/js/partials/AssetCreatorModal.html'],
    initialize: function() {
        _.bindAll(this, 'save', 'cancel', 'setupFields');

    },
    events: {
        "click button#cancel" : "cancel",
        "click button#save" : "save"
    },
    setupFields: function() {
        this.$el.find('#assetLaunchDate').datepicker();
    },
    save: function() {

        var assetInfo = {};
        assetInfo.name = this.$el.find('#assetName').val();
        assetInfo.owner = this.$el.find('#assetOwner').val();
        assetInfo.description = this.$el.find('#assetDescription').val();
        assetInfo.type = this.$el.find('#assetType').val();

        var manufactureInfo = {};
        manufactureInfo.manufacturer = this.$el.find('#assetManufacturer').val();
        manufactureInfo.modelNumber = this.$el.find('#assetModelNumber').val();
        manufactureInfo.serialNumber = this.$el.find('#assetSerialNumber').val();

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

        var newAsset = new AssetModel({});
        newAsset.set('assetInfo', assetInfo);
        newAsset.set('asset_class', this.$el.find('#assetClass').val());
        newAsset.set('manufactureInfo', manufactureInfo);
        newAsset.set('notes', [ this.$el.find('#assetNotes').val() ]);
        newAsset.set('purchaseAndDeliveryInfo', this.$el.find('#assetPurchaseAndDeliveryInfo').val());
        newAsset.set('metaData', metaData);
        newAsset.set('classCode', this.$el.find('#assetClassCode').val());
        newAsset.set('seriesClassification', this.$el.find('#assetSeriesClassification').val());
        console.log(newAsset);
        newAsset.save({
            success: function(){
            }
        });

        vent.trigger('asset:changeCollection');
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
    template: JST['ooiui/static/js/partials/AssetEditorModal.html'],
    initialize: function() {
        _.bindAll(this, 'cancel', 'submit', 'destroy');
    },
    events: {
        "click button#cancelEdit" : "cancel",
        "click button#saveEdit" : "submit",
        "click button#delete" : "destroy"
    },
    submit: function() {
        var assetInfo = this.model.get('assetInfo');
        assetInfo.name = this.$el.find('#assetName').val();
        assetInfo.owner = this.$el.find('#assetOwner').val(),
        assetInfo.description = this.$el.find('#assetDescription').val();
        assetInfo.type = this.$el.find('#assetType').val();

        this.model.set('notes', [ this.$el.find('#assetNotes').val() ]);
        this.model.set('asset_class', this.$el.find('#assetClass').val());
        this.model.set('classCode', this.$el.find('#assetClassCode').val());
        this.model.set('assetInfo', assetInfo);
        this.model.save({
            success: function(){
                this.model.fetch();
            }
        });
        vent.trigger('asset:modelChange', this.model);
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
// time conversions
function isoToDateTime( strInput ) {
    var temp = (String(strInput).search('Z') > 1) ? String(strInput).split('Z') : false;
    var returnDate = (true) ? new Date(Date.parse(temp[0])) : new Date(temp);
    return returnDate;
}
function dateTimeToISO( strInput ) {
    var temp = Date.parse(strInput);
    var parseDate = new Date(temp);
    var isoDateReturn = parseDate.toISOString();
    return isoDateReturn;
}
