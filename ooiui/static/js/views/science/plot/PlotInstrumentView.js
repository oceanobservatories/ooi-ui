/*
 * ooiui/static/js/views/science/plot/PlotInstrumentView.js
 * Simple List view for the selected streams
 *
 * Collection:
 *  - ooiui/static/js/models/science/StreamModel
 *  - StreamCollection subset
 */

var PlotInstrumentView = Backbone.View.extend({
  subviews: [],
  events: {
  },
  initialize: function() {
    this.initialRender();
  },
  initialRender: function() {
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:40px;margin-left:40%;font-size:90px;"> </i>');
  },
  template: JST['ooiui/static/js/partials/science/plot/PlotInstruments.html'],
  render:function(){
    //base render class
    var self = this;
    this.$el.html(this.template());

    //this.collection = selected stream collection
    if (this.collection.length == 0){
      self.emptyRender();
    }else{
      this.collection.each(function(model) {
        var subview = new PlotInstrumentViewItem({
          model: model
        });
        self.$el.find('tbody.table-contents').append(subview.$el);
        self.subviews.push(subview);
      });
    }

  },
  emptyRender:function(){
    this.$el.html('<h5>Please Select an instrument</h5>');
  }
});

var PlotInstrumentViewItem = Backbone.View.extend({
  className: 'plot-instrument-view-item',
  tagName:"tr",
  events: {
  },
  initialize: function() {
    this.render();
  },
  template: JST['ooiui/static/js/partials/science/plot/PlotInstrumentsItem.html'],
  render:function(){
    //base render class
    var self = this;
    console.log(this.model);
    this.$el.html(this.template({model:this.model}));
  }
});
