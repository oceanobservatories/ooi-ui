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
    //this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:40px;margin-left:40%;font-size:90px;"> </i>');
    this.emptyRender();
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
  events:{
    "click .instrument-to-plot" : "onRemoveClick"
  },
  initialize: function() {
    this.render();
  },
  template: JST['ooiui/static/js/partials/science/plot/PlotInstrumentsItem.html'],
  render:function(){
    var self = this;
    this.$el.html(this.template({model:this.model}));
  },
  onRemoveClick:function(evt){
    var modelList = collection.where({'ref_des': $(evt.target).data('ref_des'),'stream_name': $(evt.target).data('stream_name')});
    if (!_.isUndefined(modelList) && modelList.length > 0){
      ooi.trigger('remove_catalog_model',{model:modelList[0]});
      var rowId = $(evt.target).data('ref_des')+$(evt.target).data('stream_name');
      var currentRowData = $dcGrid.getRowData(rowId);
      currentRowData.actions = currentRowData.actions.replace('fa fa-minus-square','fa-plus-square')
      $dcGrid.setRowData(rowId,currentRowData);
    }
  }
});
