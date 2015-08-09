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
    this.$el.html('<div class="alert alert-danger" role="alert"> <div><strong>error:'+options.error+'</strong>:<br> '+ options.response.responseText +'</div>  </div>');
    
  },
  template: JST['ooiui/static/js/partials/Timeseries.html'],
  modifytime:function(time_sec){
    time_sec -= 2208988800
    var d = moment.utc(time_sec);        
    return d._i*1000;   
  },
  getQAQC:function(){
      if($(".div-qa-qc").css("display")=="none") return 0
      if($('.div-qa-qc input:checked').val()=='undefined')return 0
      return parseInt($('.div-qa-qc input:checked').val().toString())
    },
  addNotify: function(notify_list){
    var notifydiv = '<div class="alert alert-warning alert-dismissible" role="alert">'
    notifydiv+=     '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
    notifydiv+= '<strong>Data fields unable to render</strong>:'+ _.uniq(notify_list);
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

    var notifyList = []

    _.each(xvars, function(param,index) { 
      var xvar = xvars[index]
      var yvar = yvars[index]
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
          //get the data, and convert if its date time   
          if (xvar == "time"){
            if (qaqc){
              var qaqc_data = model.get(yvar+'_qc_results');
              
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
            }else{
              series_data.push([self.modifytime(model.get(xvar)),model.get(yvar)]);
            }
          }else if (yvar == "time"){
            series_data.push([model.get(xvar),self.modifytime(model.get(yvar))]);
          }else{
            series_data.push([model.get(xvar),model.get(yvar)]);        
          }
        } 
      });

      var seriesModel = new SeriesModel({data:series_data})
      seriesModel.set('units', self.collection.getUnits(yvar));
      seriesModel.set('name', yvar);
      seriesModel.set('axisName', yvar+" ("+self.collection.getUnits(yvar)+")");
      seriesModel.set('xmin',startDate);
      seriesModel.set('xmax',endDate);
      seriesCollection.add(seriesModel);

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
    this.views.highchartsView.render();
    return this;
  }
});

