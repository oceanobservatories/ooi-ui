//Container for the list of all assets.
var AssetsTableView = Backbone.View.extend({
    tagName: 'tbody',
	initialize: function() {
		_.bindAll(this,"render");
		this.render();
	},
    render: function() {
        var assetsRowSubView = this.collection.map(function(model) {
            return (new AssetsRowSubView({ model:model })).render().el;
        });
        this.$el.html(assetsRowSubView);
        return this;
    }
});

//Asset item subview, as a table row.
var AssetsRowSubView = Backbone.View.extend({
    tagName: 'tr',
    template: "<td><%= assetId %></td><td><%= assetInfo.name  %></td><td><%= assetInfo.type %></td><td><%= ref_des  %></td><td><%= assetInfo.owner %></td><td><%= isoToDateTime(launch_date_time) %></td>",
    render: function() {
        var tmpl = _.template(this.template);
        this.$el.html(tmpl(this.model.toJSON()));
        return this;
    }
});

//Asset inspector window; intended to be a modal.
var AssetInspectorView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this,"render");
        this.render();
    },
    render: function() {}
});

//Asset detail subview.
var AssetDetailSubView = Backbone.View.extend({
    el: 'tbody',
    initialize: function() {},
    template: _.template(" {%= wtf.quick_form %}" ),
    render: function() {}
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
