var SVGView = Backbone.View.extend({
  initialize: function(options) {
    if(options && options.url) {
      this.url = options.url;
      this.fetch();
    } else {
      console.error("SVG View needs a url");
    }
  },
  fetch: function() {
    var self = this;
    $.get(this.url,
      function(svgDoc) {
        var importedSVGRootElement = document.importNode(svgDoc.documentElement,true);
        self.$el.html(importedSVGRootElement);
        self.render();
      },
      "xml");
  },
  render: function() {
  }
});

var SVGPlotView = SVGView.extend({
  render: function() {
    var self = this;
    /*
     * Hovers
     */
    this.$el.find('#PathCollection_1 > g > use').mouseenter(function(e) {
      self.$el.find(e.target).css('fill', '#ff0000');
    }).mouseleave(function(e) {
      self.$el.find(e.target).css('fill', '#0000ff');
    }).click(function(e) {
      var i = $('#PathCollection_1 > g > use').index($(e.target));
      ooi.trigger('SVGPlotView:elementClick', i);
      console.log("I clicked the " + i + "th point");
    });

    this.$el.find('#PathCollection_1 > g > use').tooltip({title: "bob"});
  }
});
