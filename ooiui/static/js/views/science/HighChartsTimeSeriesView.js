/*
 * ooiui/static/js/views/science/HighChartsTimeSeriesView.js
 * View definition for the time series container
 *
 * Partials:
 *  - ooiui/static/js/partials/Timeseries.html
 */
var TimeseriesView = Backbone.View.extend({
  className: 'timeseries-view',
  events: {    
  },  
  views: {
    highchartsView: null
  },
  initialize: function(options) {
    //_.bindAll(this, 'onBack', 'onExplore');    
    //this.colorPalette = options.colorPalette;
    this.initialRender();
    this.views.highchartsView = new HighchartsView({
      title: "Title",
      title_style: {
        fontSize: "20px",
        color: "steelblue"
      }
    });
  },  
  initialRender: function() {
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:40px;margin-left:40%;font-size:90px;"> </i>');
  },
  errorRender: function(options) {
    var response = JSON.parse(options.response.responseText);
    this.$el.html('<div class="alert alert-danger" role="alert"> <div><strong>'+response.error+'</strong><br>If the problem persists, please email <a href="mailTo:helpdesk@oceanobservatories.org">helpdesk@oceanobservatories.org</a></div></div>');
    
  },
  template: JST['ooiui/static/js/partials/Timeseries.html'],
  modifytime:function(time_sec){
    time_sec -= 2208988800
    var d = moment.utc(time_sec);        
    return d._i*1000;   
  },
  showLoading:function(){
    this.views.highchartsView.chart.showLoading();
  },
  hideLoading:function(){
    this.views.highchartsView.chart.hideLoading();
  },
  isOdd:function(x) {
    return ( x & 1 ) ? true : false;
  },
  addAdditionalData:function(param, units, data, dataBounds, title){
    var self = this;

    this.views.highchartsView.chart.setTitle(null, { text: title });

    //check the axis are not already available
    var newAxisName = param+' ('+units+")"

    var i = this.views.highchartsView.chart.series.length+1;

    //check and update the x axis
    var xcur = this.views.highchartsView.chart.xAxis[0].getExtremes();
    var change = false;
    if (dataBounds.xmin < xcur.min){
      xcur.min = dataBounds.xmin;
      change = true;
    }
    if (dataBounds.xmax > xcur.min){
      xcur.max = dataBounds.xmax;
      change = true;
    }

    //get the current xaxis bounds
    if (change){
      this.views.highchartsView.chart.xAxis[0].setExtremes(xcur.min,xcur.max);
    }

    this.views.highchartsView.chart.addAxis({ // Secondary yAxis
        id: newAxisName,
        title: {
            text: newAxisName,
            style: {
                color: Highcharts.getOptions().colors[i]
            }
        },
        labels: {
          style: {
            color: Highcharts.getOptions().colors[i]
          }
        },
        opposite: !this.isOdd(this.views.highchartsView.chart.yAxis.length)
    });
    this.views.highchartsView.chart.addSeries({
        units: units,
        name: param,
        type: 'scatter',
        marker: {"symbol": "circle"},
        color: Highcharts.getOptions().colors[i],
        yAxis: newAxisName,
        data: data
    });
  },
  updatePlot:function(){    
    //update the plot
    this.views.highchartsView.chart.redraw();
  },
  getQAQC:function(){
      if($(".div-qa-qc").css("display")=="none") return 0
      if($('.div-qa-qc input:checked').val()=='undefined')return 0
      return parseInt($('.div-qa-qc input:checked').val().toString())
    },
  addNotify: function(notify_list){
    var notifydiv = '<div class="alert alert-warning alert-dismissible" role="alert">'
    notifydiv+=     '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
    notifydiv+= '<strong>Data fields unable to render</strong>: '+ _.uniq(notify_list);
    notifydiv+= '</div>'
    this.$el.append(notifydiv);
  },
  render: function() {
    var self = this;
    this.$el.html(this.template());

    //get the title from the collection
    this.views.highchartsView.title = self.collection.getTitle();
    this.views.highchartsView.subtitle = self.collection.getSubtitle();

    var qaqc = this.getQAQC();
    
    /* Build a list of series */
    var seriesCollection = new SeriesCollection();

    var startDate = self.collection.getStartDate();
    var endDate = self.collection.getEndDate();

    var xvars = self.collection.xparameters;
    var yvars = self.collection.yparameters;
    var axis_names = self.collection.axis_name;
    var axes_count = 0;
    var notifyList = []

    _.each(xvars, function(param,index) { 
      var xvar = xvars[index]
      var yvar = yvars[index]
      var axis_name = axis_names[index]
      var series_data = [];
      //reset for each series
      var addNotify = false;
      
      //loop over a collection of params make uframe return look like highcharts data
      self.collection.each(function(model,i) {

        if (typeof(model.get(xvar)) == "string" || typeof(model.get(yvar)) == "string"){          
          addNotify = true;
          notifyList.push(yvar);
        } 

        //only if its valid
        if (!addNotify){
          //get the data
          
          if (xvar == "time"){  //Time series!
            
            if (qaqc){  // Check for QAQC Time Series
              var qaqc_data = model.get(yvar+'_qc_results');
              
              if (typeof qaqc_data != 'undefined'){  //Some data doesn't have QAQC values
                if (qaqc < 10){   // Check against specific tests
                  if (qaqc_data & Math.pow(2,qaqc-1)){  //PASS
                    series_data.push([self.modifytime(model.get(xvar)),model.get(yvar)]);
                  }else{  //FAIL
                    series_data.push({x:self.modifytime(model.get(xvar)),y:model.get(yvar),marker:{lineColor:'#FF0000', lineWidth:1.5}});
                  }
                }else{  // Check against all tests
                  if (qaqc_data == Math.pow(2,9)){  // PASS
                    series_data.push([self.modifytime(model.get(xvar)),model.get(yvar)]);
                  }else{  //FAIL
                     series_data.push({x:self.modifytime(model.get(xvar)),y:model.get(yvar),marker:{lineColor:'#FF0000', lineWidth:1.5}});
                  }
                }
              }else{  // No QAQC data found
                // Add to the notify list
                if ($.inArray(yvar+'_qc_results', notifyList) == -1){
                  notifyList.push(yvar+'_qc_results');
                }
                series_data.push([self.modifytime(model.get(xvar)),model.get(yvar)]);
              }
            }else{  // Not QAQC
              if (typeof model.get(yvar) != 'undefined'){  //Some data doesn't have QAQC values
                series_data.push([self.modifytime(model.get(xvar)),model.get(yvar)]);
              }else{
                 // Add to the notify list
                addNotify = true;
                if ($.inArray(yvar, notifyList) == -1){
                  notifyList.push(yvar);
                }
              }
            }

          }else if (yvar == "time"){
            series_data.push([model.get(xvar),self.modifytime(model.get(yvar))]);

          }else{
            series_data.push([model.get(xvar),model.get(yvar)]);        
          }
        } 
      });

      if (!addNotify){
        axes_count += 1
        var seriesModel = new SeriesModel({data:series_data})
        seriesModel.set('units', self.collection.getUnits(yvar));
        seriesModel.set('name', axis_name);
        seriesModel.set('axisName', axis_name + " ("+self.collection.getUnits(yvar) + ")");
        // seriesModel.set('axisName', yvar+" ("+self.collection.getUnits(yvar)+")");
        seriesModel.set('xmin',startDate);
        seriesModel.set('xmax',endDate);
        seriesCollection.add(seriesModel);
        if (qaqc && axes_count == 1){
            // Add a legend entry for QAQC 
           var seriesModel = new SeriesModel({data:[]})
           seriesModel.set('name', 'Failed QAQC');
           seriesModel.set('color', '#FF0000');
           // seriesModel.set('type', 'scatter');
           seriesCollection.add(seriesModel);
        }
      }

    });

    if(notifyList.length > 0){ 
      self.addNotify(notifyList);
    }

    /*
    var colorPalette = this.colorPalette.clone()
    
    seriesCollection.each(function(seriesModel) {
      seriesModel.set('color',colorPalette.chooseColor());
    });
    */

    this.views.highchartsView.collection = seriesCollection;
    this.views.highchartsView.setElement(this.$el.find('#highcharts-view'));
    if (axes_count > 0){
      this.views.highchartsView.render();
    }
    return this;
  }
});

