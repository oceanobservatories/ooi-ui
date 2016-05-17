var ImagePlotView = BasePlot.extend({
  className: 'image-plot-view',
  chart : null,
  events: {
  },
  initialize: function(options) {
  },
  getChart:function(){
  },
  render: function(plotParameters, plotModel){
    console.log('image render', plotParameters, plotModel);

    this.$el.html('<div id="plotContainer"></div>');


    this.$el.find('#plotContainer').append('<img src="https://ooinet.oceanobservatories.org/svg/plot/CE02SHBP-LJ01D-07-VEL3DC108/streamed_vel3d-cd-velocity-data?format=svg&x_units=&y_units=&dpa_flag=0&yvar=vel3d_c_eastward_turbulent_velocity%2Cvel3d_c_upward_turbulent_velocity&xvar%5B%5D=time&height=316.50000000000006&width=949.5000000000001&scatter=false&lines=true&event=false&plotLayout=rose&startdate=2016-05-13T10%3A59%3A55.000Z&enddate=2016-05-14T10%3A59%3A55.000Z&qaqc=0" alt="Rose Plot" style="width:300px;height:300px;">')

    $('#plotContainer').load(function() {
        $('#plotContainer').fadeIn('slow');
    });

  }
});
