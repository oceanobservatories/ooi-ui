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
  plotDates : null,
  className: 'plot-view',
  events: {
  },
  hideUpdateLoading:function(o){
    var self = this;
    if ( !_.isUndefined(this.xyPlot.getChart())){
      $('#plot-controls').removeClass('wait');
      self.xyPlot.getChart().hideLoading();
    }
  },
  showUpdateLoading:function(o){
    var self = this;
    if ( !_.isUndefined(this.xyPlot.getChart())){
      $('#plot-controls').addClass('wait');
      self.xyPlot.getChart().showLoading();
    }
  },
  updateChart:function(o){
    var self = this;
    if ( !_.isUndefined(this.xyPlot.getChart()) && o.get('plotType') == 'xy' ){
      //o is a style model
      //only care about line, which should remove the scatter
      var enableMarkers = o.get('plotStyle') == 'line' ? false : true;
      var plotStyle = o.get('plotStyle') == 'both' ? 'line' : o.get('plotStyle')
      //update the markers and style
      _.each(this.xyPlot.getChart().series, function(series,i) {
        series.update({
          animation: false,
          marker: {
              enabled: enableMarkers
          },
          type: plotStyle
        }, false);
      });

      //set the axis
      _.each(this.xyPlot.getChart().xAxis, function(axis){
        axis.update({
           reversed: o.get('invertX')
        }, false);
      });

      //set the axis
      _.each(this.xyPlot.getChart().yAxis, function(axis){
        axis.update({
           reversed: o.get('invertY')
        }, false);
      });

      if (o.get('plotOrientation') == 'horizontal'){
        self.updatePlotSize('100%','400px');
      }else if (o.get('plotOrientation') == 'vertical'){
        self.updatePlotSize('50%','800px');
      }

      //find the time axis to add the events/annotations too
      var validTimeXAxis = null;
      var validTimeYAxis = null;
      var isValidTimeYAxis = false;
      var isValidTimeXAxis = false;

      _.each(this.xyPlot.getChart().xAxis,function(axis,i){
        if (axis.userOptions.title.shortName == "time"){
          //validTimeAxis = axis;
          validTimeXAxis = i;
          isValidTimeXAxis = true;
        }
      });

      _.each(this.xyPlot.getChart().yAxis,function(axis,i){
        if (axis.userOptions.title.shortName == "time"){
          //validTimeAxis = axis;
          validTimeYAxis = i;
          isValidTimeYAxis = true;
        }
      });

      var axis;
      if (isValidTimeXAxis){
        axis = self.xyPlot.getChart().xAxis[validTimeXAxis];
      }else if (isValidTimeYAxis){
        axis = self.xyPlot.getChart().yAxis[validTimeYAxis];
      }

      if (o.get('showAnnotations') && (isValidTimeYAxis || isValidTimeXAxis)){
        ooi.collections.annotations.each(function(annotation,i) {
          axis.addPlotBand({
            from: moment.utc(annotation.get('beginDT')),
            to: moment.utc(annotation.get('endDT')),
            color: '#FCFFC5',
            label: {
              text: 'Annotation ID:'+annotation.get('ui_id'), // Content of the label.
              align: 'left', // Positioning of the label.
              x: 10 // Amount of pixels the label will be repositioned according to the alignment.
            },
            id: 'plot-band-'+annotation.get('ui_id')
          });
        });
      }else{
        this.xyPlot.getChart().redraw();
        //only remove annotations
        _.each(axis.plotLinesAndBands,function(annotationBand){
          if (annotationBand.id.startsWith('plot-band-')){
            axis.removePlotBand(annotationBand.id);
          }
        });
        _.each(axis.plotLinesAndBands,function(annotationBand){
          if (annotationBand.id.startsWith('plot-band-')){
            axis.removePlotBand(annotationBand.id);
          }
        });
      }

      //add events
      if (o.get('showEvents') && (isValidTimeYAxis || isValidTimeXAxis)){
        ooi.collections.plotEventList.each(function(plotevent,i) {

          if (plotevent.get('class')=='.CalibrationEvent'){
            var bandcolor = '#CC6666';
            var linecolor = '#FF0000';
          }else if(plotevent.get('class')=='.DeploymentEvent'){
            var bandcolor = '#CCEEFF';
            var linecolor = '#0088CC';
          }else{
            var bandcolor = '#BBFF99';
            var linecolor = '#226600';
          }

          axis.addPlotBand({
            from: moment.utc(plotevent.get('start_date')).unix()*1000,
            to: moment.utc(plotevent.get('end_date')).unix()*1000,
            color: bandcolor,
            label: {
              text: 'Event ID:'+plotevent.get('id'), // Content of the label.
              align: 'left', // Positioning of the label.
              x: 10, // Amount of pixels the label will be repositioned according to the alignment.
            },
            id: 'plot-event-band-'+plotevent.get('id')
          });

          axis.addPlotLine({
            value: moment.utc(plotevent.get('start_date')).unix()*1000,
            color: linecolor,
            width: 2,
            id: 'plot-event-band-'+plotevent.get('id'),
            dashStyle: 'longdashdot'
          });

          axis.addPlotLine({
            value: moment.utc(plotevent.get('end_date')).unix()*1000,
            color: linecolor,
            width: 2,
            id: 'plot-event-band-'+plotevent.get('id'),
            dashStyle: 'longdashdot'
          });
        });
      }else{
         this.xyPlot.getChart().redraw();
         //only remove events
        _.each(axis.plotLinesAndBands,function(bandEvent){
          if (bandEvent.id.startsWith('plot-event-band-')){
            axis.removePlotBandOrLine(bandEvent.id);
          }
        });
        _.each(axis.plotLinesAndBands,function(bandEvent){
          if (bandEvent.id.startsWith('plot-event-band-')){
            axis.removePlotBandOrLine(bandEvent.id);
          }
        });
      }
      this.xyPlot.getChart().redraw();

    }else{
      //do nothing for the Image Chart
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
      this.imagePlot = new ImagePlotView();
      this.imagePlot.render(self.plotParameters, self.plotModel, self.plotDates);
      this.$el.find('#plotContainer').append(this.imagePlot.el);

    }
  }
});

