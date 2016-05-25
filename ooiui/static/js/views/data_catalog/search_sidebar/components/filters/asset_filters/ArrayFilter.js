/*
 * Created by M@Campbell
 *
 * Review methods in FilterParentView
 */


var ArrayFilterView = FilterParentView.extend({
    events: {
        'change [type="checkbox"]': '_arrayChecked'
    },
    _arrayChecked: function(event) {
        // When an array checkbox is selected perform actions on the
        // filters and re fetch the collection in order for subscribers
        // of the collection to be notified.
        var target = $(event.target),
            timeRange = this.getTimeRange();


        if (this.indexOfFilters(target.val()) === -1) {
            this.addToFilters(target.val());
            //this.collection.fetch({data: {search: this.getFilters(), startDate: timeRange.min, endDate: timeRange.max}});
        } else {
            this.removeFromFilters(target.val());
            //this.collection.fetch({data: {search: this.getFilters(), startDate: timeRange.min, endDate: timeRange.max}});
        }

        // This bypasses the data as an interface
        // and simply returns the current state of the filters to
        // what ever is listening.
        ooi.trigger('ArrayFilterView:addToFilters', this.getFilters());
    },
    onAfterRender: function() {
        // We just want to get the location hash in case
        // there was some initial filtering done on another page.
        var initialFilter = vobj.hash || location.hash;

        if (initialFilter.length > 0) {
            var arrayCode = initialFilter.substr(0,2);
            var selector = '[value="'+arrayCode+'"]';
            $(selector).prop('checked', true);
            this.addToFilters(arrayCode);
        }

        // This bypasses the data as an interface
        // and simply returns the current state of the filters to
        // what ever is listening.
        ooi.trigger('ArrayFilterView:addToFilters', this.getFilters());
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/asset_filters/ArrayFilter.html']
});
