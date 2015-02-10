"use strict";
/*
 * ooiui/static/js/views/science/StreamTableView.js
 * View definitions to build a table view of streams
 *
 * Dependencies
 * Partials: 
 * - ooiui/static/js/partials/StreamTable.html
 * - ooiui/static/js/partials/StreamTableItem.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */

var StreamTableView = Backbone.View.extend({
  columns: [
      {
        name : 'stream_name',
        label : 'Stream Identifier'
      },
      {
        name : 'reference_designator',
        label : 'Reference Designator'
      },
      {
        name : 'json_download',
        label : 'Download URL'
      },
      {
        name : 'start',
        label : 'Start Time'
      },
      {
        name : 'end',
        label : 'End Time'
      }
  ],
  initialize: function() {
    _.bindAll(this, "render");
    this.listenTo(this.collection, 'reset', this.render);
  },
  template: JST['ooiui/static/js/partials/StreamTable.html'],
  render: function() {
    var self = this;
    this.$el.html(this.template({collection: this.collection, columns: this.columns}));
    this.collection.each(function(model) {
      var streamTableItemView = new StreamTableItemView({
        columns: self.columns,
        model: model
      });
      self.$el.find('tbody').append(streamTableItemView.el);
    });
  }
});

var StreamTableItemView = Backbone.View.extend({
  tagName: 'tr',
  events: {
    'click' : 'onClick'
  },
  initialize: function(options) {
    _.bindAll(this, "render", "onClick");
    if(options && options.columns) {
      this.columns = options.columns;
    }
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },
  onClick: function(event) {
    event.stopPropagation();
    console.log(this.model.attributes);
  },
  template: JST['ooiui/static/js/partials/StreamTableItem.html'],
  render: function() {
    this.$el.html(this.template({model: this.model, columns: this.columns}));
  }
});
