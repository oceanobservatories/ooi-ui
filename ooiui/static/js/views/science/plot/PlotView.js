/*
 * ooiui/static/js/views/science/plot/PlotView.js
 * View definition for the time series container
 *
 * Partials:
 *  - ooiui/static/js/partials/science/plot/plot.html
 */
var PlotView = BasePlot.extend({
  plotModel: null,
  plotParameters: null,
  plotData: new DataSeriesCollection(),
  className: 'plot-view',
  events: {
  },
  updateChart:function(o){
    var self = this;
    if ( o.get('plotType') == 'xy' ){
      //o is a style model
      //only care about line, which should remove the scatter
      var enableMarkers = o.get('plotStyle') == 'line' ? false : true;
      var plotStyle = o.get('plotStyle') == 'both' ? 'line' : o.get('plotStyle')
      //update the markers and style
      _.each(this.xyPlot.getChart().series, function(series,i) {
        series.update({
          marker: {
              enabled: enableMarkers
          },
          type: plotStyle
        });
      });

      //set the axis
      _.each(this.xyPlot.getChart().xAxis, function(axis){
        axis.update({
           reversed: o.get('invertX')
        });
      });

      //set the axis
      _.each(this.xyPlot.getChart().yAxis, function(axis){
        axis.update({
           reversed: o.get('invertY')
        });
      });

      if (o.get('plotOrientation') == 'horizontal'){
        self.updatePlotSize('100%','400px');
      }else if (o.get('plotOrientation') == 'vertical'){
        self.updatePlotSize('50%','800px');
      }

    }else{
      //derender the hightcharts plot
      if ( !_.isNull(this.xyPlot.chart) ){
        this.xyPlot.getChart().destroy();
        this.xyPlot.chart = null;
      }

    }
  },
  updatePlotSize:function(x,y){
    //updates the plot size for orientation
    $('#plot-view').width(x);
    $('#plot-view').height(y);
    this.xyPlot.getChart().reflow();
  },
  initialize: function(options) {
    this.initialRender();
  },
  render: function(plotContainer){
    var self = this;
    this.$el.html(this.template());

    if ( this.plotModel.get('plotType') == 'xy' ){
      this.xyPlot = new XYPlotView();
      this.xyPlot.render(self.plotParameters, self.plotModel, self.plotData);
    }else{
      //image plot
      //this.xyPlot = new XYPlotView();
      //this.xyPlot.render();


      /* USED TO BE
      this.views.svgplot = new SVGPlotView({
        height: 400,
        width: 500,
        el: $('#plot-view')
      });
      */

    }
  }
});

