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
        var target = $(event.target);

        if (this.indexOfArrayFilters(target.val()) === -1) {
            this.addToArrayFilters(target.val());
        } else {
            this.removeFromArrayFilters(target.val());
        }
        this.resetCollection();

        // This bypasses the data as an interface
        // and simply returns the current state of the filters to
        // what ever is listening.
        ooi.trigger('ArrayFilterView:addToFilters', this.getArrayFilters());

        //TODO: @OCEANZUS, try this out, it contains ALL the filters as the following object:
        //  { strings: ['CE', 'CTDPFJ'], timeRange: {min: 123123, max: 123123} }
        //
        //  ooi.trigger('Filters:getFilters', this.getFilters());
    },
    onAfterRender: function() {
        // We just want to get the location hash in case
        // there was some initial filtering done on another page.
        var initialFilter = vobj.hash || location.hash;

        if (initialFilter.length > 0) {
            var arrayCode = initialFilter.substr(0,2);
            var selector = '[value="'+arrayCode+'"]';
            $(selector).prop('checked', true);
            this.addToArrayFilters(arrayCode);
        }

        // This bypasses the data as an interface
        // and simply returns the current state of the filters to
        // what ever is listening.
        ooi.trigger('ArrayFilterView:addToFilters', this.getArrayFilters());


        //TODO: @OCEANZUS, try this out, it contains ALL the filters as the following object:
        //  { strings: ['CE', 'CTDPFJ'], timeRange: {min: 123123, max: 123123} }
        //
        //  ooi.trigger('Filters:getFilters', this.getFilters());
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/asset_filters/ArrayFilter.html']
});
