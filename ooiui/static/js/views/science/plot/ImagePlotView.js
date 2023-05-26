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
    this.$el.html('<div style="width:100%;height:600px;text-align:center;" id="plotContainerInner"></div>');
    $('#plot-view').css('height','600');

    var params = [];
    var width, height,yvar,xvar, stream_name, reference_designator;

    var imgWidth, imgHeight;
    var valid = true;
    var paramOrder = {"x":null,"y":null,"z":null};

    plotParameters.each(function(model, i){
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
         valid = false;
      }
    }
    else if (plotModel.get('plotType') == 'quiver'){
      width = Math.floor($('#plotContainer').width()*.9);
      height = 600;

      if ( !_.isNull(paramOrder['x']) && !_.isNull(paramOrder['y'])  ){
        yvar = paramOrder['x']+","+ paramOrder['y'] ;
        xvar = 'time';
      }else{
         ooi.trigger('plot:error', {title: "Plot Type Input Error", message:"Please review the inputs for the Feather plot and try again."} );
         valid = false;
      }
    }
    else if (plotModel.get('plotType') == '3d_scatter'){
      width = 800;
      height = 800;

      if ( !_.isNull(paramOrder['x']) && !_.isNull(paramOrder['y']) && !_.isNull(paramOrder['z']) ){
        yvar = paramOrder['x']+","+ paramOrder['y'] +","+ paramOrder['z'] ;
        xvar = 'time';
      }else{
         ooi.trigger('plot:error', {title: "Plot Type Input Error", message:"Please review the inputs for the Pseudocolor plot and try again."} );
         valid = false;
      }

    }
    else if (plotModel.get('plotType') == 'stacked'){
      //console.log("$('#plotContainer').width()");
      //console.log($('#plotContainer').width());

      width = Math.floor($('#plotContainer').width()*.9);
      if (width <= 0)
        width = 1500;
      width = 1520;
      height = 600;

      if ( !_.isNull(paramOrder['z'])){
        yvar = paramOrder['z'] ;
        xvar = 'time';
      }else{
         ooi.trigger('plot:error', {title: "Plot Type Input Error", message:"Please review the inputs for the Binned Pseudocolor plot and try again."} );
         valid = false;
      }
    }

    var startDate = plotDates.startDate.clone();
    var endDate = plotDates.endDate.clone();
    if(!startDate.isUTC()){
      startDate._d.setMinutes(startDate._d.getMinutes()-startDate._d.getTimezoneOffset());
      endDate._d.setMinutes(endDate._d.getMinutes()-endDate._d.getTimezoneOffset());
    }

    var inputParams = {
      width: width,
      height: height,
      yvar : yvar,
      xvar : xvar,
      plotLayout : plotModel.get('plotType'),
      qaqc : plotModel.get('qaqc'),
      startdate : startDate.utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'),
      enddate : endDate.utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'),
      scatter : false,
      lines : true,
      event : false,
      dpa_flag : 1,
      format : 'png',
      x_units : null,
      y_units : null
    };


    var recursiveEncoded = $.param( inputParams );

    var url = '/svg/plot/' + reference_designator + '/' + stream_name + "?" + recursiveEncoded;

    var src = document.getElementById("plotContainer");
    var plotview = document.getElementById("plot-view");

    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:40px;margin-left:45%;font-size:90px;"> </i>');

    var img = new Image();

    img.width = Math.floor($('#plotContainer').width()*.9);
    img.id  = "dataPlot";
    img.onload=function(){
                          self.$el.find('.fa-spin').remove();
                          $(img).fadeIn(500);
                          $('.download-plot-container a').attr('href',img.src);
                          $('.download-plot-container a').attr('download', plotModel.get('plotType')+ "_" + reference_designator + '_' + stream_name + ".png");
                          //show the download
                          $('.download-plot-container').css('display','block');
                         }
    img.onerror = function() {
        ooi.trigger('plot:error', {title: "Image Plot Error", message:"There was an error creating the image, please review selections and try again. If the problem persists, please email helpdesk@oceanobservatories.org "} );
        self.$el.find('#dataPlot').remove();
    }

    img.src = url;
    src.appendChild(img);

    plotview.style.height = src.style.height;

    if (typeof(src) == 'undefined' || src == null)
    {
       ooi.trigger('plot:error', {title: "Image Plot Error", message:"There was an error creating the image, please review selections and try again. If the problem persists, please email helpdesk@oceanobservatories.org "} );
       self.$el.find('#dataPlot').remove();
    }
  }
});
