// Parent class for asset views.
var ParentAssetView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this,"render", "onClick");
        this.render();
    },
    events: {
        "click": "onClick"
    },
    onClick: function() {},
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
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
    onClick: function() {
        var assetInspectorForm = new AssetInspectorFormView({ model:this.model }).render().el;
        var assetEventTable = new AssetEventTableView({ model:this.model }).render().el;
        return this;
    }
});

//Asset inspector window.
var AssetInspectorFormView = ParentAssetView.extend({
    el: '#assetInspector',
    template: JST['ooiui/static/js/partials/AssetInspectorForm.html'],
});

//Asset event detail subview.
var AssetEventTableView = ParentAssetView.extend({
    el: '#assetEventsTable',
    template: JST['ooiui/static/js/partials/AssetEventTable.html'],
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
