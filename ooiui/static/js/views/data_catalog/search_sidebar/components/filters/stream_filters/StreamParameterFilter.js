var StreamParameterFilterView = FilterParentView.extend({
    events: {
        'change [type="checkbox"]': '_paramChecked'
    },
    _paramChecked: function(event) {
        var target = $(event.target),
            timeRange = this.getTimeRange();


        if (this.indexOfStreamFilters(target.val()) === -1) {
            this.addToStreamFilters(target.val());
            //this.collection.fetch({data: {search: this.getStreamFilters(), startDate: timeRange.min, endDate: timeRange.max}});
        } else {
            this.removeFromStreamFilters(target.val());
            //this.collection.fetch({data: {search: this.getStreamFilters(), startDate: timeRange.min, endDate: timeRange.max}});
        }

        // This bypasses the data as an interface
        // and simply returns the current state of the filters to
        // what ever is listening.
        ooi.trigger('StreamFilterView:addToStreamFilters', this.getStreamFilters());
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/stream_filters/StreamParameterFilter.html']
});
