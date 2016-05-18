"use strict";
/*
 * ooiui/static/js/views/science/AnnotationTableView.js
 * View definitions to build a table view of streams
 *
 * Dependencies
 * CSS:
 * - ooiui/static/css/common/AnnotationTableView.css
 * Partials:
 * - ooiui/static/js/partials/AnnotationTable.html
 * - ooiui/static/js/partials/AnnotationTableItem.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */

var AnnotationTableView = Backbone.View.extend({
  className: "annotationTableView",
  events:{
    "click #addAnnotation"   : "onAddClick"
  },
  columns: [
      {
        name : 'ui_id',
        label : 'Annotation ID' //not the same as the uframe id
      },
      {
        name : 'annotation',
        label : 'Annotation'
      },
      {
        name : 'referenceDesignator',
        label : 'Reference Designator'
      },
      {
        name : 'beginDT',
        label : 'Start Date'
      },
      {
        name : 'endDT',
        label : 'End Date'
      }
  ],
  initialize: function() {
    _.bindAll(this, "render");
  },
  template: JST['ooiui/static/js/partials/AnnotationTable.html'],
  onAddClick: function(event) {
    event.stopPropagation();
    ooi.trigger('AnnotationTableView:onAddClick');
  },
  emptyRender:function(){
    this.$el.html('<h5>Please Select an instrument</h5>');
  },
  render: function() {
    var self = this;
    this.$el.html(this.template({collection: this.collection, columns: this.columns}));

    this.collection.each(function(model, i) {
      model.set('ui_id',i)

      var streamTableItemView = new AnnotationTableItemView({
        columns: self.columns,
        model: model
      });
      self.$el.find('tbody').append(streamTableItemView.el);
    });
  }
});

var AnnotationTableItemView = Backbone.View.extend({
  tagName: 'tr',
  events: {
    'click' : 'onClick'
  },
  initialize: function(options) {
    if(options && options.columns) {
      this.columns = options.columns;
    }
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },
  onClick: function(event) {
    event.stopPropagation();
    ooi.trigger('AnnotationTableItemView:onClick', this.model);
  },
  template: JST['ooiui/static/js/partials/AnnotationTableItem.html'],
  render: function() {
    this.$el.html(this.template({model: this.model, columns: this.columns}));
  }
});

