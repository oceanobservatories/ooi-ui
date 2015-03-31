var SVGView = Backbone.View.extend({
  initialize: function(options) {
    if(options && options.height && options.width) {
      this.height = options.height;
      this.width = options.width;
    } else {
      console.error("SVGView needs height and width");
    }
    this.initialRender();
  },
  fetch: function() {
    var self = this;
    this.initialRender();
    console.log("Fetching " + this.url);
    $.get(this.url,
      function(svgDoc) {
        var importedSVGRootElement = document.importNode(svgDoc.documentElement,true);
        self.$el.html(importedSVGRootElement);
        self.render();
      },
      "xml");
  },
  initialRender: function() {
    console.log("Plot should be a spinner");
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-left:50%;font-size:90px;"> </i>');
  },
  render: function() {
  }
});

var SVGPlotView = SVGView.extend({
  setModel: function(model) {
    this.model = model;
    this.reference_designator = this.model.get('reference_designator')
    this.stream_name = this.model.get('stream_name')
    var variables = this.model.get('variable_types');
    this.variable = null;
    for(var key in variables) {
      if(key.indexOf('timestamp') == -1 && (variables[key] == 'int' || variables[key] == 'float')) {
        this.variable = key;
        break;
      }
    }
    if(this.variable != null) {
      //done on first render, i.e inital conditions      
      var useLine = "True"
      var useScatter = "False"
      var plotLayoutType = "timeseries"

      this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name + '?' + $.param({start_time: this.st, end_time: this.ed,
                                                                                                    yvar: this.variable, 
                                                                                                    height: this.height, 
                                                                                                    width: this.width, 
                                                                                                    scatter:useScatter,
                                                                                                    lines:useLine, 
                                                                                                    plotLayout:plotLayoutType })
      console.log("reg url",this.url)
      this.fetch();
    }
  },
  plot: function(options) {
    //requested plot
    this.reference_designator = this.model.get('reference_designator')
    this.stream_name = this.model.get('stream_name')
    if(options && options.yvar && options.xvar) {
      this.yvariable = options.yvar;
      this.xvariable = options.xvar;
    }
    if(this.yvariable != null && this.xvariable != null) {
      this.useLine = options.useLine.toString();
      this.useScatter = options.useScatter.toString();      
      this.plotType = options.plotType;
      this.st = moment(options.start_date).toISOString()
      this.ed = moment(options.end_date).toISOString()

      this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name + '?' + $.param({yvar: this.yvariable , 
                                                                                                    xvar: this.xvariable, 
                                                                                                    height: this.height, 
                                                                                                    width: this.width,
                                                                                                    scatter:this.useScatter,
                                                                                                    lines:this.useLine, 
                                                                                                    plotLayout:this.plotType,
                                                                                                    start_date:this.st,
                                                                                                    end_date:this.ed})
      this.fetch();
    }
  },
  download: function() {
    if(this.variable != null) {
      this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name + '?' + $.param({start_time: this.st, end_time: this.ed,format: 'png', 
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

    this.$el.find('#PathCollection_1 > g > use').tooltip({title: "bob"});
  }
});

var SVGPlotControlView = Backbone.View.extend({
  events: {
    'change #xvar-select' : 'onClickPlot',
    'change #yvar-select' : 'onClickPlot',
    "switchChange.bootstrapSwitch .bootstrap-switch" : 'onClickPlot',
    'dp.change #start-date' : 'onClickPlot',
    'dp.change #end-date' : 'onClickPlot'
  },
  initialize: function() { 
  },
  setModel: function(model) {
    var self = this;
    this.model = model;
    this.data = null;

    this.model.getData({
      success: function(data, textStatus, jqXHR) {
        self.data = data.data;
        self.trigger('dataFetch', self.data);       
      }
    });
    console.log("DATA",self.data)
    this.render();
  },
  template: JST['ooiui/static/js/partials/SVGPlotControl.html'],
  onClickPlot: function(e) {    
    var data = {};
    
    data.start_date = this.$start_date_picker.getDate();
    data.end_date = this.$end_date_picker.getDate();
    data.xvar = this.$el.find('#xvar-select').val();
    data.yvar = this.$el.find('#yvar-select').val();    

    if (data.xvar== "pressure"){
      data.plotType = "depthprofile"
      data.yvar = "pressure"
      data.xvar = this.$el.find('#yvar-select').val();

    }else{
      data.plotType = "timeseries"
    }

    data.useLine = this.$el.find('#plotting-enable-line').bootstrapSwitch('state');
    data.useScatter = this.$el.find('#plotting-enable-scatter').bootstrapSwitch('state');

    ooi.trigger('SVGPlotControlView:onClickPlot', data);
  },
  render: function() {
    var self = this
    this.$el.html(this.template({model: this.model}));
    this.$el.find('.selectpicker').selectpicker();
    this.$el.find('.bootstrap-switch').bootstrapSwitch();

    this.$start_date = this.$el.find('#start-date');
    this.$end_date = this.$el.find('#end-date');
    this.$start_date.datetimepicker({defaultDate : this.model.get('start'),
                                                maxDate: this.model.get('end')});
    this.$end_date.datetimepicker({defaultDate : this.model.get('end'),
                                                minDate: this.model.get('start')}); 

    this.$start_date_picker = this.$start_date.data('DateTimePicker');
    this.$end_date_picker = this.$end_date.data('DateTimePicker');

    this.$type_select = this.$el.find('#type-select');


    this.st = this.$start_date_picker.getDate();
    this.ed = this.$end_date_picker.getDate();
    
    
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
