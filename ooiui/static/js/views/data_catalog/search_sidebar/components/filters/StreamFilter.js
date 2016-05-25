var StreamFilterView = FilterParentView.extend({
    onAfterRender: function() {
        this.renderStreamParameterFilter();
    },
    renderStreamParameterFilter: function() {
        var streamParameterFilterView = new StreamParameterFilterView({el: '#streamParameterFilter', collection: this.collection});
        this.$el.find('#streamParameterFilter').append(streamParameterFilterView.render().el);
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/StreamFilters.html']
});
