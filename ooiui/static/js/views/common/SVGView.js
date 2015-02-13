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
      this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name + '?' + $.param({yvar: this.variable, height: this.height, width: this.width })
      this.fetch();
    }
  },
  plot: function(options) {
    this.reference_designator = this.model.get('reference_designator')
    this.stream_name = this.model.get('stream_name')
    if(options && options.yvar) {
      this.variable = options.yvar;
    }
    if(this.variable != null) {
      this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name + '?' + $.param({yvar: this.variable, height: this.height, width: this.width })
      this.fetch();
    }
  },
  download: function() {
    if(this.variable != null) {
      this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name + '?' + $.param({format: 'png', yvar: this.variable, height: this.height, width: this.width })
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
    'change #yvar-select' : 'onClickPlot'
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
        console.log(data.data[100]);
      }
    });
    this.render();
  },
  template: JST['ooiui/static/js/partials/SVGPlotControl.html'],
  onClickPlot: function(e) {
    var data = {};
    data.start_date = this.$start_date_picker.getDate();
    data.end_date = this.$end_date_picker.getDate();
    data.xvar = this.$el.find('#xvar-select').val();
    data.yvar = this.$el.find('#yvar-select').val();
    ooi.trigger('SVGPlotControlView:onClickPlot', data);
  },
  render: function() {
    this.$el.html(this.template({model: this.model}));
    this.$el.find('.selectpicker').selectpicker();

    var xvar = this.model.get('preferred_timestamp');
    
    this.$el.find('#start-date').datetimepicker();
    this.$el.find('#end-date').datetimepicker();
    this.$start_date = this.$el.find('#start-date');
    this.$end_date = this.$el.find('#end-date');
    this.$type_select = this.$el.find('#type-select');
    this.$start_date_picker = this.$start_date.data('DateTimePicker');
    this.$end_date_picker = this.$end_date.data('DateTimePicker');
    this.$start_date_picker.setDate( this.model.get('start'));
    this.$end_date_picker.setDate( this.model.get('end'));
    
    this.$el.find('#xvar-select').prop('disabled', 'disabled');
    this.$el.find('#xvar-select').selectpicker('val', xvar);
  }
});
