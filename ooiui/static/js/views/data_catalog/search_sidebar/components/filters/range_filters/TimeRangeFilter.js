/*
 * Created by M@Campbell
 *
 * Review methods in FilterParentView
 */

var TimeRangeFilterView = FilterParentView.extend({
    onAfterRender: function() {
        var _this = this;
        $.when(this.collection.fetch({data: {search: _this.getArrayFilters()}})).done(function() {
            var dateRangeBounds = {} ;

            // We're overriding the data sets min bound.
            dateRangeBounds.min = new Date('2013', '00', '01');
            // We're overriding the data sets max bound.
            dateRangeBounds.max = new Date();

            _this.setTimeRange(dateRangeBounds.min, dateRangeBounds.max);
            ooi.trigger('TimeRangeFilterView:addToTimeRange', _this.getTimeRange());

            _this.$el.find('#slider').dateRangeSlider({
                bounds: dateRangeBounds,
                defaultValues: dateRangeBounds,

            }).bind('valuesChanged', function(event, data) {
                var startDate = data.values.min.valueOf(),
                    endDate = data.values.max.valueOf();

                _this.setTimeRange(startDate, endDate);
                _this.resetCollection();

                ooi.trigger('TimeRangeFilterView:addToTimeRange', _this.getTimeRange());

                //TODO: @OCEANZUS, try this out, it contains ALL the filters as the following object:
                //  { strings: ['CE', 'CTDPFJ'], timeRange: {min: 123123, max: 123123} }
                //
                //  ooi.trigger('Filters:getFilters', _this.getFilters());
            });
        });

    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/range_filters/TimeRangeFilter.html']
});
