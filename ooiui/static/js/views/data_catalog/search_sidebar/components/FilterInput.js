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
 */

var FilterParentView = SearchSidebarView.extend({
    filters: [],
    getFilters: function() {
        return this.filters.join(' ');
    },
    addToFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }
        this.filters.push(item);
        return this.filters;
    },
    indexOfFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }
        return this.filters.indexOf(item);
    },
    removeFromFilters: function(item) {
        if (typeof(item) !== 'string') {
            throw 'Item must be a string';
        }

        var index = this.filters.indexOf(item);
        if (index !== -1) {
            this.filters.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }
});


// Main view for the filters.
var FilterInputView = FilterParentView.extend({
    onAfterRender: function() {
        var assetFilterView = new AssetFilterView({el: '#assetFilters', collection: this.collection});
        this.$el.find('#assetFilters').append(assetFilterView.render().el);
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/FilterInput.html']
});
