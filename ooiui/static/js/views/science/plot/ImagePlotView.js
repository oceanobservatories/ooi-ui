var ImagePlotView = BasePlot.extend({
  className: 'image-plot-view',
  chart : null,
  events: {
  },
  initialize: function(options) {
  },
  getChart:function(){
  },
  render: function(plotParameters, plotModel, plotDates){
    var self = this;
    this.$el.html('<div style="width:100%;height:600px" id="plotContainer"></div>');

    var params = [];
    var width, height,yvar,xvar, stream_name, reference_designator;

    plotParameters.each(function(model, i){
      params.push(model.get('short_name'))
      if (i == 0){
        reference_designator = model.get('original_model').get('reference_designator');
        stream_name = model.get('original_model').get('stream_name');
      }
    });


    if (plotModel.get('plotType') == 'rose'){
      width = 300;
      height = 300;
      yvar = params[1]+","+ params[1] ;
      xvar = params[0];
    }

    var inputParams = {
      width: width,
      height: height,
      yvar : yvar,
      xvar : xvar,
      plotLayout : plotModel.get('plotType'),
      qaqc : 0,
      startdate: plotDates.startDate.toISOString(),
      enddate  : plotDates.endDate.toISOString(),
      scatter : false,
      lines : true,
      event : false,
      dpa_flag : 1,
      format : 'svg',
      x_units : null,
      y_units : null
    };

    var recursiveEncoded = $.param( inputParams );

    var url = '/svg/plot/' + reference_designator + '/' + stream_name + "?" + recursiveEncoded;

    var img = new Image();
    img.src = url;
    img.id  = "dataPlot";
    img.onload=function(){$(img).fadeIn(500);}
    this.$el.find('#plotContainer').append(img);

    this.$el.find('#dataPlot').error(function(e,r,s) {
      ooi.trigger('plot:error', {title: "Image Plot Error", message:"ERROR"} );
      self.$el.find('#dataPlot').remove();
    })

  }
});
