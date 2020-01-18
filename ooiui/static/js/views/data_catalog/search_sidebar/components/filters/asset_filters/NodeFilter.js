var NodeFilterView = FilterParentView.extend({
  events: {
    'change [type="checkbox"]': '_paramChecked'
  },
  _paramChecked: function(event) {

    var target = $(event.target);

    if (this.indexOfNodeFilters(target.val()) === -1) {
      this.addToNodeFilters(target.val());
    } else {
      this.removeFromNodeFilters(target.val());
    }
    this.resetCollection();

    ooi.trigger('NodeFilterView:add', this.getNodeFilters());

  },
  template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/asset_filters/NodeFilter.html']
});
