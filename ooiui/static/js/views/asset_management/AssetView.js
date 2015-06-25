// Parent class for asset views.
var ParentAssetView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render', 'derender');
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    derender: function() {
        this.remove();
        this.unbind();
        this.model.off;
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
        "click #assetEditorBtn": "editAsset"
    },
    editAsset: function() {
        var assetEditorModal = new AssetEditorModalView({ model:this.model });
        $(assetEditorModal.render().el).appendTo('#assetEditorModal');
        return this;
    }
});

//Asset event detail panel.
var AssetEventsTableView = ParentAssetView.extend({
    template: JST['ooiui/static/js/partials/AssetEventsTable.html'],
    initialize: function() {
        this.listenToOnce(vent, 'asset:derender', function(model) {
            this.derender();
        });
    },
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

//Asset editor modal panel.
var AssetEditorModalView = ParentAssetView.extend({
    template: JST['ooiui/static/js/partials/AssetEditorModal.html'],
    initialize: function() {
        _.bindAll(this, 'cancel', 'submit');
    },
    events: {
        "click button#cancelEdit" : "cancel",
        "click button#saveEdit" : "submit"
    },
    submit: function() {
        var attr = this.model.get('assetInfo');
        attr.name = this.$el.find('#assetName').val();
        attr.owner = this.$el.find('#assetOwner').val(),
        attr.description = this.$el.find('#assetDescription').val();

        this.model.set('assetInfo', attr);
        vent.trigger('asset:modelChange');
        this.model.save();
        this.cleanUp();
    },
    cancel: function() {
        this.cleanUp();
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
