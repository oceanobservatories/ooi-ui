/*
 * ooiui/static/js/views/science/plot/PlotView.js
 * View definition for the time series container
 *
 * Partials:
 *  - ooiui/static/js/partials/science/plot/plot.html
 */
var PlotView = BasePlot.extend({
  plotModel: {'showAnnotations': true},
  plotParameters: null,
  plotData: new DataSeriesCollection(),
  plotDates : null,
  className: 'plot-view',
  events: {
  },
  hideUpdateLoading:function(o){
    var self = this;
    if ( !_.isUndefined(this.xyPlot)){
      $('#plot-controls').removeClass('wait');
      self.xyPlot.getChart().hideLoading();
    }
  },
  showUpdateLoading:function(o){
    var self = this;
    if ( !_.isUndefined(this.xyPlot)){
      $('#plot-controls').addClass('wait');
      self.xyPlot.getChart().showLoading();
    }
  },
  updateChart:function(o){
    var self = this;
    if ( !_.isUndefined(this.xyPlot) && !_.isUndefined(this.xyPlot.getChart()) && o.get('plotType') == 'xy' ){
      //o is a style model
      //only care about line, which should remove the scatter
      var enableMarkers = o.get('plotStyle') == 'line' ? false : true;
      var plotStyle = o.get('plotStyle') == 'both' ? 'line' : o.get('plotStyle')
      //update the markers and style
      _.each(this.xyPlot.getChart().series, function(series,i) {
        if (!_.isUndefined(series.userOptions.qaqc) && series.userOptions.qaqc){
          //pass for qaqc data, we may want to do something down the road...
        }else{
          series.update({
            animation: false,
            marker: {
              radius : 3,
              enabled: enableMarkers
            },
            type: plotStyle
          }, false);
        }
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
        // Sort the annotations by end time
        ooi.collections.annotations.sortByField('endDT', 'descending');
        ooi.collections.annotations.each(function(annotation,i) {
          // Set random color to annotation band
          //console.log('annotation');
          //console.log(annotation);
          /*{
            "qcflags": {
              "Fail": "fail",
              "Not Available": "not_available",
              "Not Evaluated": "not_evaluated",
              "Not Operational": "not_operational",
              "Pass": "pass",
              "Pending Ingest": "pending_ingest",
              "Suspect": "suspect"
            }
          }*/
          var bandColors = {
            'null': ["#FFFFE0", "Null"],
            'fail': ["#CC0000", "Fail"],
            'not_evaluated': ["#4138c5", "Not Evaluated"],
            'not_available': ["#A0A0A0", "Not Available"],
            'not_operational': ["#606060", "Not Operational"],
            'pass': ["#00CC00", "Pass"],
            'pending_ingest': ["#E0E0E0", "Pending Ingest"],
            'suspect': ["#CC6600", "Suspect"]
          };
          //var bandColor = (Math.random().toString(16) + '0000000').slice(2, 8);
          var bandColor = bandColors[annotation.get('qcFlag')][0];
          var annoLabelText = "QC Flag: " + bandColors[annotation.get('qcFlag')][1] + ": " + annotation.get('annotation') + " (" + annotation.get('id') + ")";
          var fromTime = moment.utc(annotation.get('beginDT'));
          var toTime = moment.utc(annotation.get('endDT'));

          if(fromTime.isSame(toTime)){
            axis.addPlotLine({
              value: fromTime,
              color: bandColor,
              width: 2,
              borderWidth: 1,
              borderColor: '#FFFFFF',
              /*label: {
                text: annotation.get('id'), // Content of the label.
                align: 'left', // Positioning of the label.
                x: 10 // Amount of pixels the label will be repositioned according to the alignment.
              },*/
              id: 'plot-band-1',//+annotation.get('id'),
              events: {
                click: function (e) {
                  // alert(annoLabelText);
                },
                mouseover: function (e) {
                  $('#annotationInfo').html('<h5 style="font-size: 14px;float: left;padding-left: 5px; color: '+bandColor+'"><b>'+annoLabelText+'</b></h5>');
                  e.borderColor = bandColor;
                  e.borderWidth = 10;
                },
                mouseout: function (e) {
                  $('#annotationInfo').html('<h5 style="font-size: 14px;float: left;padding-left: 5px;"><b>Hover over annotation for description...</b></h5>');
                  e.borderColor = '#FFFFFF';
                  e.borderWidth = 1;
                }
              },
              zIndex: 3
            })
          }else if(!toTime.isValid()){
            axis.addPlotBand({
              from: fromTime,
              to: o.get('lastStreamTime'),
              color: bandColor,
              borderWidth: 1,
              borderColor: '#FFFFFF',
              /*label: {
                text: annotation.get('id'), // Content of the label.
                align: 'left', // Positioning of the label.
                x: 10 // Amount of pixels the label will be repositioned according to the alignment.
              },*/
              id: 'plot-band-1',//+annotation.get('id'),
              events: {
                click: function (e) {
                  // alert(annoLabelText);
                },
                mouseover: function (e) {
                  $('#annotationInfo').html('<h5 style="font-size: 14px;float: left;padding-left: 5px; color: '+bandColor+'"><b>'+annoLabelText+'</b></h5>');
                  e.borderColor = bandColor;
                  e.borderWidth = 10;
                },
                mouseout: function (e) {
                  $('#annotationInfo').html('<h5 style="font-size: 14px;float: left;padding-left: 5px;"><b>Hover over annotation for description...</b></h5>');
                  e.borderColor = '#FFFFFF';
                  e.borderWidth = 1;
                }
              },
              zIndex: 2
            });
            // console.log(axis.plotLinesAndBands);
          }else{
            axis.addPlotBand({
              from: fromTime,
              to: toTime,
              color: bandColor,
              borderWidth: 1,
              borderColor: '#FFFFFF',
              /*label: {
                text: annotation.get('id'), // Content of the label.
                align: 'left', // Positioning of the label.
                x: 10 // Amount of pixels the label will be repositioned according to the alignment.
              },*/
              id: 'plot-band-1',//+annotation.get('id'),
              events: {
                click: function (e) {
                  // alert(annoLabelText);
                },
                mouseover: function (e) {
                  $('#annotationInfo').html('<h5 style="font-size: 14px;float: left;padding-left: 5px; color: '+bandColor+'"><b>'+annoLabelText+'</b></h5>');
                  e.borderColor = bandColor;
                  e.borderWidth = 10;
                },
                mouseout: function (e) {
                  $('#annotationInfo').html('<h5 style="font-size: 14px;float: left;padding-left: 5px;"><b>Hover over annotation for description...</b></h5>');
                  e.borderColor = '#FFFFFF';
                  e.borderWidth = 1;
                }
              },
              zIndex: 1
            });
          }

        });
      }else{
        //this.xyPlot.getChart().redraw();
        //only remove annotations
        if (!_.isUndefined(axis)){
          axis.removePlotBand('plot-band-1');
          /*console.log('starting to remove annotations');
          _.each(axis.plotLinesAndBands, function(index, annotationBand){
            console.log('inside loop');
            console.log(axis.plotLinesAndBands);
            console.log(annotationBand);
            if (!_.isUndefined(annotationBand)){
              if (annotationBand.id.startsWith('plot-band-')){
                axis.removePlotBandOrLine(annotationBand);
              }
            }
          });*/
        }
      }
      this.xyPlot.getChart().redraw();

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
              x: 10 // Amount of pixels the label will be repositioned according to the alignment.
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
        if (!_.isUndefined(axis)){
          _.each(axis.plotLinesAndBands,function(bandEvent){
            if (!_.isUndefined(bandEvent.id)){
              if (bandEvent.id.startsWith('plot-event-band-')){
                axis.removePlotBandOrLine(bandEvent.id);
              }
            }
          });
        }
      }
      this.xyPlot.getChart().redraw();

    }else{
      //do nothing for the Image Chart
      //derender the hightcharts plot

      if ( !_.isUndefined(this.xyPlot) && !_.isNull(this.xyPlot.chart) ){
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

    //console.log("self.plotModel.get('showAnnotations')");
    //console.log(self.plotModel.get('showAnnotations'));
    if(self.plotModel.get('showAnnotations') === undefined){
      self.plotModel.set('showAnnotations', true);
    }

    self.plotModel.set('lastStreamTime', moment.utc(self.plotData.get('enddate')));

    if ( this.plotModel.get('plotType') == 'xy' ){
      this.xyPlot = new XYPlotView();
      this.xyPlot.render(self.plotParameters, self.plotModel, self.plotData);
      this.updateChart(self.plotModel);
      //$('toggleAnnotations').prop( "checked", false );
      //$('toggleAnnotations').prop( "checked", true );
    }else{
      //image plot
      this.imagePlot = new ImagePlotView();
      this.imagePlot.render(self.plotParameters, self.plotModel, self.plotDates);
      this.$el.find('#plotContainer').append(this.imagePlot.el);

    }
  }
});

