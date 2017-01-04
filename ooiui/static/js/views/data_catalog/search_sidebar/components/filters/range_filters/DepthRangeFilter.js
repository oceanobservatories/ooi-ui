/*
 * Created by M@Campbell
 *
 * Review methods in FilterParentView
 */

var DepthRangeFilterView = FilterParentView.extend({
  onAfterRender: function() {
    var _this = this;
    var depthRangeBounds = {};
    depthRangeBounds.min = -10;
    depthRangeBounds.max = 4500;

    $('#manualDepthRangeMin').val(depthRangeBounds.min);
    $('#manualDepthRangeMax').val(depthRangeBounds.max);
    $('#manualDepthRangeMin').prop('min', depthRangeBounds.min);
    $('#manualDepthRangeMax').prop('max', depthRangeBounds.max);

    $('#depth-slider').rangeSlider({
      bounds: depthRangeBounds,
      min: depthRangeBounds.min,
      max: depthRangeBounds.max,
      defaultValues: depthRangeBounds,
      step: 1
    }).bind('userValuesChanged', function(event, data) {
      var startDepth = data.values.min.valueOf(),
        endDepth = data.values.max.valueOf();
      // console.log('startDeoth');
      // console.log(startDepth);
      // console.log('endDepth');
      // console.log(endDepth);

      $('#manualDepthRangeMin').val(startDepth);
      $('#manualDepthRangeMax').val(endDepth);
      _this.setDepthRange(startDepth, endDepth);

      ooi.trigger('DepthRangeFilterView:change', _this.getDepthRange());
    });

    $('#depth-slider').rangeSlider().bind('valuesChanged',  function(event, data) {
      var startDepth = data.values.min.valueOf(),
        endDepth = data.values.max.valueOf();
      _this.setDepthRange(startDepth, endDepth);

      ooi.trigger('DepthRangeFilterView:change', _this.getDepthRange());
    });

    $('#manualDepthRangeMin').on('mouseout change focusout', function(event){
      // console.log('min change');
      // console.log(event);
      // console.log($('#manualDepthRangeMin').val());
      // console.log($('#depth-slider').rangeSlider('min'));
      // console.log($('#depth-slider').rangeSlider('max'));

      $('#depth-slider').rangeSlider('min', $('#manualDepthRangeMin').val());
      $('#depth-slider').rangeSlider('max', $('#depth-slider').rangeSlider('max'));
    });

    $('#manualDepthRangeMax').on('mouseout change focusout', function(event){
      // console.log('max change');
      // console.log(event);
      // console.log($('#depth-slider').rangeSlider('min'));
      // console.log($('#depth-slider').rangeSlider('max'));
      // console.log($('#depth-slider').rangeSlider('min'));
      // console.log($('#manualDepthRangeMax').val());

      $('#depth-slider').rangeSlider('min', $('#depth-slider').rangeSlider('min'));
      $('#depth-slider').rangeSlider('max', $('#manualDepthRangeMax').val());
    });

  },
  template: JST['ooiui/static/js/partials/data_catalog/search_sidebar/components/filters/range_filters/DepthRangeFilter.html']
});
