var SearchInputView = DataCatalogParentView.extend({
    events: {
        'click button[type="submit"]': '_submitSearch'
    },
    _submitSearch: function(event) {
        event.preventDefault();
        var searchForThisValue = this.$el.find('#srch-term').val();
        this.collection.fetch({data: {search: searchForThisValue}});

    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/SearchInput.html']
});
