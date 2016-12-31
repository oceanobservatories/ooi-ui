/*
 * Created by M@Campbell
 *
 * Review methods in FilterParentView
 */

var DepthRangeFilterView = FilterParentView.extend({
    onAfterRender: function() {
        var _this = this;
        $.when(this.collection.fetch({data: {search: _this.getArrayFilters()}})).done(function() {
            var depthRangeBounds = {} ;

            // We're overriding the data sets min bound.
            depthRangeBounds.min = 0;
            // We're overriding the data sets max bound.
            depthRangeBounds.max = 10994;

            // _this.setTimeRange(dateRangeBounds.min, dateRangeBounds.max);
            // ooi.trigger('TimeRangeFilterView:addToTimeRange', _this.getTimeRange());

            $('#depth-slider').rangeSlider({
                bounds: depthRangeBounds,
                defaultValues: depthRangeBounds
            }).bind('valuesChanged', function(event, data) {
                var startDepth = data.values.min.valueOf(),
                    endDepth = data.values.max.valueOf();

                ooi.trigger('DepthRangeFilterView:change', {startDepth: startDepth, endDepth: endDepth});
            });
        });

    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/range_filters/DepthRangeFilter.html']
});
