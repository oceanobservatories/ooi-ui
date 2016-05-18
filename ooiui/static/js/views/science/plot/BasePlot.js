//container for the base plotting classes required


var BasePlot = Backbone.View.extend({
  className: 'base-plot-view',
  events: {
  },
  plotView: null, //either highcharts or base image
  initialRender: function() {

  },
  template: JST['ooiui/static/js/partials/science/plot/Plot.html'],
  errorRender: function(options) {
    var response = JSON.parse(options.response.responseText);
    this.$el.html('<div class="alert alert-danger" role="alert"> <div><strong>'+response.error+'</strong><br>If the problem persists, please email <a href="mailTo:helpdesk@oceanobservatories.org">helpdesk@oceanobservatories.org</a></div></div>');
  },
  showLoading:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:40px;margin-left:40%;font-size:90px;"> </i>');
  },

  hideLoading:function(){
    this.$el.html("");
  },
  render:function(){
    //base render class
  }
});
