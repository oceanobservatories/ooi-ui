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

    var paramOrder = {"x":null,"y":null,"z":null};

    plotParameters.each(function(model, i){
      console.log(model);
      params.push(model.get('short_name'))
      if (i == 0){
        reference_designator = model.get('original_model').get('reference_designator');
        stream_name = model.get('original_model').get('stream_name');
      }

      if (model.get('is_x')){
        paramOrder['x'] = model.get('short_name');
      }
      else if (model.get('is_y')){
        paramOrder['y'] = model.get('short_name');
      }
      else if (model.get('is_z')){
        paramOrder['z'] = model.get('short_name');
      }
    });

    //final image input check
    if (plotModel.get('plotType') == 'rose'){
      width = Math.floor($('#plotContainer').width()*.9);
      height = 600;
      if ( !_.isNull(paramOrder['x']) && !_.isNull(paramOrder['y'])  ){
        yvar = paramOrder['y']+","+ paramOrder['y'] ;
        xvar = paramOrder['x'];
      }else{
         ooi.trigger('plot:error', {title: "Plot Type Input Error", message:"Please review the inputs for the Rose plot and try again."} );
      }
    }
    else if (plotModel.get('plotType') == 'quiver'){
      width = Math.floor($('#plotContainer').width()*.9);
      height = 600;

      if ( !_.isNull(paramOrder['x']) && !_.isNull(paramOrder['y'])  ){
        yvar = paramOrder['x']+","+ paramOrder['y'] ;
        xvar = 'time';
      }else{
         ooi.trigger('plot:error', {title: "Plot Type Input Error", message:"Please review the inputs for the Quiver plot and try again."} );
      }
    }
    else if (plotModel.get('plotType') == '3d_scatter'){
      width = Math.floor($('#plotContainer').width()*.9);
      height = 600;

      if ( !_.isNull(paramOrder['x']) && !_.isNull(paramOrder['y']) && !_.isNull(paramOrder['z']) ){
        yvar = paramOrder['x']+","+ paramOrder['y'] +","+ paramOrder['z'] ;
        xvar = 'time';
      }else{
         ooi.trigger('plot:error', {title: "Plot Type Input Error", message:"Please review the inputs for the Pseudocolor plot and try again."} );
      }

    }
    else if (plotModel.get('plotType') == 'stacked'){
      width = Math.floor($('#plotContainer').width()*.9);
      height = 600;

      if ( !_.isNull(paramOrder['z'])){
        yvar = paramOrder['x'] ;
        xvar = 'time';
      }else{
         ooi.trigger('plot:error', {title: "Plot Type Input Error", message:"Please review the inputs for the Binned Pseudocolor plot and try again."} );
      }
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
    this.$el.find('#plotContainer').append('<i class="fa fa-spinner fa-spin" style="margin-top:40px;margin-left:40%;font-size:90px;"> </i>');

    var img = new Image();
    img.src = url;
    img.id  = "dataPlot";
    img.onload=function(){ self.$el.find('.fa-spin').remove(); $(img).fadeIn(500);}
    this.$el.find('#plotContainer').append(img);

    this.$el.find('#dataPlot').error(function(e,r,s) {
      ooi.trigger('plot:error', {title: "Image Plot Error", message:"There was an Error creating the image, please review selections and try again. If the problem persists, please email helpdesk@oceanobservatories.org "} );
      self.$el.find('#dataPlot').remove();
    })

  }
});
