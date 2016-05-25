var InstrumentFilterView = FilterParentView.extend({
    events: {
        'change [type="checkbox"]': '_instrumentChecked'
    },
    _instrumentChecked: function() {
        // When an array checkbox is selected perform actions on the
        // filters and re fetch the collection in order for subscribers
        // of the collection to be notified.
        var target = $(event.target),
            timeRange = this.getTimeRange();


        if (this.indexOfInstrumentFilters(target.val()) === -1) {
            this.addToInstrumentFilters(target.val());
            //this.collection.fetch({data: {search: this.getInstrumentFilters(), startDate: timeRange.min, endDate: timeRange.max}});
        } else {
            this.removeFromInstrumentFilters(target.val());
            //this.collection.fetch({data: {search: this.getInstrumentFilters(), startDate: timeRange.min, endDate: timeRange.max}});
        }

        // This bypasses the data as an interface
        // and simply returns the current state of the filters to
        // what ever is listening.
        ooi.trigger('InstrumentFilterView:addToInstrumentFilters', this.getInstrumentFilters());
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/asset_filters/InstrumentFilter.html']
});
