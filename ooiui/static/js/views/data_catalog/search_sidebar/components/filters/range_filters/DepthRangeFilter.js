/*
 * Created by M@Campbell
 *
 * Review methods in FilterParentView
 */

var DepthRangeFilterView = FilterParentView.extend({
    onAfterRender: function() {
        var _this = this;
        var depthRangeBounds = {};
        depthRangeBounds.min = 0;
        depthRangeBounds.max = 4000;

      $('#depth-slider').rangeSlider({
        bounds: depthRangeBounds,
        min: depthRangeBounds.min,
        max: depthRangeBounds.max,
        defaultValues: depthRangeBounds
      }).bind('userValuesChanged', function(event, data) {
        var startDepth = data.values.min.valueOf(),
          endDepth = data.values.max.valueOf();

        _this.setDepthRange(startDepth, endDepth);
        //_this.resetCollection();

        ooi.trigger('DepthRangeFilterView:change', _this.getDepthRange());
      });

    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/range_filters/DepthRangeFilter.html']
});
