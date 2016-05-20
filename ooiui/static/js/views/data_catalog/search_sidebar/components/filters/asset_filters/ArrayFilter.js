/*
 * Created by M@Campbell
 *
 * Review methods in FilterParentView
 */


var ArrayFilterView = FilterParentView.extend({
    events: {
        'change [type="checkbox"]': '_arrayChecked',
    },
    _arrayChecked: function(event) {
        event.preventDefault();
        var target = $(event.target);
        if (this.indexOfFilters(target.val()) === -1) {
            this.addToFilters(target.val());
            this.collection.fetch({data: {search: this.getFilters()}});
        } else {
            this.removeFromFilters(target.val());
            this.collection.fetch({data: {search: this.getFilters()}});
        }
    },
    onAfterRender: function() {
        var initialFilter = vobj.hash;

        if (initialFilter.length > 0) {
            var arrayCode = initialFilter.substr(0,2);
            var selector = '[value="'+arrayCode+'"]';
            $(selector).prop('checked', true);
            this.addToFilters(arrayCode);
        }
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/asset_filters/ArrayFilter.html']
});
