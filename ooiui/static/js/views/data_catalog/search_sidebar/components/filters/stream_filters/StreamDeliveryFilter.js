var StreamDeliveryFilterView = FilterParentView.extend({
    events: {
        'change [type="checkbox"]': '_paramChecked'
    },
    _paramChecked: function(event) {
        var target = $(event.target);

        if (this.indexOfStreamFilters(target.val()) === -1) {
            this.addToStreamFilters(target.val());
        } else {
            this.removeFromStreamFilters(target.val());
        }
        this.resetCollection();

        // This bypasses the data as an interface
        // and simply returns the current state of the filters to
        // what ever is listening.
        ooi.trigger('StreamFilterView:addToStreamDeliveryFilters', this.getStreamFilters());

        //TODO: @OCEANZUS, try this out, it contains ALL the filters as the following object:
        //  { strings: ['CE', 'CTDPFJ'], timeRange: {min: 123123, max: 123123} }
        //
        //  ooi.trigger('Filters:getFilters', this.getFilters());
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/stream_filters/StreamDeliveryFilter.html']
});