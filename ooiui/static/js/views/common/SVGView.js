
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
    console.log("plot...")
    this.reference_designator = this.model.get('reference_designator')    
    this.stream_name = this.model.get('stream_name')
    options.yvar = this.model.get('yvariable')  
    if('xvar' in options){
    }else{
      options.xvar = ["time"]
    } 

    //set the width of the plot, 90% width
    this.width = (this.$el.width()/100)*90;

    if(options && options.yvar && options.xvar) {      
      if (options.plotType == 'depthprofile'){        
        this.xvariable = options.xvar.join();
        this.yvariable = options.yvar;      
        this.dpa_flag = this.getDpaFlag(options.xvar)  
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
  download: function() {
    if(this.variable != null) {
      this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name + '?' + $.param({format: 'png', 
                                                                                                    yvar: this.variable, 
                                                                                                    height: this.height, 
                                                                                                    width: this.width })
      window.location.href = this.url;
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
    /*
    "switchChange.bootstrapSwitch .bootstrap-switch" : 'onClickPlot',
    'dp.change #start-date' : 'onClickPlot',
    'dp.change #end-date' : 'onClickPlot'
    */
  },
  initialize: function() { 
    
  },
  setModel: function(model) {
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
    this.render();
  },
  template: JST['ooiui/static/js/partials/SVGPlotControl.html'],
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
  render: function() {
    var self = this
    this.$el.html(this.template({model: this.model}));
    this.$el.find('.selectpicker').selectpicker();
    this.$el.find('.bootstrap-switch').bootstrapSwitch();

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

    this.$type_select = this.$el.find('#type-select');

    //this.$el.find('#xvar-select').prop('disabled', 'disabled');
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
