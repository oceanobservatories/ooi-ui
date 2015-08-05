//--------------- validation
var plotParameters ={

  timeseries:[
    'conductivity',
    'temperature',
    'pressure',
    'dofst_k_oxygen',
    'raw_signal_chl',
    'salinity',
    'pressure_variance',
    'water_velocity_east',
    'water_velocity_north',
    'water_velocity_up',
    'sci_water_cond',
    'sci_water_pressure',
    'sci_water_temp',
    'pressure_temp',
    'optode_temperature',
    'estimated_oxygen_concentration',
    'estimated_oxygen_saturation',
    'cdomflo',
    'chlaflo',
    'ntuflo',
    'num_wavelengths',
    'pressure_depth',
    'temp_compensated_phase',
    'optode_temperature',
    'raw_signal_chl',
    'nitrate_concentration',
    'nutnr_nitrogen_in_nitrate',
    'nutnr_absorbance_at_254_nm',
    'nutnr_absorbance_at_350_nm',
    'nutnr_bromide_trace',
    'nutnr_spectrum_average',
    'humidity',
    'ctd_psu',
    'ctd_temp',
    'ctd_dbar',
    'speed_of_sound',
    'velpt_pressure',
    'water_direction',
    'average_wave_height',
    'mean_spectral_period',
    'max_wave_height',
    'significant_wave_height',
    'significant_period',
    'wave_height_10',
    'wave_period_10',
    'mean_wave_period',
    'peak_wave_period',
    'wave_period_tp5',
    'wave_height_hmo',
    'mean_direction',
    'mean_spread',
    'fdchp_wind_x',
    'fdchp_wind_y',
    'fdchp_wind_z',
    'fdchp_speed_of_sound_sonic',
    'x_ang_rate',
    'y_ang_rate',
    'z_ang_rate',
    'fdchp_x_accel_g',
    'fdchp_y_accel_g',
    'fdchp_z_accel_g'
      ],

  _selectedX:{
    valid:true,
    _selectedPrams:{
        timeseries:{val:6,condition:"<=",message:"No More than 6 Parameters"},
        ts_diagram:{val:2,condition:"=",message:"Must Select Temperature and Salinity"},
        depthprofile:{val:2,condition:"=",message:"Must Select 2 Parameters"},
        quiver:{val:2,condition:"=",message:"Must Select U- and V-Components"},
        rose:{val:2,condition:"=",message:"Must Select Magnitude and Direction"},
        scatter:{val:3,condition:"=",message:"Must Select X, Y, and Color Components"},
        _validate:function(name,length){return (length==0?false: (this[name].condition=="<="
                                            ? length<=parseInt(this[name].val)
                                            : parseInt(this[name].val)==length));}
    },

    _validateNumberOfSelected: function (plottype,selectlist){
         if(!this._selectedPrams._validate(plottype,selectlist.length)){
          $('#bottom-row #plot-view').append('<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">×</a><strong>Plot Warning!</strong> &nbsp;'+
          this._selectedPrams[plottype].message +'</div>');
          this.valid=false;
          return false;
         }else{this.valid=true; return true;}
    }
  },
  _isInArray:function(value, array) {
      for (var j=0; j<array.length; j++){
        var isMatch = value.search(array[j]);
        if(value.search(array[j]) > -1){
            return true;
        }
      }
    },
  _validateTimeSpan: function (options){
   this._selectedX.valid=true;
   try{
    if(options.end_date.isBefore(options.start_date)){
      throw "Bad Date Object";
    }
    }catch(e){
      this._selectedX.valid=false;
       $('#bottom-row #plot-view').append('<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">×</a><strong>Date Warning!</strong> &nbsp;'
       + 'Start Time must be less than End Time </div>');
      return false;
    }
    return true;
  },
  invalidParam:function(){return !this._selectedX.valid},
  validateSelected:function(options){
    var check2yvarplots = ['quiver', 'rose', 'ts_diagram'];
    
    if(!this._validateTimeSpan(options)) return false;
    
    if (options.plotType.toString().indexOf("_scatter")!=-1){
      var var1 = $("#yvar1-select :selected").text();
      var var2 = $("#yvar2-select :selected").text();
      var var3 = $("#yvar3-select :selected").text();
      var yvar = [];
      if ( var1 != 'undefined' ) yvar.push(var1);
      if ( var2 != 'undefined' ) yvar.push(var2);
      if ( var3 != 'undefined' ) yvar.push(var3);
      return this._selectedX._validateNumberOfSelected("scatter", yvar)
    }else if ($.inArray(options.plotType, check2yvarplots)!=-1) {
      var var1 = $("#yvar1-select :selected").text();
      var var2 = $("#yvar2-select :selected").text();
      var yvar = [];
      if ( var1 != 'undefined' ) yvar.push(var1);
      if ( var2 != 'undefined' ) yvar.push(var2);
      return this._selectedX._validateNumberOfSelected(options.plotType, yvar)
    }else {
      return this._selectedX._validateNumberOfSelected(options.plotType, options.yvar[0][0])
    };

  },
  validateMultiPlot:function(options){
    var _this= this;
    _this._selectedX.valid=true;
    var ddl=$('[id="parameters_id"]').selectpicker();
    try{
         for(var i=0;i<ddl.length;i++){
            if($(ddl[i]).data().selectpicker.val()!=null){
                if($(ddl[i]).data().selectpicker.val().length>1) {
                  throw 'To many Parameters Selected in list '+(i+1).toString();
                }
            }else{
                //second or more lists not completed
                  throw 'No Parameters Selected in list '+(i+1).toString();
            }
         }
     }catch(e){
        $('#bottom-row #plot-view').append('<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">×</a><strong>Plot Warning!</strong> &nbsp;'
            + e.toString()+'</div>');
        _this._selectedX.valid=false;
     }
    return  _this._selectedX.valid;

    },
  getQAQC:function(){
      if($(".div-qa-qc").css("display")=="none") return 0
      if($('.div-qa-qc input:checked').val()=='undefined')return 0
      return parseInt($('.div-qa-qc input:checked').val().toString())
  },
  depthprofile:['pressure','temperature',],
  ts_diagram: ['temperature','salinity'],
  quiver:['pressure','temperature'],
  scatter:['temperature','salinity','pressure', 'conductivity'],
  rose:['temperature','salinity','pressure', 'conductivity','heading','pitch','roll','velocity','scale','vel']


};
//-----------------


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
    // console.log("Fetching " + this.url);
    $.get(this.url,function(svgDoc) {
        var importedSVGRootElement = document.importNode(svgDoc.documentElement,true);
        self.$el.html(importedSVGRootElement);
        self.render();
      },"xml")
      .fail(function(e) {
         console.log(e);
         //any plot errors should be handled before we get to here.
         // this should be uframe alert here.
         self.$el.html(' ');
         if (e.status == 400){
         $('#plot-view').append('<div id="warning" class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">×</a><strong> Error:' + e.status +' </strong>' +e.responseText+ '</div>');
         }
         else if (e.status == 500){
         $('#plot-view').append('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">×</a><strong> Error:' + e.status +' </strong>' +e.responseText+ '</div>');
         }
         else{
         $('#plot-view').append('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">×</a><strong> Error:' + e.status +' </strong>' +e.responseText+ '</div>');
         }
        // self.$el.html('<i class="fa fa-exclamation-triangle" style="margin-left:50%;font-size:90px;"> </i>');
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
    // console.log("set Model")
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
    // console.log("plot...")
    if(!plotParameters.validateMultiPlot(options)) return false;
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
                                                                                                    enddate:this.ed,
                                                                                                    qaqc:plotParameters.getQAQC()})
      this.fetch();
    }
  },
  plot: function(options) {
    //requested plot
    var self = this;
    // console.log("plot...")
    this.reference_designator = this.model.get('reference_designator')
    this.stream_name = this.model.get('stream_name')
    options.yvar = this.model.get('yvariable')
    // console.log(options.yvar);

    if('xvar' in options){
      options.xvar = ["time"]
    }else{
      options.xvar = ["time"]
    }

    //set the width of the plot, 90% width
    this.width = (this.$el.width()/100)*90;

    var x_units = "";
    var y_units = "";

    if(options && options.yvar && options.xvar) {
      if(!plotParameters.validateSelected(options)) return false;
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
      }else if (options.plotType == 'ts_diagram'){
        this.yvariable = $("#yvar2-select option:selected").val() + ',' + $("#yvar1-select option:selected").val()
        this.xvariable = options.xvar;
        this.dpa_flag = this.getDpaFlag(options.yvar)
      }else if (options.plotType == 'quiver'){
        this.yvariable = $("#yvar1-select option:selected").val() + ',' + $("#yvar2-select option:selected").val()
        this.xvariable = options.xvar;
        this.dpa_flag = this.getDpaFlag(options.yvar)
      
      }else if (options.plotType == '3d_scatter'){
        this.yvariable = $("#yvar1-select option:selected").val() + ',' + $("#yvar2-select option:selected").val() + ',' + $("#yvar3-select option:selected").val()
        this.xvariable = options.xvar;
        this.dpa_flag = this.getDpaFlag(options.yvar)

      }else if (options.plotType == 'rose'){
        this.yvariable = $("#yvar1-select option:selected").val() + ',' + $("#yvar2-select option:selected").val()
        this.xvariable = options.xvar;
        this.dpa_flag = this.getDpaFlag(options.yvar)

      }else{
        this.yvariable = options.yvar.join();
        this.xvariable = options.xvar;
        this.dpa_flag = this.getDpaFlag(options.yvar)
      }
    }
    if(this.yvariable != null && this.xvariable != null && !plotParameters.invalidParam()) {
      this.useLine = options.useLine.toString();
      this.useScatter = options.useScatter.toString();
      this.useEvent = options.useEvent.toString();
      this.plotType = options.plotType;
      this.st = moment.utc(options.start_date).toISOString()
      this.ed = moment.utc(options.end_date).toISOString()

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
                                                                                                    enddate:this.ed,
                                                                                                    qaqc:plotParameters.getQAQC()})
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
                                                                                                    enddate:this.ed,
                                                                                                    qaqc:plotParameters.getQAQC()})
      //window.open(this.url, '_blank');

      var a = $("<a>")
          .attr("href", this.url)
          .attr("download", this.reference_designator + '_' + this.stream_name+".png")
          .appendTo("body");

      a[0].click();

      a.remove();

    }
  },
  downloadData: function(options) {
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
      this.url = '/api/uframe/get_netcdf/' + this.stream_name + '/' + this.reference_designator + '/' + this.st + '/' + this.ed;
      //window.open(this.url, '_blank');

      var a = $("<a>")
          .attr("href", this.url)
          .attr("download", this.reference_designator + '_' + this.stream_name+".nc")
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
    'change #yvar1-select' : 'yVar1Change',
    'change #yvar2-select' : 'yVar2Change',
    'change #yvar3-select' : 'yVar3Change',
    'switchChange.bootstrapSwitch .bootstrap-switch' : 'onSwitchChange',
    'change .div-qa-qc input[type=checkbox]':'onCheckChange'
    /*
    "switchChange.bootstrapSwitch .bootstrap-switch" : 'onClickPlot',
    'dp.change #start-date' : 'onClickPlot',
    'dp.change #end-date' : 'onClickPlot'
    */
  },
  initialize: function() {
    //_.bindAll(this,"onSwitchChange");
  },
  onSwitchChange: function(e,state){
    $(".div-qa-qc").css("display",state?"block":"none")
  },

  //set ony 1 checkbox
  onCheckChange:function(v){
      if (v.currentTarget.checked) {
            $('.div-qa-qc input[type=checkbox]').not($(v.currentTarget)).prop('checked', false);
        }

  },
  updateYVarDropdown: function(){
      // This function copies parameters from parameters_id to the 3 yVar 
      // dropdowns for the advanced plots
      this.$el.find("#yvar1-select").html($("#parameters_id").html());
      this.$el.find("#yvar2-select").html($("#parameters_id").html());
      this.$el.find("#yvar3-select").html($("#parameters_id").html());
      this.$el.find('.selectpicker').selectpicker('refresh');
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

      $('#parameters_id').parent().show();
      this.$el.find('#plotting-enable-events').attr('disabled', false);
      this.$el.find('#yvar1-selection').hide();
      this.$el.find('#yvar2-selection').hide();
      this.$el.find('#yvar3-selection').hide();
    }else if(plotType=="T-S Diagram"){
      this.$el.find('#xVarTooltip').attr('data-original-title',"The T-S diagram is a Temperature - Salinity Plot.  The UI uses the density of seawater equation of state to derive the density values.  The density values are shown with gradient lines in the plotting window. The user should select the Temperature and Salinity derived products from a single data stream for this plot to work properly.")

      $('#parameters_id').parent().hide();
      this.$el.find('#plotting-enable-events').attr('disabled', true);
      this.updateYVarDropdown();
      this.$el.find('#yvar1-selection').show();
      this.$el.find('#yvar1-select-text').text("Temperature");
      this.$el.find('#yvar2-selection').show();
      this.$el.find('#yvar2-select-text').text("Salinity");
      this.$el.find('#yvar3-selection').hide();

    }else if(plotType=="Depth Profile"){
      this.$el.find('#xVarTooltip').attr('data-original-title',"The Depth Profile plot uses the Pressure and/or Depth parameter from a data stream, as well as a maxima/minima extrema calculation, to determine singular depth profiles present in the data.  Users should select only a single parameter for this plot type.")
      
      $('#parameters_id').parent().show();
      this.$el.find('#plotting-enable-events').attr('disabled', true);
      this.$el.find('#yvar1-selection').hide();
      this.$el.find('#yvar2-selection').hide();
      this.$el.find('#yvar3-selection').hide();

    }else if(plotType=="Quiver"){
      this.$el.find('#xVarTooltip').attr('data-original-title',"The Quiver plot is designed to be used with two velocitiy parameters.  This plot is used primarily with the Velocity Meters and the Acoustic Doppler Current Profilers.  This plot will provide an arrow to display the direction of the water movement, as well as a gray shadow to represent the magnitude.")
      
      $('#parameters_id').parent().hide();
      this.$el.find('#plotting-enable-events').attr('disabled', true);
      this.updateYVarDropdown();
      this.$el.find('#yvar1-selection').show();
      this.$el.find('#yvar1-select-text').text("U-Component");
      this.$el.find('#yvar2-selection').show();
      this.$el.find('#yvar2-select-text').text("V-Component");
      this.$el.find('#yvar3-selection').hide();

    }else if(plotType=="Rose"){
      this.$el.find('#xVarTooltip').attr('data-original-title',"The Rose Plot is designed to show the magnitude and direction of water currents and wind movement.  The direction should be represented as a value between 0 and 360.")
      
      $('#parameters_id').parent().hide();
      this.$el.find('#plotting-enable-events').attr('disabled', true);
      this.updateYVarDropdown();
      this.$el.find('#yvar1-selection').show();
      this.$el.find('#yvar1-select-text').text("Magnitude");
      this.$el.find('#yvar2-selection').show();
      this.$el.find('#yvar2-select-text').text("Direction");
      this.$el.find('#yvar3-selection').hide();

    }else if(plotType=="3D Colored Scatter"){
      this.$el.find('#xVarTooltip').attr('data-original-title',"The 3D Colored Scatter allows a user to select two parameters as the X and Y axes, then select a 3rd parameter to use as a color map for the plotted points.")
      
      $('#parameters_id').parent().hide();
      this.$el.find('#plotting-enable-events').attr('disabled', true);
      this.updateYVarDropdown();
      this.$el.find('#yvar1-selection').show();
      this.$el.find('#yvar1-select-text').text("X-Component");
      this.$el.find('#yvar2-selection').show();
      this.$el.find('#yvar2-select-text').text("Y-Component");
      this.$el.find('#yvar3-selection').show();
      this.$el.find('#yvar3-select-text').text("Color");
    }
  },
  yVar1Change: function(e) {
    var selectedParam = this.$el.find( "#yvar1-select option:selected").val()
    $("#parameters_id").val(selectedParam);
    $("#parameters_id").change();
    $("#parameters_id").selectpicker('refresh');
  },
  yVar2Change: function(e) {
    var selectedParam = this.$el.find( "#yvar2-select option:selected").val()
    $("#parameters_id").val(selectedParam);
    $("#parameters_id").change();
    $("#parameters_id").selectpicker('refresh');
  },
  yVar3Change: function(e) {
    var selectedParam = this.$el.find( "#yvar3-select option:selected").val()
    $("#parameters_id").val(selectedParam);
    $("#parameters_id").change();
    $("#parameters_id").selectpicker('refresh');
  },
  onClickPlot: function(e) {
    var data = {};

    data.start_date = moment.utc(this.$start_date.data('date'));
    data.end_date = moment.utc(this.$end_date.data('date'));
    data.xvar = this.$el.find('#xvar-select').val();
    //data.yvar = this.$el.find('#yvar-select').val();
    data.plotType = this.$el.find('#xvar-select option:selected').text();
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
    var xvar = this.$el.find('#xvar-select').find(":selected").val()

    if (updateTimes){
      this.$el.html(this.template({model: this.model}));
      this.$el.find('.selectpicker').selectpicker();
      this.$el.find('.bootstrap-switch').bootstrapSwitch();

      this.$el.find('[data-toggle="tooltip"]').tooltip()

      this.$start_date = this.$el.find('#start-date');
      this.$end_date = this.$el.find('#end-date');


      this.$start_date.datetimepicker({defaultDate : moment(this.model.get('start')),
                                       minDate: moment(this.model.get('start')),
                                       maxDate: moment(this.model.get('end')),
                                       format: "YYYY-MM-DD HH:mm:ss",
                                       sideBySide: true
                                       });
      this.$end_date.datetimepicker({defaultDate : moment(this.model.get('end')),
                                     minDate: moment(this.model.get('start')),
                                     maxDate: moment(this.model.get('end')),
                                     format: "YYYY-MM-DD HH:mm:ss",
                                     sideBySide: true
                                    });

      this.$start_date_picker = this.$start_date.data('DateTimePicker');
      this.$end_date_picker = this.$end_date.data('DateTimePicker');
    }

    this.$type_select = this.$el.find('#type-select');
    
    var variables = this.model.get('variable_types');
    this.variable = null;
    for(var key in variables) {
      if(key.indexOf('timestamp') == -1 && (variables[key] == 'int' || variables[key] == 'float')) {
        this.variable = key;
        break;
      }
    }

    // var xvar = "time"
    if (xvar){
      this.$el.find('#xvar-select').selectpicker('val', xvar);
    }
    this.$el.find('#yvar-select').selectpicker('val', this.variable);

  }
});
