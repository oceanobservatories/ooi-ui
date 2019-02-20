var InstrumentFilterView = FilterParentView.extend({
    events: {
        'change [type="checkbox"]': '_instrumentChecked'
    },
    _instrumentChecked: function(event) {
        // When an array checkbox is selected perform actions on the
        // filters and re fetch the collection in order for subscribers
        // of the collection to be notified.
        var target = $(event.target);

        if (this.indexOfInstrumentFilters(target.val()) === -1) {
            this.addToInstrumentFilters(target.val());
        } else {
            this.removeFromInstrumentFilters(target.val());
        }
        this.resetCollection();

        // This bypasses the data as an interface
        // and simply returns the current state of the filters to
        // what ever is listening.
        ooi.trigger('InstrumentFilterView:addToInstrumentFilters', this.getInstrumentFilters());


        //TODO: @OCEANZUS, try this out, it contains ALL the filters as the following object:
        //  { strings: ['CE', 'CTDPFJ'], timeRange: {min: 123123, max: 123123} }
        //
        //  ooi.trigger('Filters:getFilters', this.getFilters());
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/asset_filters/InstrumentFilter.html']
});
