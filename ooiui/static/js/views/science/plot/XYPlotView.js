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
    if (name.indexOf('time') > -1){
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
    var axis = [];

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

    //availableParameters = availableParameters.slice().sort(function(a,b){return a > b}).reduce(function(a,b){if (a.slice(-1)[0] !== b) a.push(b);return a;},[]);
    console.log('availableParameters in create axis');
    console.log(availableParameters);

    _.each(availableParameters,function(model,i){
      //create the axis
      if (model.get('short_name').indexOf('time') == -1){
        axis.push({
                  reversed: isReversed,
                  title: {
                    text: model.get('name'),
                    shortName: model.get('short_name')
                  },
                  labels: {
                    format: '{value}'
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
                    text: 'Time (UTC)',
                    shortName: model.get('short_name')
                  },
                  type: 'datetime',
                  style: {
                    color: Highcharts.getOptions().colors[i]
                  },
                  opposite: i % 2 === 0 ? false : true
        });
      }


    });

    return axis;
  },
  createMultipleSeries: function(plotParameters, plotModel, plotData, model, i){
    // This function is intended to plot spectral irradiance from spkir instruments
    var self = this;
      //container for the series list
    var seriesList = [];

    var enableMarkers = plotModel.get('plotStyle') == 'line' ? false : true;
    var plotStyle = plotModel.get('plotStyle') == 'both' ? 'line' : plotModel.get('plotStyle');
    var isY = plotParameters.where({'is_x':true}).length > 1;
    var referenceParameterModel = isY ? plotParameters.where({'is_y': true})[0] : plotParameters.where({'is_x': true})[0];
    var seriesNames = ['412nm', '443nm', '490nm', '510nm', '555nm', '620nm', '683nm'];
    var dataArray = self.getValue(plotData.models[0].get(model.get('short_name')), model.get('short_name'));
    _.each(dataArray, function(num, index){
      var series = new SeriesModel({
                                    marker: {
                                      radius : 3,
                                      enabled: enableMarkers
                                    },
                                    type: plotStyle,
                                    name  : seriesNames[index],
                                    title : seriesNames[index],
                                    units : model.get('units').indexOf('seconds since 1900') > -1 ? 'Time (UTC)' : model.get('units'),
                                    data  : [],
                                    yAxis : isY ? 0 : i,
                                    xAxis : isY ? i : 0
                                 });

      var data = [];

      plotData.each(function(dataModel){
        var val1, val2;
        if (isY){
          val2 = self.getValue(dataModel.get(referenceParameterModel.get('short_name')),referenceParameterModel.get('short_name'));
          val1 = self.getValue(dataModel.get(model.get('short_name')),model.get('short_name'));
        }else{
          val1 = self.getValue(dataModel.get(referenceParameterModel.get('short_name')),referenceParameterModel.get('short_name'));
          val2 = self.getValue(dataModel.get(model.get('short_name')),model.get('short_name'));
        }

        data.push([val1,val2[index]]);

      });

      series.set('data',data);
      seriesList.push(series.toJSON());
    });
    return seriesList;

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
    var referenceParameterModel = isY ? plotParameters.where({'is_y': true})[0] : plotParameters.where({'is_x': true})[0];
    console.log('referenceParameterModel');
    console.log(referenceParameterModel);
    //get all params not reference
    var availableParameters = plotParameters.filter(function (model) {
      return model !== referenceParameterModel;
    });

    //container for the series list
    var seriesList = [];

    var enableMarkers = plotModel.get('plotStyle') == 'line' ? false : true;
    var plotStyle = plotModel.get('plotStyle') == 'both' ? 'line' : plotModel.get('plotStyle');

    var qaqc = plotModel.get('qaqc'); //qaqc selection

    //map the avaiable parameters to the reference
    //availableParameters = availableParameters.slice().sort(function(a,b){return a > b}).reduce(function(a,b){if (a.slice(-1)[0] !== b) a.push(b);return a;},[]);
    console.log('availableParameters before getting data');
    console.log(availableParameters);

    _.each(availableParameters,function(model, i){

      // if the dependent variable (y) is an array, we need to produce multiple series (only spkir_abj_cspp_downwelling_vector for now)
      if (_.isArray(self.getValue(plotData.models[0].get(model.get('short_name')), model.get('short_name')))){
        console.log('inside multiple series');
        var shortName = model.get('short_name');
        if (shortName.indexOf('spkir') > -1){
          // spkir_abj_cspp_downwelling_vector
          var multipleSeries = self.createMultipleSeries(plotParameters, plotModel, plotData, model, i);
          seriesList = seriesList.concat(multipleSeries);
          return;
        }
      }

      var qc_name = model.get('short_name') + "_qc_results";
      var series = new SeriesModel({
                                    marker: {
                                      radius : 3,
                                      enabled: enableMarkers
                                    },
                                    type: plotStyle,
                                    name  : model.get('name'),
                                    title : model.get('name'),
                                    units : model.get('units').indexOf('seconds since 1900') > -1 ? 'Time (UTC)' : model.get('units'),
                                    data  : [],
                                    yAxis : isY ? 0 : i,
                                    xAxis : isY ? i : 0
                                 });

      var data = [];
      var qaqcdata = [];


      plotData.each(function(dataModel){
        var val1, val2;
        if (isY){
          val2 = self.getValue(dataModel.get(referenceParameterModel.get('short_name')),referenceParameterModel.get('short_name'));
          val1 = self.getValue(dataModel.get(model.get('short_name')),model.get('short_name'));
        }else{
          val1 = self.getValue(dataModel.get(referenceParameterModel.get('short_name')),referenceParameterModel.get('short_name'));
          val2 = self.getValue(dataModel.get(model.get('short_name')),model.get('short_name'));
        }
        data.push([val1,val2]);

        //will only add QAQC if the reference is time
        if (qaqc > 0 && dataModel.has(qc_name) && referenceParameterModel.get('short_name').indexOf('time') > -1){
          var qaqc_data = dataModel.get(qc_name);
          console.log('qaqc_data');
          console.log(qaqc_data);
          console.log('qaqc');
          console.log(qaqc);
          var qaqcpass = false;
          if (qaqc < 10){
            if (qaqc_data && Math.pow(2,qaqc-1)){  //PASS
              qaqcpass = true;
            }else{
              qaqcpass = false;
            }
          }else{
            if (qaqc_data == Math.pow(2,9)){  // PASS
              qaqcpass = true;
            }else{
              qaqcpass = false;
            }
          }

          // console.log(qaqcpass);
          if (!qaqcpass)
            qaqcdata.push({x:val1,y:val2, marker:{lineColor:'#FF0000', lineWidth:1.5}});
        }
      });

      //add qaqc series
      if (!_.isEmpty(qaqcdata)){
        // console.log('FAILED QAQC SHOULD SHOW HERE');
        // console.log(qaqcdata);

        seriesList.push(new SeriesModel({
          type  : 'scatter',
          name  : "Failed QAQC: "+ model.get('name'),
          qaqc  : true,
          title : qc_name,
          units : '',
          color : '#FF0000',
          data  : qaqcdata,
          yAxis : isY ? 0 : i,
          xAxis : isY ? i : 0
        }).toJSON());
      }

      series.set('data',data);
      seriesList.push(series.toJSON());
    });

    return seriesList;
  },
  createInterpolatedSeries: function(plotParameters, plotModel, plotData, xAxis, yAxis){
    var self = this;
    //create the data series
    var seriesCollection = new SeriesCollection();
    //are we cooling at a multiple x or multiple y, fine the base axis
    //which is the reference axis
    //if x axis > 1 then y is the reference
    var isY = plotParameters.where({'is_x':true}).length > 1;
    //figure out the reference axis
    var referenceParameterModel = isY ? plotParameters.where({'is_x': true})[0] : plotParameters.where({'is_y': true})[0];
    console.log('referenceParameterModel');
    console.log(referenceParameterModel);
    //get all params not reference
    var availableParameters = plotParameters.filter(function (model) {
      return model;
    });


    //container for the series list
    var seriesList = [];

    var enableMarkers = plotModel.get('plotStyle') == 'line' ? false : true;
    var plotStyle = plotModel.get('plotStyle') == 'both' ? 'line' : plotModel.get('plotStyle');

    var qaqc = plotModel.get('qaqc'); //qaqc selection

    //map the avaiable parameters to the reference
    //availableParameters = availableParameters.slice().sort(function(a,b){return a > b}).reduce(function(a,b){if (a.slice(-1)[0] !== b) a.push(b);return a;},[]);
    console.log('availableParameters before getting data');
    console.log(availableParameters);

    availableParameters = _.uniq(availableParameters, function(item, key, a) {return item.attributes.short_name;});

    //_.uniq(temp3, function(item, key, a) {return item.attributes.short_name;});

    console.log('availableParameters after uniq');
    console.log(availableParameters);

    var yAxisCounter = 0;
    var xAxisCounter = 0;
    _.each(availableParameters,function(model, i){

      // if the dependent variable (y) is an array, we need to produce multiple series (only spkir_abj_cspp_downwelling_vector for now)
      if (_.isArray(self.getValue(plotData.models[0].get(model.get('short_name')), model.get('short_name')))){
        console.log('inside multiple series');
        var shortName = model.get('short_name');
        if (shortName.indexOf('spkir') > -1){
          // spkir_abj_cspp_downwelling_vector
          var multipleSeries = self.createMultipleSeries(plotParameters, plotModel, plotData, model, i);
          seriesList = seriesList.concat(multipleSeries);
          return;
        }
      }





      var qc_name = model.get('short_name') + "_qc_results";
      var series = new SeriesModel({
                                    marker: {
                                      radius : 3,
                                      enabled: enableMarkers
                                    },
                                    type: plotStyle,
                                    name  : model.get('name'),
                                    title : model.get('name'),
                                    units : model.get('units').indexOf('seconds since 1900') > -1 ? 'Time (UTC)' : model.get('units'),
                                    data  : [],
                                    yAxis : yAxisCounter,
                                    xAxis : 0
                                 });



      var data = [];
      var qaqcdata = [];


      plotData.each(function(dataModel){
        var val1, val2;
        if (!isY){
          val2 = self.getValue(dataModel.get(referenceParameterModel.get('short_name')),referenceParameterModel.get('short_name'));
          val1 = self.getValue(dataModel.get(model.get('short_name')),model.get('short_name'));
        }else{
          val1 = self.getValue(dataModel.get(referenceParameterModel.get('short_name')),referenceParameterModel.get('short_name'));
          val2 = self.getValue(dataModel.get(model.get('short_name')),model.get('short_name'));
        }
        data.push([val1,val2]);

        //will only add QAQC if the reference is time
        if (qaqc > 0 && dataModel.has(qc_name) && referenceParameterModel.get('short_name').indexOf('time') > -1){
          var qaqc_data = dataModel.get(qc_name);
          console.log('qaqc_data');
          console.log(qaqc_data);
          console.log('qaqc');
          console.log(qaqc);
          var qaqcpass = false;
          if (qaqc < 10){
            if (qaqc_data && Math.pow(2,qaqc-1)){  //PASS
              qaqcpass = true;
            }else{
              qaqcpass = false;
            }
          }else{
            if (qaqc_data == Math.pow(2,9)){  // PASS
              qaqcpass = true;
            }else{
              qaqcpass = false;
            }
          }

          // console.log(qaqcpass);
          if (!qaqcpass)
            qaqcdata.push({x:val1,y:val2, marker:{lineColor:'#FF0000', lineWidth:1.5}});
        }
      });

      //add qaqc series
      if (!_.isEmpty(qaqcdata)){
        // console.log('FAILED QAQC SHOULD SHOW HERE');
        // console.log(qaqcdata);

        seriesList.push(new SeriesModel({
          type  : 'scatter',
          name  : "Failed QAQC: "+ model.get('name'),
          qaqc  : true,
          title : qc_name,
          units : '',
          color : '#FF0000',
          data  : qaqcdata,
          yAxis : isY ? 0 : i,
          xAxis : isY ? i : 0
        }).toJSON());
      }

      if(model.get('short_name') != 'time') {
        series.set('data', data);
        seriesList.push(series.toJSON());
        yAxisCounter++;
      }
    });

    return seriesList;
  },
  setPlotSize:function(x,y){
    //updates the plot size for orientation
    $('#plot-view').width(x);
    $('#plot-view').height(y);
  },
  render: function(plotParameters, plotModel, plotData){
    var self = this;

    console.log('plotParameters');
    console.log(plotParameters);
    console.log('plotModel');
    console.log(plotModel);
    console.log('plotData');
    console.log(plotData);

    // Set message for data decimation based on returned data model length
    $('#isDecimated').empty();
    if(plotData.length < 1000){
      $('#isDecimated').append('<small class="pull-right"> Data points available: ' + plotData.length + '</small>');
    }else{
      $('#isDecimated').append('<small class="pull-right"> Data are decimated. Maximum of 1000 points shown.</small>');
    }

    var xAxis = self.createAxis(plotParameters,plotModel, 'x');
    var yAxis = self.createAxis(plotParameters,plotModel, 'y');
    var seriesList = [];
    if(xAxis.length > 1 && yAxis.length > 1){
      seriesList = self.createInterpolatedSeries(plotParameters, plotModel, plotData, xAxis, yAxis);
    }else{
      seriesList = self.createSeries(plotParameters, plotModel, plotData);
    }


    //xAxis = xAxis.slice().sort(function(a,b){return a > b}).reduce(function(a,b){if (a.slice(-1)[0] !== b) a.push(b);return a;},[]);
    //yAxis = yAxis.slice().sort(function(a,b){return a > b}).reduce(function(a,b){if (a.slice(-1)[0] !== b) a.push(b);return a;},[]);
    //seriesList = seriesList.slice().sort(function(a,b){return a > b}).reduce(function(a,b){if (a.slice(-1)[0] !== b) a.push(b);return a;},[]);

    console.log('xAxis');
    console.log(xAxis);
    console.log('yAxis');
    console.log(yAxis);
    console.log('seriesList');
    console.log(seriesList);
    console.log(plotData.displayName);
    console.log(plotData.stream_display_name);

    if (plotModel.get('plotOrientation') == 'horizontal'){
      self.setPlotSize('100%','400px');
    }else if (plotModel.get('plotOrientation') == 'vertical'){
      self.setPlotSize('50%','800px');
    }

    // Create the chart
    this.chart = $('#plot-view').highcharts({
      chart: {
        events: {
          redraw: function(event) {
            ooi.trigger('plot:plotLoaded',{});
          },
          selection: function(event) {
            if(event.xAxis != null) {
              var startDate = moment.utc(event.xAxis[0].min).toJSON();
              var endDate = moment.utc(event.xAxis[0].max).toJSON();
              //console.log('startDate and endDate');
              //console.log(startDate);
              //console.log(endDate);


              if(_.isNull(origStartDate)){
                //console.log('changing origStartDate');
                origStartDate = plotData.startdate;
              }

              if(_.isNull(origEndDate)){
                //console.log('changing origEndDate');
                origEndDate = plotData.enddate;
              }

              //console.log('origStartDate and origEndDate in selection');
              //console.log(origStartDate);
              //console.log(origEndDate);

              ooi.trigger('updateCalendarZoom', {startDate: startDate, endDate: endDate});

              //$('#update-plot').hide();
              // $('#zoom-update-plot').prop('disabled',false);
              // $('#zoom-update-plot').show();

              $('#zoom-reset-plot').prop('disabled',false);
              $('#zoom-reset-plot').show();


              // console.log(this.$end_date_picker.getDate(endDate));
              // console.log(this.$start_date_picker.getDate(startDate));
              $('#plot-view').empty();
              ooi.trigger('update_plot');

              $('#zoom-details').show();
              $('#zoom-coordinates').empty();
              // console.log("selection: ", event.xAxis[0].min, event.xAxis[0].max);
              $('#zoom-coordinates').append("Min: " + moment.utc(event.xAxis[0].min).toString());
              $('#zoom-coordinates').append(", Max: " + moment.utc(event.xAxis[0].max).toString());

            } else {
              // ooi.trigger('updateCalendarZoom', {startDate: origStartDate, endDate: origEndDate});
              // ooi.trigger('update_plot');
              // origStartDate = null;
              // origEndDate = null;
              // $('#zoom-reset-plot').hide();
              // // console.log("selection: reset");
              // $('#zoom-details').hide();
              // $('#zoom-coordinates').empty();
              //$('#zoom-update-plot').prop('disabled',true);
              //$('#zoom-update-plot').hide();
              //$('#update-plot').show();
              // ooi.trigger('updateCalendarZoom', {startDate: origStartDate, endDate: origEndDate})
            }
          }
              },
        zoomType: 'x',
        resetZoomButton: {
          position: {
            align: 'left', // by default
            verticalAlign: 'top', // by default
            x: 10,
            y: 10
          },
          relativeTo: 'chart'
        }
      },
      title: {
          text: plotData.displayName,
          x: -20 //center
      },
      subtitle: {
          text: plotData.stream_display_name,
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
      //options: {yAxis: yAxis},
      tooltip: {
          useHTML: true,
          shared: false,
          crosshairs : [true,false],
          formatter: function () {

            //console.log('this tooltip');
            //console.log(this);

            var xVal = Highcharts.numberFormat(this.x, 2);
            if (this.series.xAxis.userOptions.title.shortName.indexOf('time') > -1){
              xVal = Highcharts.dateFormat('%Y-%m-%d %H:%M', new Date(this.x));
            }

            var yVal = Highcharts.numberFormat(this.y, 2);
            if (this.series.yAxis.userOptions.title.shortName.indexOf('time') > -1){
              yVal = Highcharts.dateFormat('%Y-%m-%d %H:%M', new Date(this.y));
            }

            var tooltip = '<span style="color:'+this.series.color+'">'+this.series.name+'</span>:<b> '+ xVal + " @ "+ yVal +'</b>';
            return tooltip;
          }
      },
      legend: {
          //layout: 'vertical',
          //align: 'right',
          //verticalAlign: 'middle',
          //borderWidth: 0
      },
      exporting: { //Enable exporting images
        sourceWidth: 1520,
        sourceHeight: 400,
        scale: 1,
        enabled: true,
        enableImages: true
      },
      series: seriesList
      //plot end
    });

  }

});
