/*
 * ooiui/static/js/views/science/HighChartsXYScatterView.js
 * View definition for the time series container
 *
 * Partials:
 *  - ooiui/static/js/partials/Timeseries.html
 */
var XYScatterPlotView = Backbone.View.extend({
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
    this.views.highchartsView = new HighchartsScatterView({
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
  updatePlot:function(){    
    //update the plot
    this.views.highchartsView.chart.redraw();
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
    
    /* Build a list of series */
    var seriesCollection = new SeriesCollection();

    var startDate = self.collection.getStartDate();
    var endDate = self.collection.getEndDate();

    var xvar = self.collection.var1;
    var yvar = self.collection.var2;
    var axes_count = 0;
    var notifyList = []

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
        if (typeof model.get(yvar) != 'undefined'){  //Some data doesn't have QAQC values
          series_data.push([model.get(xvar),model.get(yvar)]);
        }else{
           // Add to the notify list
          addNotify = true;
          if ($.inArray(yvar, notifyList) == -1){
            notifyList.push(yvar);
          }
        }
      } 
    });

    if (!addNotify){
      axes_count += 1
      var seriesModel = new SeriesModel({data:series_data})
      seriesModel.set('xunits', self.collection.getUnits(xvar));
      seriesModel.set('yunits', self.collection.getUnits(yvar));
      seriesModel.set('xname', yvar);
      seriesModel.set('yname', yvar);
      seriesModel.set('axisName', self.collection.yaxislabel);
      seriesModel.set('xaxisName', self.collection.xaxislabel);
      seriesCollection.add(seriesModel);
      
    }

    if(notifyList.length > 0){ 
      self.addNotify(notifyList);
    }

    this.views.highchartsView.collection = seriesCollection;
    this.views.highchartsView.setElement(this.$el.find('#highcharts-view'));
    if (axes_count > 0){
      this.views.highchartsView.render();
    }
    return this;
  }
});

