"use strict";

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
            stacked:{val:1,condition:"=",message:"Must Select Z Component"},
            interpolated:{val:2,condition:"=",message:"Must X and Y Component"},
            _validate:function(name,length){
                return (length===0?false: (this[name].condition=="<=" ? length<=parseInt(this[name].val)
                    : parseInt(this[name].val)===length));
            }
        },

        _validateNumberOfSelected: function (plottype, selectlist){
            if(!this._selectedPrams._validate(plottype,selectlist.length)){
                $('#plot-view').append('<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">×</a><strong>Plot Warning!</strong> &nbsp;'+
                                       this._selectedPrams[plottype].message +'</div>');
                this.valid=false;
                return false;
            }else if(selectlist.length===0){
                $('#plot-view').append('<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">×</a><strong>Plot Warning!' +
                                       '</strong> &nbsp;Please select a parameter to plot</div>');
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
        var startDate = new Date(options.attributes.start);
        var endDate = new Date(options.attributes.end);
        try{
            if(startDate > endDate){
                throw "Bad Date Object";
            }
        }catch(e){
            console.log(e);
            this._selectedX.valid=false;
            $('#bottom-row #plot-view').append('<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">×</a><strong>Date Warning!</strong> &nbsp;' + 'Start Time must be less than End Time </div>');
            return false;
        }
        return true;
    },
    invalidParam:function(){return !this._selectedX.valid;},
    validateSelected:function(options){
        "use strict";
        var check2yvarplots = ['quiver', 'rose', 'ts_diagram', 'interpolated'],
            var1, var2, var3, yvar;

        if(!this._validateTimeSpan(options)) return false;

        if (options.attributes.data.plotType.toString().indexOf("_scatter")!=-1){
            var1 = $("#yvar1-select :selected").val();
            var2 = $("#yvar2-select :selected").val();
            var3 = $("#yvar3-select :selected").val();
            yvar = [];
            if (typeof var1 != 'undefined') yvar.push(var1);
            if (typeof var2 != 'undefined') yvar.push(var2);
            if (typeof var3 != 'undefined') yvar.push(var3);
            return this._selectedX._validateNumberOfSelected("scatter", yvar);
        }else if ($.inArray(options.attributes.data.plotType, check2yvarplots)!=-1) {
            var1 = $("#yvar1-select :selected").val();
            var2 = $("#yvar2-select :selected").val();
            yvar = [];
            if (typeof var1 != 'undefined') yvar.push(var1);
            if (typeof var2 != 'undefined')yvar.push(var2);
            return this._selectedX._validateNumberOfSelected(options.attributes.data.plotType, yvar);
        }else {
            return this._selectedX._validateNumberOfSelected(options.attributes.data.plotType, options.yvar[0][0]);
        }
    },
    validateMultiPlot:function(options){
        var _this= this;
        _this._selectedX.valid=true;
        var ddl=$('[id="parameters_id"]').selectpicker();
        try{
            for(var i=0;i<ddl.length;i++){
                if($(ddl[i]).data().selectpicker.val()!==null){
                    if($(ddl[i]).data().selectpicker.val().length>1) {
                        throw 'Too many Parameters Selected in list '+(i+1).toString();
                    }
                }else{
                    //second or more lists not completed
                    throw 'No Parameters Selected in list '+(i+1).toString();
                }
            }
        }catch(e){
            $('#bottom-row #plot-view').append('<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">×</a><strong>Plot Warning!</strong> &nbsp;'+ e.toString()+'</div>');
            _this._selectedX.valid=false;
        }
        return  _this._selectedX.valid;

    },
    getQAQC:function(){
        if($(".div-qa-qc").css("display")=="none") return 0;
        if($('.div-qa-qc input:checked').val()=='undefined')return 0;
        return parseInt($('.div-qa-qc input:checked').val().toString());
    },
    depthprofile:['pressure','temperature',],
    ts_diagram: ['temperature','salinity'],
    quiver:['pressure','temperature'],
    scatter:['temperature','salinity','pressure', 'conductivity'],
    rose:['temperature','salinity','pressure', 'conductivity','heading','pitch','roll','velocity','scale','vel']


}; //-----------------


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
        if (this.format === 'svg'){
            $.get(this.url,function(svgDoc) {
                var importedSVGRootElement = document.importNode(svgDoc.documentElement,true);
                self.$el.html(importedSVGRootElement);
                self.render();
            },"xml")
            .fail(function(e) {
                // any plot errors should be handled before we get to here.
                // this should be uframe alert here.
                self.$el.html(' ');
                var response = JSON.parse(e.responseText);
                $('#plot-view').append('<div class="alert alert-danger" role="alert"> <div><strong>'+response.error+'</strong><br>If the problem persists, please email <a href="mailTo:helpdesk@oceanobservatories.org">helpdesk@oceanobservatories.org</a></div></div>');
            })
            .always(function() {

            });
        }else{
            var image = new Image();
            $(image)
            .on('load', function() {
                self.$el.html(image);
            })
            .on('error', function() {
                // this should be uframe alert here.
                self.$el.html(' ');
                var error_msg = 'If the problem persists, please email <a href="mailTo:helpdesk@oceanobservatories.org">helpdesk@oceanobservatories.org</a>';
                $('#plot-view').append('<div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert">×</a><strong> Unexpected uFrame Return</strong><br>'+error_msg+'</div>');

            });
            image.src = this.url;
        }
    },
    initialRender: function() {
        this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-left:50%;font-size:90px;"> </i>');
    },
    render: function() {
    }
});

