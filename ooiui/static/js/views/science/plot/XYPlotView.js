var XYPlotView = BasePlot.extend({
  className: 'xy-plot-view',
  chart : null,
  events: {
  },
  initialize: function(options) {
  },
  getChart:function(){
    return this.chart.highcharts();
  },
  getValue: function(val, name){
    //convert times to time
    if (name == 'time'){
      var dt;
      val -= 2208988800;
      val = val*1000;
      dt= moment.utc(val);
      return dt.valueOf();
    }else{
      return val;
    }
  },
  createAxis:function(plotParameters, plotModel, axisType){
    var axis = []

    var isMulti;
    var availableParameters = [];
    var isReversed;

    if (axisType == 'x'){
      isReversed = plotModel.get('invertX');
      availableParameters = plotParameters.filter(function (model) {
        return model.get('is_x');
      });
    }else{
      isReversed = plotModel.get('invertY');
      availableParameters = plotParameters.filter(function (model) {
        return model.get('is_y');
      });
    }


    _.each(availableParameters,function(model,i){
      //create the axis
      if (model.get('short_name') != "time"){
        axis.push({
                  reversed: isReversed,
                  title: {
                    text: model.get('name'),
                    shortName: model.get('short_name')
                  },
                  labels: {
                    format: '{value}',
                  },
                  style: {
                    color: Highcharts.getOptions().colors[i]
                  },
                  opposite: i % 2 == 0 ? false : true
                });
      }else{
        axis.push({
                  reversed: isReversed,
                  title: {
                    text: model.get('name'),
                    shortName: model.get('short_name')
                  },
                  type: 'datetime',
                  style: {
                    color: Highcharts.getOptions().colors[i]
                  },
                  opposite: i % 2 == 0 ? false : true
        });
      }


    });

    return axis;
  },
  createSeries: function(plotParameters, plotModel, plotData){
    var self = this;
    //create the data series
    var seriesCollection = new SeriesCollection();
    //are we cooling at a multiple x or multiple y, fine the base axis
    //which is the reference axis
    //if x axis > 1 then y is the reference
    var isY = plotParameters.where({'is_x':true}).length > 1;
    //figure out the reference axis
    var referenceParameterModel = isY ? plotParameters.where({'is_y': true})[0] : plotParameters.where({'is_x': true})[0]
    //get all params not reference
    var availableParameters = plotParameters.filter(function (model) {
      return model !== referenceParameterModel;
    });

    //container for the series list
    var seriesList = []

    var enableMarkers = plotModel.get('plotStyle') == 'line' ? false : true;
    var plotStyle = plotModel.get('plotStyle') == 'both' ? 'line' : plotModel.get('plotStyle');

    //map the avaiable parameters to the reference
    _.each(availableParameters,function(model, i){
      var series = new SeriesModel({
                                    marker: {
                                        enabled: enableMarkers
                                    },
                                    type: plotStyle,
                                    name  : model.get('name'),
                                    title : model.get('name'),
                                    units : model.get('units'),
                                    data  : [],
                                    yAxis : isY ? 0 : i,
                                    xAxis : isY ? i : 0
                                 });

      var data = []
      plotData.each(function(dataModel){
        var val1,val2;
        if (isY){
          var val2 = self.getValue(dataModel.get(referenceParameterModel.get('short_name')),referenceParameterModel.get('short_name'));
          var val1 = self.getValue(dataModel.get(model.get('short_name')),model.get('short_name'));
        }else{
          var val1 = self.getValue(dataModel.get(referenceParameterModel.get('short_name')),referenceParameterModel.get('short_name'));
          var val2 = self.getValue(dataModel.get(model.get('short_name')),model.get('short_name'));
        }
        data.push([val1,val2]);
      });

      series.set('data',data);
      seriesList.push(series.toJSON());
    });

    return seriesList;
  },
  doesSeriesHaveTimeAxis(){

  },
  render: function(plotParameters, plotModel, plotData){
    var self = this;

    var xAxis = self.createAxis(plotParameters,plotModel, 'x');
    var yAxis = self.createAxis(plotParameters,plotModel, 'y');
    var seriesList = self.createSeries(plotParameters, plotModel, plotData);

    // Create the chart
    this.chart = $('#plot-view').highcharts({
      chart: {
        events: {
                redraw: function(event) {
                  ooi.trigger('plot:plotLoaded',{});
                },
              },
        zoomType: 'x'
      },
      title: {
          text: plotData.displayName,
          x: -20 //center
      },
      subtitle: {
          text: plotData.title,
          x: -20,
          style: {
            color: "steelblue",
            fontSize: "18px"
          }
      },
      credits: {
        enabled: false
      },
      xAxis: xAxis,
      yAxis: yAxis,
      tooltip: {
          useHTML: true,
          shared: false,
          crosshairs : [true,false],
          formatter: function () {

            var xVal = Highcharts.numberFormat(this.x, 2);
            if (this.series.xAxis.userOptions.title.shortName == "time"){
              xVal = Highcharts.dateFormat('%Y-%m-%d %H:%M', new Date(this.x));
            }

            var yVal = Highcharts.numberFormat(this.y, 2);
            if (this.series.yAxis.userOptions.title.shortName == "time"){
              yVal = Highcharts.dateFormat('%Y-%m-%d %H:%M', new Date(this.y));
            }

            var tooltip = '<span style="color:'+this.series.color+'">'+this.series.name+'</span>:<b> '+ xVal + " @ "+ yVal +'</b>'
            return tooltip;
          }
      },
      legend: {
          //layout: 'vertical',
          //align: 'right',
          //verticalAlign: 'middle',
          //borderWidth: 0
      },
      series: seriesList
      //plot end
    });
  }

});
