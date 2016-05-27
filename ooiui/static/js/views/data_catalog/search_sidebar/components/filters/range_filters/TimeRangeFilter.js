/*
 * Created by M@Campbell
 *
 * Review methods in FilterParentView
 */

var TimeRangeFilterView = FilterParentView.extend({
    onAfterRender: function() {
        var _this = this;
        $.when(this.collection.fetch({data: {search: _this.getArrayFilters()}})).done(function() {
            var dateRangeBounds = _this._getDateRangeSliderBounds(_this.collection.models);

            // We're overriding the data sets min bound.
            dateRangeBounds.min = new Date('2013', '00', '01');

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
    _getDateRangeSliderBounds: function (s) {
        var temp, min, max, bounds = {};
        $.each(s, function (i, v) {
            temp = new Date(v.attributes.end);
            if (min === undefined)
                min = temp;
            else if (max === undefined) {
                if (temp > min)
                    max = temp;
                else {
                    max = min;
                    min = temp;
                }
            }
            else if (temp < min)
                min = temp;
            else if (temp > max)
                max = temp;
        });
        return {
            min : min,
            max : max
        }
    },
    template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/range_filters/TimeRangeFilter.html']
});
