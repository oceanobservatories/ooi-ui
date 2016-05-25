var RangeFilterView = FilterParentView.extend({
    onAfterRender: function() {
        this.renderTimeRangeFilter();
    },
    renderTimeRangeFilter: function() {
        var timeRangeFilterView = new TimeRangeFilterView({el: '#timeRangeFilter', collection: this.collection});
        this.$el.find('#timeRangeFilter').append(timeRangeFilterView.render().el);
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/RangeFilters.html']
});
