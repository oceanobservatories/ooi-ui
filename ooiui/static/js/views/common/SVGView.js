var SVGView = Backbone.View.extend({
  initialize: function(options) {
    if(options && options.height && options.width) {
      this.height = options.height;
      this.width = options.width;
    } else {
      console.error("SVGView needs height and width");
    }
  },
  fetch: function() {
    var self = this;
    console.log("Attempting to fetch " +this.url);
    $.get(this.url,
      function(svgDoc) {
        var importedSVGRootElement = document.importNode(svgDoc.documentElement,true);
        self.$el.html(importedSVGRootElement);
        console.log("おい");
        self.render();
      },
      "xml");
  },
  render: function() {
  }
});

var SVGPlotView = SVGView.extend({
  setModel: function(model) {
    console.log("Trying to set this");
    this.model = model;
    console.log(model.attributes);
    this.reference_designator = this.model.get('reference_designator')
    this.stream_name = this.model.get('stream_name')
    var variables = this.model.get('variables');
    var badNames = [
      "quality_flag",
      "preferred_timestamp",
      "stream_name",
      "internal_timestamp",
      "driver_timestamp"
    ]
    for(var i = 0; i < variables.length; i++) {
      if(badNames.indexOf(variables[i]) == -1) {
        this.variable = variables[i];
        break;
      }
    }
    this.url = '/svg/plot/' + this.reference_designator + '/' + this.stream_name + '?' + $.param({yvar: this.variable, height: this.height, width: this.width })
    this.fetch();
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
      console.log("I clicked the " + i + "th point");
    });

    this.$el.find('#PathCollection_1 > g > use').tooltip({title: "bob"});
  }
});

var SVGPlotControlView = Backbone.View.extend({
  events: {
    'change #var-select select': 'onSelect'
  },
  initialize: function() {
  },
  setModel: function(model) {
    this.model = model;
    this.render();
  },
  template: JST['ooiui/static/js/partials/SVGPlotControl.html'],
  onSelect: function(e) {
    console.log($(e.target).val());
  },
  render: function() {
    this.$el.html(this.template({model: this.model}));
    this.$el.find('.selectpicker').selectpicker();
  }
});
