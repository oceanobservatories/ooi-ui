/*
 * Created by M@Campbell
 *
 * Main Parent for all filters.
 *
 * @method getFilters()
 *      Return the array of filters in the FilterParentView.
 *
 * @method addToFilters(item)
 *      Add a string to the array of filters.
 *
 * @method indexOfFilters(item)
 *      Checked if the string item is in the array of filters.
 *      returns index, -1 if none.
 *
 * @method removeFromFilters(item)
 *      Removes the string item from the array of filters.
 *
 * @method getTimeRange()
 *      Return the time range object, with min and max
 *
 * @method setTimeRange(min, max)
 *      Sets the time range object, and returns the global
 *      time range.
 *
 *
 * @global filters
 * @global timeRange
 */

var filters = [];
var timeRange = {};

var FilterParentView = SearchSidebarView.extend({
    getFilters: function() {
        return filters.join(' ');
    },
    addToFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }
        filters.push(item);
        return filters;
    },
    indexOfFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }
        return filters.indexOf(item);
    },
    removeFromFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }

        var index = filters.indexOf(item);
        if (index !== -1) {
            filters.splice(index, 1);
            return true;
        } else {
            return false;
        }
    },
    getTimeRange: function() {
        if (timeRange === {}) {
            return null;
        } else {
           return timeRange;
        }
    },
    setTimeRange: function(min, max) {
        timeRange = {
            min: min.valueOf(),
            max: max.valueOf()
        }
        return timeRange;
    }
});


// Main view for the filters.
var FilterInputView = FilterParentView.extend({
    onAfterRender: function() {

        var assetFilterView = new AssetFilterView({el: '#assetFilters', collection: this.collection});
        this.$el.find('#assetFilters').append(assetFilterView.render().el);

        var rangeFilterView = new RangeFilterView({el: '#rangeFilters', collection: this.collection});
        this.$el.find('#rangeFilters').append(rangeFilterView.render().el);
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/FilterInput.html']
});
