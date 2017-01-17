var StreamFilterView = FilterParentView.extend({
    onAfterRender: function() {
        this.renderStreamParameterFilter();
        this.renderStreamDeliveryFilter();
    },
    renderStreamParameterFilter: function() {
        var streamParameterFilterView = new StreamParameterFilterView({el: '#streamParameterFilter', collection: this.collection});
        this.$el.find('#streamParameterFilter').append(streamParameterFilterView.render().el);
    },

    renderStreamDeliveryFilter: function() {
        var streamDeliveryFilterView = new StreamDeliveryFilterView({el: '#streamDeliveryFilter', collection: this.collection});
        this.$el.find('#streamDeliveryFilter').append(streamDeliveryFilterView.render().el);
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/StreamFilters.html']
});
