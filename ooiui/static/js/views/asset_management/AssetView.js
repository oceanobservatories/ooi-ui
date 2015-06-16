//Container for the list of all assets.
var AssetsTableView = Backbone.View.extend({
    tagName: 'tbody',
	initialize: function() {
		_.bindAll(this,"render");
		this.render();
	},
    render: function() {
        var assetsRowSubView = this.collection.map(function(model) {
            return (new AssetsTableRowSubView({ model:model })).render().el;
        });
        this.$el.html(assetsRowSubView);
        return this;
    }
});

//Asset item subview, as a table row.
var AssetsTableRowSubView = Backbone.View.extend({
    tagName: 'tr',
    template: JST['ooiui/static/js/partials/AssetsTableRow.html'],
    initialize: function(){
        _.bindAll(this,"render", "onClick");
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    events: {
        "click" : "onClick"
    },
    onClick: function() {
        var assetInspectorForm = new AssetInspectorFormView({ model:this.model }).render().el;
        return this;
    }
});

//Asset inspector window.
var AssetInspectorFormView = Backbone.View.extend({
    el: '#assetForm',
    template: JST['ooiui/static/js/partials/AssetInspectorForm.html'],
    initialize: function() {
        _.bindAll(this,"render");
        this.render();
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

//Asset event detail subview.
var AssetEventSubView = Backbone.View.extend({
    el: 'tbody',
    initialize: function() {},
    template: _.template(" {%= wtf.quick_form %}" ),
    render: function() {}
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
