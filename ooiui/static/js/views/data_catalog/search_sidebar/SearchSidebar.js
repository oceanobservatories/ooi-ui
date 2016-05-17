var SearchSidebarView = DataCatalogParentView.extend({
    renderSearchInput: function() {
        var searchInputView = new SearchInputView({el: this.$el.find('#searchInput')});
        searchInputView.render();
    },
    renderFilterInput: function() {
        var filterInputView = new FilterInputView({el: this.$el.find('#filterInput')});
        filterInputView.render();
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/SearchSidebar.html']
});
