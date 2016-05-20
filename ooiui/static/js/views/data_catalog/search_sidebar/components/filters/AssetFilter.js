var AssetFilterView = FilterParentView.extend({
    onAfterRender: function() {
        this.renderArrayFilter();
        //this.renderPlatformFilter();
        //this.renderNodeFilter();
        //this.renderInstrumentFilter();
    },
    renderArrayFilter: function() {
        var arrayFilterView = new ArrayFilterView({el: '#arrayFilter', collection: this.collection});
        this.$el.find('#arrayFilter').append(arrayFilterView.render().el);
    },
    renderPlatformFilter: function() {
        var platformFilterView = new PlatformFilterView({el: '#platformFilter', collection: this.collection});
        this.$el.append(platformFilterView.render().el);
    },
    renderNodeFilter: function() {
        var nodeFilterView = new NodeFilterView({el: '#nodeFilter', collection: this.collection});
        this.$el.append(nodeFilterView.render().el);
    },
    renderInstrumentFilter: function() {
        var instrumentFilterView = new InstrumentFilterView({el: '#instrumentFilter', collection: this.collection});
        this.$el.append(instrumentFilterView.render().el);
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/AssetFilters.html']
});
