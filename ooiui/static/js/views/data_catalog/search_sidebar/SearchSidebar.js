var SearchSidebarView = DataCatalogParentView.extend({
    renderSearchInput: function() {
        var searchInputView = new SearchInputView({
            el: this.$el.find('#searchInput'),
            collection: this.collection
        });
        searchInputView.render();
    },
    renderFilterInput: function(options) {
        var _this = this;

        var filterInputView = new FilterInputView({
            el: this.$el.find('#filterInput'),
            collection: this.collection
        });
        filterInputView.render();
        $('.panel-heading.js-collapse').click(function(temp1){
            console.log(temp1);
            // var $btn = $(temp1.children);
            var $btn = $(temp1.target.children[0]);
            console.log($btn);
            var isExpanded = $btn.hasClass('fa-chevron-down');
            console.log(isExpanded);

            if(isExpanded){
                $btn.removeClass('fa-chevron-down').addClass('fa-chevron-up');
            }else{
                $btn.removeClass('fa-chevron-up').addClass('fa-chevron-down');
            }

            });
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/SearchSidebar.html']
});
