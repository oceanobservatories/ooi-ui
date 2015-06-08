
var SVGView = Backbone.View.extend({
  initialize: function(options) {
    if(options && options.height && options.width) {
      this.height = options.height;
      this.width = options.width;
    } else {
      console.error("SVGView needs height and width");
    }
    //this.initialRender();
  },
  fetch: function() {
    var self = this;
    this.initialRender();
    console.log("Fetching " + this.url);
    $.get(this.url,function(svgDoc) {
        var importedSVGRootElement = document.importNode(svgDoc.documentElement,true);
        self.$el.html(importedSVGRootElement);
        self.render();
      },"xml")
      .fail(function() {
        self.$el.html('<i class="fa fa-exclamation-triangle" style="margin-left:50%;font-size:90px;"> </i>')
      })
      .always(function() {
        
      });
  },
  initialRender: function() {
    //console.log("Plot should be a spinner");
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-left:50%;font-size:90px;"> </i>');
  },
  render: function() {
  }
});

var SVGPlotView = SVGView.extend({
  setModel: function(model) {
    console.log("set Model")
    this.model = model;
    this.reference_designator = this.model.get('reference_designator')
    this.stream_name = this.model.get('stream_name')
    this.variable = this.model.get('yvariable').join()
    this.dpa_flag = "0";
    /* NEED TO ADD THIS BACK
    var variables = this.model.get('variable_types');    
    this.variable = null;
    //loop over variables
    for(var key in variables) {
      if(key.indexOf('timestamp') == -1 && (variables[key] == 'int' || variables[key] == 'float')) {        
        this.variable = key;        
        this.yunits = this.model.get('units')[this.variable];
        this.xunits = this.model.get('units')[this.variable];
        this.d_type = this.model.get('variables_shape')[this.variable];
        //if its a dpa product create the flag
        
        if (this.model.get('variables_shape')[this.variable] == "function"){
          this.dpa_flag = "1";
        }else{
          this.dpa_flag = "0";
        }
        
        break;
      }
    }
    */
    if(this.variable != null) {
      //done on first render, i.e inital conditions      
      var useLine = "true"
      var useScatter = "false"
      var plotLayoutType = "timeseries"
      this.width = (this.$el.width()/100*90);
      //st = moment(this.model.get('start'))
      //ed = st.add('hours',1).format(moment.ISO_8601);
      this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name +'?' + $.param( {dpa_flag: this.dpa_flag,
                                                                                                    yvar: this.variable, 
                                                                                                    enddate:this.model.get('end'),
                                                                                                    startdate:this.model.get('start'),
                                                                                                    height: this.height, 
                                                                                                    width: this.width , 
                                                                                                    scatter:useScatter,
                                                                                                    lines:useLine, 
                                                                                                    x_units:this.xunits, 
                                                                                                    y_units:this.yunits, 
                                                                                                    plotLayout:plotLayoutType })      
      //this.fetch();
    }
  },
  getDpaFlag: function(var_list) {
    var self = this
    var dpa_flag = "0";
    $.each(var_list, function( index, value ) {
      var func_type = self.model.get('variables_shape')[value]    
      if (func_type == "function"){
        dpa_flag = "1"        
      }      
    });
    return dpa_flag
  },
  plotMulti: function(options) {
    //requested plot
    console.log("plot...")
    this.reference_designator = this.model.get('reference_designator') + "," +options.secRef    
    this.stream_name = this.model.get('stream_name') + "," +options.secStream  
    //options.yvar = this.model.get('yvariable')  
    if('xvar' in options){
    }else{
      options.xvar = ["time"]
    } 

    //set the width of the plot, 90% width
    this.width = (this.$el.width()/100)*90;

    if(options && options.yvar && options.xvar) {            
        this.yvariable = options.yvar+","+options.yvar2
        this.xvariable = options.xvar;
        this.dpa_flag = true;
    }
    if(this.yvariable != null && this.xvariable != null) {
      this.useLine = options.useLine.toString();
      this.useScatter = options.useScatter.toString();  
      this.useEvent = options.useEvent.toString();      
      this.plotType = options.plotType;
      this.st = moment(options.start_date).toISOString()
      this.ed = moment(options.end_date).toISOString()

      this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name + '?' + $.param({dpa_flag: this.dpa_flag,
                                                                                                    yvar: this.yvariable , 
                                                                                                    xvar: this.xvariable, 
                                                                                                    height: this.height, 
                                                                                                    width: this.width,
                                                                                                    scatter:this.useScatter,
                                                                                                    lines:this.useLine,
                                                                                                    event:this.useEvent, 
                                                                                                    plotLayout:this.plotType,
                                                                                                    startdate:this.st,                                                                                                    
                                                                                                    enddate:this.ed})
      this.fetch();
    }
  },
  plot: function(options) {
    //requested plot
    var self = this;
    console.log("plot...")

    this.reference_designator = this.model.get('reference_designator')    
    this.stream_name = this.model.get('stream_name')
    options.yvar = this.model.get('yvariable')  
    if('xvar' in options){
      options.xvar = ["time"]
    }else{
      options.xvar = ["time"]
    } 

    //set the width of the plot, 90% width
    this.width = (this.$el.width()/100)*90;

    var x_units = ""
    var y_units = ""

    if(options && options.yvar && options.xvar) {      
      if (options.plotType == 'depthprofile'){   
        //Variables are backwards, beware
        this.xvariable = null
        var not_list = []
        $.each( options.yvar[0][0], function( key, value ) {
          if (value.indexOf("pressure") > -1){
            self.xvariable = value
            y_units = self.model.get('units')[self.xvariable]
          }else{
            not_list.push(value)
            x_units = self.model.get('units')[not_list[0]]
          }          
        });

        this.yvariable = not_list.join();  
        this.dpa_flag = "1"     //this.getDpaFlag(options.xvar)  
      }else{
        this.yvariable = options.yvar.join();
        this.xvariable = options.xvar;
        this.dpa_flag = this.getDpaFlag(options.yvar)  
      }
    }
    if(this.yvariable != null && this.xvariable != null) {
      this.useLine = options.useLine.toString();
      this.useScatter = options.useScatter.toString();  
      this.useEvent = options.useEvent.toString();      
      this.plotType = options.plotType;
      this.st = moment(options.start_date).toISOString()
      this.ed = moment(options.end_date).toISOString()      

      this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name + '?' + $.param({x_units:x_units,
                                                                                                    y_units:y_units,
                                                                                                    dpa_flag: this.dpa_flag,
                                                                                                    yvar: this.yvariable , 
                                                                                                    xvar: this.xvariable, 
                                                                                                    height: this.height, 
                                                                                                    width: this.width,
                                                                                                    scatter:this.useScatter,
                                                                                                    lines:this.useLine,
                                                                                                    event:this.useEvent, 
                                                                                                    plotLayout:this.plotType,
                                                                                                    startdate:this.st,                                                                                                    
                                                                                                    enddate:this.ed})
      this.fetch();
    }else{
      if (options.plotType == 'depthprofile'){ 
        $('#bottom-row #plot-view').append('<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">×</a><strong>Plot Warning!</strong> Depth profile requires "pressure" selection</div>')
      }
    }
  },
  download: function(options) {    
    this.reference_designator = this.model.get('reference_designator')    
    this.stream_name = this.model.get('stream_name')
    var yvar = this.yvariable
    var xvar = this.xvariable
    if('xvar'){
    }else{
      xvar = ["time"]
    } 

    //set the width of the plot, 90% width
    this.width = (this.$el.width()/100)*90;

    if(this.yvariable != null && this.xvariable != null) {            
      this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name + '?' + $.param({format: 'png', 
                                                                                                    dpa_flag: this.dpa_flag,
                                                                                                    yvar: this.yvariable , 
                                                                                                    xvar: this.xvariable, 
                                                                                                    height: this.height, 
                                                                                                    width: this.width,
                                                                                                    scatter:this.useScatter,
                                                                                                    lines:this.useLine,
                                                                                                    event:this.useEvent, 
                                                                                                    plotLayout:this.plotType,
                                                                                                    startdate:this.st,                                                                                                    
                                                                                                    enddate:this.ed})
      //window.open(this.url, '_blank');      

      var a = $("<a>")
          .attr("href", this.url)
          .attr("download", this.reference_designator + '_' + this.stream_name+".png")
          .appendTo("body");

      a[0].click();

      a.remove();

    }
  },
  render: function() {
    var self = this;
    /*
     * Hovers
     */
    this.$el.find('#PathCollection_1 > g > use')
    .mouseenter(function(e) {      
      self.$el.find(e.target).css('fill', '#0000ff');
    }).mouseleave(function(e) {
      self.$el.find(e.target).css('fill', '#fc8d62');
    }).click(function(e) {
      var i = $('#PathCollection_1 > g > use').index($(e.target));
      ooi.trigger('SVGPlotView:elementClick', i);
    });

    this.$el.find('#PathCollection_1 > g > use').tooltip({title: ""});
  }
});