var SVGPlotView = SVGView.extend({
    setModel: function(options) {
        this.model = options;
    },
    getDpaFlag: function(var_list) {
        var self = this;
        var dpa_flag = "0";
        $.each(var_list, function( index, value ) {
            var func_type = self.model.get('variables_shape')[value];
            if (func_type == "function"){
                dpa_flag = "1";
            }
        });
        return dpa_flag;
    },
    validateSelected: function(options){
        return plotParameters.validateSelected(options);
    },
    plot: function(options) {
        //requested plot
        this.reference_designator = options.attributes.reference_designator;
        this.stream_name = options.attributes.stream_name;
        options.yvar = options.attributes.variables;
        options.xvar = ['time'];

        //set the width of the plot, 90% width
        this.width = (this.$el.width()/100)*90;
        this.height = this.width / 3;
        var x_units = "";
        var y_units = "";
        this.format = "svg";

        if(options && options.yvar && options.xvar) {
            if(!this.validateSelected(options)) return false;
            if (options.attributes.data.plotType == 'depthprofile'){
                //Variables are backwards, beware
                this.xvariable = null;
                var not_list = [];
                $.each( options.yvar[0][0], function( key, value ) {
                    if (value.indexOf("pressure") > -1){
                        this.xvariable = value;
                        y_units = options.attributes.units[self.xvariable];
                    }else{
                        not_list.push(value);
                        x_units = options.attributes.units[not_list[0]];
                    }
                });

                this.yvariable = not_list.join();
                this.dpa_flag = "1";     //this.getDpaFlag(options.xvar);
            }else if (options.attributes.data.plotType == 'ts_diagram'){
                this.yvariable = $("#yvar2-select option:selected").data('params') + ',' + $("#yvar1-select option:selected").data('params');
                this.xvariable = options.xvar;
                this.dpa_flag = this.getDpaFlag(options.yvar);
            }else if (options.attributes.data.plotType == 'quiver'){
                this.yvariable = $("#yvar1-select option:selected").data('params') + ',' + $("#yvar2-select option:selected").data('params');
                this.xvariable = options.xvar;
                this.dpa_flag = this.getDpaFlag(options.yvar);

            }else if (options.attributes.data.plotType == '3d_scatter'){
                this.yvariable = $("#yvar1-select option:selected").data('params') + ',' + $("#yvar2-select option:selected").data('params') + ',' + $("#yvar3-select option:selected").data('params');
                this.xvariable = options.xvar;
                this.dpa_flag = this.getDpaFlag(options.yvar);

            }else if (options.attributes.data.plotType == 'rose'){

                this.yvariable = $("#yvar1-select option:selected").data('params') + ',' + $("#yvar2-select option:selected").data('params');
                this.xvariable = options.xvar;
                this.dpa_flag = this.getDpaFlag(options.yvar);

            }else if (options.attributes.data.plotType == 'stacked'){
                this.format = "png";
                this.yvariable = $("#yvar1-select option:selected").data('params');
                this.xvariable = options.xvar;
                this.dpa_flag = this.getDpaFlag(options.yvar);

            }else{
                this.yvariable = options.yvar.join();
                this.xvariable = options.xvar;
                this.dpa_flag = this.getDpaFlag(options.yvar);
            }
        }
        if(this.yvariable !== null && this.xvariable !== null && !plotParameters.invalidParam()) {
            this.useLine = options.attributes.data.useLine.toString();
            this.useScatter = options.attributes.data.useScatter.toString();
            this.useEvent = options.attributes.data.useEvent.toString();
            this.plotType = options.attributes.data.plotType;

            this.st = options.attributes.data.start;
            this.ed = options.attributes.data.end;

            this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name + '?' + $.param({format: this.format,
                                                                                                         x_units:x_units,
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
            qaqc:plotParameters.getQAQC()});

            this.fetch();

        }else{
            if (options.attributes.data.plotType === 'depthprofile'){
                $('#bottom-row #plot-view').append('<div class="alert alert-warning fade in"><a href="#" class="close" data-dismiss="alert">×</a><strong>Plot Warning!</strong> Depth profile requires "pressure" selection</div>');
            }
        }
    },
    download: function(options) {
        this.reference_designator = this.model.get('reference_designator');
        this.stream_name = this.model.get('stream_name');
        var yvar = this.yvariable;
        var xvar = this.xvariable;
        if('xvar'){
        }else{
            xvar = ["time"];
        }

        //set the width of the plot, 90% width
        this.width = (this.$el.width()/100)*90;

        if(this.yvariable !== null && this.xvariable !== null) {
            this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name + '?' + $.param({format: 'png', dpa_flag: this.dpa_flag,
                                                                                                         yvar: this.yvariable,
            xvar: this.xvariable,
            height: this.height,
            width: this.width,
            scatter:this.useScatter,
            lines:this.useLine,
            event:this.useEvent,
            plotLayout:this.plotType,
            startdate:this.st,
            enddate:this.ed,
            qaqc:plotParameters.getQAQC()});
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
        this.reference_designator = this.model.get('reference_designator');
        this.stream_name = this.model.get('stream_name');
        var yvar = this.yvariable;
        var xvar = this.xvariable;
        if('xvar'){
        }else{
            xvar = ["time"];
        }
        if(this.yvariable !== null && this.xvariable !== null) {
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
        'click #download-data' : 'dataDownloads',
        'click #download-plot' : 'plotDownloads',
        'click #update-plot' : 'onClickPlot',
        'click #add-plot' : 'onClickAddPlot',
        'click #reset-time' : 'onResetTime',
        'click #clear-interp-params' : 'onClearParams',
        'change #xvar-select' : 'xVarChange',
        'change #yvar1-select' : 'yVar1Change',
        'change #yvar2-select' : 'yVar2Change',
        'change #yvar3-select' : 'yVar3Change',
        'switchChange.bootstrapSwitch .bootstrap-switch' : 'onSwitchChange',
        'change .div-qa-qc input[type=checkbox]':'onCheckChange',
        'change #time-range select': 'timeRangeChange',
        'click #start-date input': 'resetTimeRange',
        'click #end-date input': 'resetTimeRange',
        'change #paramVizCheck': 'onParamVizCheck'
    },
    initialize: function() {
        _.bindAll(this,"onParamVizCheck");
    },
    onSwitchChange: function(e,state){
        $(".div-qa-qc").css("display",state?"block":"none");
    },
    onParamVizCheck: function(e,state){
        var items = this.$el.find('.selectpicker');
        var paramBool = !(this.$el.find('#paramVizCheck').is(':checked'))

        _.each(items,function(item){
            if (!paramBool){
                $(item).find('.invalidParam').removeAttr('disabled','disabled');
            }else{
                $(item).find('.invalidParam').attr('disabled','disabled');
            }
        })

        this.$el.find('.selectpicker').selectpicker('refresh');
    },
    timeRangeChange: function() {
        var timeRangeDelta, timeChangedTo, startDate, endDate;

        // get the time in days to subtract from the end date.
        timeRangeDelta = this.$el.find('#time-range select').val();

        // reset the start and end date.
        endDate = moment.utc(this.model.get('end')).toJSON();
        startDate = moment.utc(this.model.get('start')).toJSON();

        // set the start date to be the time range delta from the selection.
        if (timeRangeDelta === "all") {
            startDate = moment.utc(this.model.get('start')).toJSON();
        } else {
            startDate = moment.utc(this.model.get('end')).subtract(timeRangeDelta,'hours').toJSON();
        }

        // set the fields.
        this.$end_date_picker.setDate(endDate);
        this.$start_date_picker.setDate(startDate);

    },
    resetTimeRange: function() {
        $(".plot-range-fields #time-range > select").val("Reset").change();
    },
    //set ony 1 checkbox
    onCheckChange:function(v){
        if (v.currentTarget.checked) {
            $('.div-qa-qc input[type=checkbox]').not($(v.currentTarget)).prop('checked', false);
        }
    },
    onClearParams: function(){
        // Remove the saved attributes and update dropdowns
        delete this.model.attributes.reference_designator1;
        delete this.model.attributes.reference_designator2;
        delete this.model.attributes.stream_name1;
        delete this.model.attributes.stream_name2;
        this.$el.find('#yvar1-select').val([]);
        this.$el.find('#yvar2-select').val([]);
        this.$el.find('#yvar1-select').html(this.$el.find('#yvar2-select').html());
        this.$el.find('#yvar2-select').attr('disabled', true);
        this.$el.find('.selectpicker').selectpicker('refresh');
    },
    //DEPRECATED
    updateYVarDropdown: function(){
        // This function copies parameters from parameters_id to the 3 yVar
        // dropdowns for the advanced plots
        this.$el.find("#yvar1-select").html($("#parameters_id").html());
        this.$el.find("#yvar2-select").html($("#parameters_id").html());
        this.$el.find("#yvar3-select").html($("#parameters_id").html());
        this.$el.find('.selectpicker').selectpicker('refresh');
    },
    setModel: function(model, updateTimes) {
        var self = this;
        this.model = model;
        this.data = null;
        this.render(updateTimes);
    },
    template: JST['ooiui/static/js/partials/SVGPlotControl.html'],
    plotDownloads: function(e) {
        event.preventDefault();
        if ($('#highcharts-row-section').css('display')=="block"){
            var chart = $('#highcharts-view').highcharts();
            var fileName = chart.title.textStr + '_' + chart.subtitle.textStr;
            chart.exportChart({type: 'image/png', filename: fileName});
        }else{
            ooi.trigger('ooi:downloadPlot');
        }
    },
    dataDownloads: function(e) {
        event.preventDefault();
        ooi.trigger('ooi:downloadData');
        var timeRange, startTime, endTime;
        timeRange = $('.plot-control #time-range > select').val();
        startTime = $('#start-date > input').val();
        endTime = $('#end-date > input').val();
        $('#time-range > select').val(timeRange).change();
        $('#start-date > input').val(startTime).change();
        $('#end-date > input').val(endTime).change();

    },
    getPlotType: function() {
        return $('#xvar-select option:selected').text();
    },
    xVarChange: function(e) {
        var plotType = $('#xvar-select option:selected').text();
        $('#yvar2-select').attr('disabled', false);
        this.$el.find('.selectpicker').selectpicker('refresh');
        if ( plotType == "Select" ) {
            plotType = 'Time Series';
        }
        // Hide the add plot button
        this.$el.find('#add-plot').css('display','none');
        // Hide the clear params button
        this.$el.find('#clear-interp-params').css('display','none');

        if (plotType=="Time Series"){
            if ($.trim($('#highcharts-view').html() ).length){
                this.$el.find('#add-plot').css('display','');
            }
            this.$el.find('#xVarTooltip').attr('data-original-title',"Time Series plot for selected parameter.  You may overlay up to 6 other parameters.");
            this.$el.find('#plotting-enable-events').attr('disabled', true);
            this.$el.find('#yvar0-selection-default').show();
            this.$el.find('#yvar1-selection').hide();
            this.$el.find('#yvar1-select-text').text('Select Y');
            this.$el.find('#yvar2-selection').hide();
            this.$el.find('#yvar3-selection').hide();

        }else if(plotType=="Stacked Time Series"){
            this.$el.find('#xVarTooltip').attr('data-original-title',"The stacked time series plot is a 2D colored plot that plots bins (Y-axis) against time (X-axis) using color spectrum for the value. The user should select just 1 appropriate derived products with 2D data (ie. ADCP, VADCP, and SPKIR) for this plot to work properly.");

            this.$el.find('#plotting-enable-events').attr('disabled', true);
            //this.updateYVarDropdown();
            this.$el.find('#yvar0-selection-default').hide();
            this.$el.find('#yvar1-selection').show();
            this.$el.find('#yvar1-select').attr('data-max-options','1');
            this.$el.find('#yvar1-select-text').text("Select Z");
            this.$el.find('#yvar2-selection').hide();
            this.$el.find('#yvar3-selection').hide();

        }else if(plotType=="T-S Diagram"){
            this.$el.find('#xVarTooltip').attr('data-original-title',"The T-S diagram is a Temperature - Salinity Plot.  The UI uses the density of seawater equation of state to derive the density values.  The density values are shown with gradient lines in the plotting window. The user should select the Temperature and Salinity derived products from a single data stream for this plot to work properly.");

            this.$el.find('#plotting-enable-events').attr('disabled', true);
            //this.updateYVarDropdown();
            this.$el.find('#yvar0-selection-default').hide();
            this.$el.find('#yvar1-selection').show();
            this.$el.find('#yvar1-select').attr('data-max-options','1');
            this.$el.find('#yvar1-select-text').text("Temperature");
            this.$el.find('#yvar2-selection').show();
            this.$el.find('#yvar2-select-text').text("Salinity");
            this.$el.find('#yvar3-selection').hide();

        }else if(plotType=="Depth Profile"){
            this.$el.find('#xVarTooltip').attr('data-original-title',"The Depth Profile plot uses the Pressure and/or Depth parameter from a data stream, as well as a maxima/minima extrema calculation, to determine singular depth profiles present in the data.  Users should select only a single parameter for this plot type.");

            this.$el.find('#plotting-enable-events').attr('disabled', true);
            this.$el.find('#yvar0-selection-default').hide();
            this.$el.find('#yvar1-selection').show();
            this.$el.find('#yvar1-select').attr('data-max-options','2');
            this.$el.find('#yvar2-selection').hide();
            this.$el.find('#yvar3-selection').hide();

        }else if(plotType=="Quiver"){
            this.$el.find('#xVarTooltip').attr('data-original-title',"The Quiver plot is designed to be used with two velocitiy parameters.  This plot is used primarily with the Velocity Meters and the Acoustic Doppler Current Profilers.  This plot will provide an arrow to display the direction of the water movement, as well as a gray shadow to represent the magnitude.");

            this.$el.find('#plotting-enable-events').attr('disabled', true);
            //this.updateYVarDropdown();
            this.$el.find('#yvar0-selection-default').hide();
            this.$el.find('#yvar1-selection').show();
            this.$el.find('#yvar1-select-text').text("U-Component");
            this.$el.find('#yvar1-select').attr('data-max-options','1');
            this.$el.find('#yvar2-selection').show();
            this.$el.find('#yvar2-select-text').text("V-Component");
            this.$el.find('#yvar3-selection').hide();

        }else if(plotType=="Rose"){
            this.$el.find('#xVarTooltip').attr('data-original-title',"The Rose Plot is designed to show the magnitude and direction of water currents and wind movement.  The direction should be represented as a value between 0 and 360.");

            this.$el.find('#plotting-enable-events').attr('disabled', true);
            //this.updateYVarDropdown();
            this.$el.find('#yvar0-selection-default').hide();
            this.$el.find('#yvar1-selection').show();
            this.$el.find('#yvar1-select').attr('data-max-options','1');
            this.$el.find('#yvar1-select-text').text("Magnitude");
            this.$el.find('#yvar2-selection').show();
            this.$el.find('#yvar2-select-text').text("Direction");
            this.$el.find('#yvar3-selection').hide();

        }else if(plotType=="3D Colored Scatter"){
            this.$el.find('#xVarTooltip').attr('data-original-title',"The 3D Colored Scatter allows a user to select two parameters as the X and Y axes, then select a 3rd parameter to use as a color map for the plotted points.");

            this.$el.find('#plotting-enable-events').attr('disabled', true);
            //this.updateYVarDropdown();
            this.$el.find('#yvar0-selection-default').hide();
            this.$el.find('#yvar1-selection').show();
            this.$el.find('#yvar1-select').attr('data-max-options','1');
            this.$el.find('#yvar1-select-text').text("X-Component");
            this.$el.find('#yvar2-selection').show();
            this.$el.find('#yvar2-select-text').text("Y-Component");
            this.$el.find('#yvar3-selection').show();
            this.$el.find('#yvar3-select-text').text("Color");

        }else if(plotType=="Interpolated"){
            this.$el.find('#clear-interp-params').attr('style', 'display: inline-block');
            this.$el.find('#xVarTooltip').attr('data-original-title',"The Interpolated plot allows a user to plot parameters from 2 different streams as the X and Y axes on the scatter plot. The Y parameter is interpolated to the same time stamps as the data in the X parameter.");

            this.$el.find('#plotting-enable-events').attr('disabled', true);
            //this.updateYVarDropdown();
            this.$el.find('#yvar0-selection-default').hide();
            this.$el.find('#yvar1-selection').show();
            this.$el.find('#yvar1-select').attr('data-max-options','1');
            this.$el.find('#yvar1-select-text').text("X-Component");
            this.$el.find('#yvar2-selection').show();
            this.$el.find('#yvar2-select').attr('data-max-options','1');
            this.$el.find('#yvar2-select-text').text("Y-Component");
            if (!this.model.attributes.hasOwnProperty('reference_designator1')){
                this.$el.find('#yvar2-select').attr('disabled', true);
            }
            this.$el.find('#yvar3-selection').hide();
        }
    },
    yVar1Change: function(e) {
        var selectedParam = this.$el.find( "#yvar1-select option:selected").data('params');
        $("#parameters_id").val(selectedParam);
        $("#parameters_id").change();
        $("#parameters_id").selectpicker('refresh');
        var plotType = this.$el.find('#xvar-select option:selected').text();
        if(plotType=="Interpolated"){
            ooi.trigger('SVGPlotControlView:onInterpolatedSelection1', this.model);
        }
    },
    yVar2Change: function(e) {
        var selectedParam = this.$el.find( "#yvar2-select option:selected").data('params');
        $("#parameters_id").val(selectedParam);
        $("#parameters_id").change();
        $("#parameters_id").selectpicker('refresh');
        var plotType = this.$el.find('#xvar-select option:selected').text();
        if(plotType=="Interpolated"){
            ooi.trigger('SVGPlotControlView:onInterpolatedSelection2', this.model);
        }
    },
    yVar3Change: function(e) {
        var selectedParam = this.$el.find( "#yvar3-select option:selected").data('params');
        $("#parameters_id").val(selectedParam);
        $("#parameters_id").change();
        $("#parameters_id").selectpicker('refresh');
    },
    onResetTime: function(e){
        this.$start_date.data("DateTimePicker").setDate(moment.utc(this.model.get('start')).format("YYYY-MM-DD HH:mm:ss"));
        this.$end_date.data("DateTimePicker").setDate(moment.utc(this.model.get('end')).format("YYYY-MM-DD HH:mm:ss"));
        this.$el.find("#decimatedWarn").css("color","#767676");
    },
    onClickAddPlot: function(e) {
        this.$el.find("#decimatedWarn").css({'-webkit-animation' : 'altrclr 3s 3 alternate','color' : 'red'});
        var data = {};
        data.start_date = moment.utc(this.$start_date.data('date'));
        data.end_date = moment.utc(this.$end_date.data('date'));
        data.xvar = this.$el.find('#xvar-select').val();
        //data.yvar = this.$el.find('#yvar-select').val();
        data.plotType = this.$el.find('#xvar-select option:selected').text();
        data.useLine = "true";
        data.useScatter = "false";
        data.useEvent = this.$el.find('#plotting-enable-events').bootstrapSwitch('state');
        this.model.set('data',data);
        ooi.trigger('SVGPlotControlView:onAddClickPlot', this.model);
    },
    onClickPlot: function(e) {
        this.$el.find("#decimatedWarn").css({'-webkit-animation' : 'altrclr 3s 3 alternate','color' : 'red'});
        var data = {};
        data.start_date = moment.utc(this.$start_date.data('date'));
        data.end_date = moment.utc(this.$end_date.data('date'));
        data.xvar = this.$el.find('#xvar-select').val();
        //data.yvar = this.$el.find('#yvar-select').val();
        data.plotType = this.$el.find('#xvar-select option:selected').text();

        if (data.plotType == 'Time Series'){
            this.$el.find('#add-plot').css('display','');
        }
        data.useLine = "true";
        data.useScatter = "false";
        data.useEvent = this.$el.find('#plotting-enable-events').bootstrapSwitch('state');
        this.model.set('data',data);
        ooi.trigger('SVGPlotControlView:onClickPlot', this.model);
    },
    render: function(updateTimes) {
        var self = this;
        var xvar = this.$el.find('#xvar-select').find(":selected").val();

        if (updateTimes){
            if (xvar != 'interpolated'){
                this.$el.html(this.template({model: this.model}));
                this.$el.find('.bootstrap-switch').bootstrapSwitch();
            }

            this.$el.find('.selectpicker').selectpicker();

            this.$el.find('[data-toggle="tooltip"]').tooltip();

            this.$start_date = this.$el.find('#start-date');
            this.$end_date = this.$el.find('#end-date');

            var startDate = moment.utc(this.model.get('start')).toJSON();
            var endDate = moment.utc(this.model.get('end')).toJSON();

            this.$start_date.datetimepicker({defaultDate : startDate,
                                            minDate: startDate,
                                            maxDate: endDate,
                                            format: "YYYY-MM-DD HH:mm:ss",
                                            sideBySide: true
            });
            this.$end_date.datetimepicker({defaultDate : endDate,
                                          minDate: startDate,
                                          maxDate: endDate,
                                          format: "YYYY-MM-DD HH:mm:ss",
                                          sideBySide: true
            });

            this.$start_date_picker = this.$start_date.data('DateTimePicker');
            this.$end_date_picker = this.$end_date.data('DateTimePicker');

            this.$el.find('#start-date').data("DateTimePicker").setDate(startDate);
            this.$el.find('#end-date').data("DateTimePicker").setDate(endDate);

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
            //      this.$el.find('#xvar-select').selectpick('val', xvar);
        }
        this.$el.find('#yvar-select').selectpicker('val', this.variable);

        this.xVarChange();
        this.timeRangeChange();
    }
});
