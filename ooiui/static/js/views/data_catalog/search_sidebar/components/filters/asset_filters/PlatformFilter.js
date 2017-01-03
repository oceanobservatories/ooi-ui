var PlatformFilterView = FilterParentView.extend({
  events: {
    'change [type="checkbox"]': '_paramChecked'
  },
  _paramChecked: function(event) {
    var target = $(event.target);

    if (this.indexOfPlatformFilters(target.val()) === -1) {
      this.addToPlatformFilters(target.val());
    } else {
      this.removeFromPlatformFilters(target.val());
    }
    this.resetCollection();
    ooi.trigger('PlatformFilterView:add', this.getPlatformFilters());

  },
  template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/asset_filters/PlatformFilter.html']
});