var SVGPlotControlView = Backbone.View.extend({
  events: {
    'click #update-plot' : 'onClickPlot',
    'change #xvar-select' : 'xVarChange', 
    /*
    "switchChange.bootstrapSwitch .bootstrap-switch" : 'onClickPlot',
    'dp.change #start-date' : 'onClickPlot',
    'dp.change #end-date' : 'onClickPlot'
    */
  },
  initialize: function() { 
    
  },
  setModel: function(model,updateTimes) {
    var self = this;
    this.model = model;
    this.data = null;    
    /*
    this.model.getData({
      success: function(data, textStatus, jqXHR) {
        self.data = data.data;
        self.trigger('dataFetch', self.data);       
      }
    });
    */
    this.render(updateTimes);
  },
  template: JST['ooiui/static/js/partials/SVGPlotControl.html'],
  xVarChange: function(e) {    
    var plotType = $('#xvar-select option:selected').text();

    if (plotType=="Time Series"){
      this.$el.find('#xVarTooltip').attr('data-original-title',"Time Series plot for selected parameter.  You may overlay up to 6 other parameters.")
    }else if(plotType=="T-S Diagram"){
      this.$el.find('#xVarTooltip').attr('data-original-title',"The T-S diagram is a Temperature - Salinity Plot.  The UI uses the density of seawater equation of state to derive the density values.  The density values are shown with gradient lines in the plotting window. The user should select the Temperature and Salinity derived products from a single data stream for this plot to work properly.")
    }else if(plotType=="Depth Profile"){
      this.$el.find('#xVarTooltip').attr('data-original-title',"The Depth Profile plot uses the Pressure and/or Depth parameter from a data stream, as well as a maxima/minima extrema calculation, to determine singular depth profiles present in the data.  Users should select only a single parameter for this plot type.")
    }else if(plotType=="Quiver"){
      this.$el.find('#xVarTooltip').attr('data-original-title',"The Quiver plot is designed to be used with two velocitiy parameters.  This plot is used primarily with the Velocity Meters and the Acoustic Doppler Current Profilers.  This plot will provide an arrow to display the direction of the water movement, as well as a gray shadow to represent the magnitude.")
    }else if(plotType=="Rose"){
      this.$el.find('#xVarTooltip').attr('data-original-title',"The Rose Plot is designed to show the magnitude and direction of water currents and wind movement.  The direction should be represented as a value between 0 and 360.")
    }else if(plotType=="3D Colored Scatter"){
      this.$el.find('#xVarTooltip').attr('data-original-title',"The 3D Colored Scatter allows a user to select two parameters as the X and Y axes, then select a 3rd parameter to use as a color map for the plotted points.")
    }

  },
  onClickPlot: function(e) {    
    var data = {};
    
    data.start_date = this.$start_date_picker.getDate();
    data.end_date = this.$end_date_picker.getDate();
    data.xvar = this.$el.find('#xvar-select').val();
    //data.yvar = this.$el.find('#yvar-select').val();    
    data.plotType = $('#xvar-select option:selected').text();
    console.log(data.plotType)
    /*
    if (plotType == "Depth Profile"){
      data.plotType = "depthprofile"
      //data.yvar = this.$el.find('#xvar-select').val();
      data.xvar = this.$el.find('#yvar-select').val();

    }else{
      data.plotType = "timeseries"
    }*/

    data.useLine = "true"
    data.useScatter = "false"//this.$el.find('#plotting-enable-scatter').bootstrapSwitch('state');
    data.useEvent = this.$el.find('#plotting-enable-events').bootstrapSwitch('state');

    ooi.trigger('SVGPlotControlView:onClickPlot', data);
  },
  render: function(updateTimes) {
    var self = this
    if (updateTimes){
      this.$el.html(this.template({model: this.model}));
      this.$el.find('.selectpicker').selectpicker();
      this.$el.find('.bootstrap-switch').bootstrapSwitch();

      this.$el.find('[data-toggle="tooltip"]').tooltip()
    
      this.$start_date = this.$el.find('#start-date');
      this.$end_date = this.$el.find('#end-date');
    
    
      this.$start_date.datetimepicker({defaultDate : moment(this.model.get('start')),
                                       maxDate: moment(this.model.get('end'))
                                       });
      this.$end_date.datetimepicker({defaultDate : moment(this.model.get('end')),
                                     minDate: moment(this.model.get('start'))
                                    }); 

      this.$start_date_picker = this.$start_date.data('DateTimePicker');
      this.$end_date_picker = this.$end_date.data('DateTimePicker');
    }

    this.$type_select = this.$el.find('#type-select');

    
    var xvar = "time"
    var variables = this.model.get('variable_types');
    this.variable = null;
    for(var key in variables) {
      if(key.indexOf('timestamp') == -1 && (variables[key] == 'int' || variables[key] == 'float')) {
        this.variable = key;
        break;
      }
    }

    this.$el.find('#xvar-select').selectpicker('val', xvar);
    this.$el.find('#yvar-select').selectpicker('val', this.variable);
    
  }
});
