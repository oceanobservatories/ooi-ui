var SearchSidebarView = DataCatalogParentView.extend({
    renderSearchInput: function() {
        var searchInputView = new SearchInputView({
            el: this.$el.find('#searchInput'),
            collection: this.collection
        });
        searchInputView.render();
    },
    renderFilterInput: function(options) {
        var _self = this;

        var filterInputView = new FilterInputView({
            el: this.$el.find('#filterInput'),
            collection: this.collection
        });
        filterInputView.render();
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/SearchSidebar.html']
});
