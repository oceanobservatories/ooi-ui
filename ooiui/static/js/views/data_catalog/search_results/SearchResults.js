var SearchResultView = DataCatalogParentView.extend({
    renderResultsTable: function() {
        var columns = [
            {
                name: 'platform_name',
                label: 'Platform',
                cell: 'string'
            },
            {
                name: 'assembly_name',
                label: 'Node',
                cell: 'string'
            },
            {
                name: 'display_name',
                label: 'Instrument',
                cell: 'string'
            },
            {
                name: 'depth',
                label: 'Depth',
                cell: 'number'
            },
            {
                name: 'start',
                label: 'Start Time',
                cell: 'date'
            },
            {
                name: 'end',
                label: 'End Time',
                cell: 'date'
            },
            {
                name: '',
                label: 'Plot',
                cell: 'string'
            }
        ];

        var resultsTable = new Backgrid.Grid({
            columns: columns,
            collection: this.collection
        });

        this.$el.find('#table').append(resultsTable.render().el);
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_results/SearchResults.html']
});
