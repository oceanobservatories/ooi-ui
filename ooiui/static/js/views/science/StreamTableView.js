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
        name : 'start',
        label : 'Start Time'
      },
      {
        name : 'end',
        label : 'End Time'
      },
      {
        name : 'json_download',
        label : 'Download JSON'
      },
      {
        name : 'profile_json_download',
        label : 'Download Profile JSON'
      },
      {
        name : 'netcdf_download',
        label : 'Download NetCDF'
      },
      {
        name : 'csv_download',
        label : 'Download CSV'
      }
  ],
  initialize: function() {
    _.bindAll(this, "render");
    this.listenTo(this.collection, 'reset', this.render);
  },
  template: JST['ooiui/static/js/partials/StreamTable.html'],
  search: function(searchTerm) {
    var self = this;
    this.$el.html(this.template({collection: this.collection, columns: this.columns}));
    _.each(this.collection.search(searchTerm), function(model) {
      var streamTableItemView = new StreamTableItemView({
        columns: self.columns,
        model: model
      });
      self.$el.find('tbody').append(streamTableItemView.el);
    });
  },
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
    'click a.json_download' : 'onJSONDownload',
    'click a.profile_json_download' : 'onProfileJSONDownload',
    'click a.netcdf_download' : 'onNetCDFDownload',
    'click a.csv_download' : 'onCSVDownload',
    'click' : 'onRowClick'
  },
  initialize: function(options) {
    if(options && options.columns) {
      this.columns = options.columns;
    }
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },
  onCSVDownload: function(event) {
    event.stopPropagation();
    ooi.trigger('StreamTableItemView:onClick', {model: this.model, selection: 'csv'});
  },
  onJSONDownload: function(event) {
    event.stopPropagation();
    ooi.trigger('StreamTableItemView:onClick', {model: this.model, selection: 'json'});
  },
  onProfileJSONDownload: function(event) {
    event.stopPropagation();
    ooi.trigger('StreamTableItemView:onClick', {model: this.model, selection: 'profile_json_download'});
  },
  onNetCDFDownload: function(event) {
    event.stopPropagation();
    ooi.trigger('StreamTableItemView:onClick', {model: this.model, selection: 'netcdf'});
  },
  onRowClick: function(event) {
    event.stopPropagation();
    ooi.trigger('StreamTableItemView:onRowClick', this);
  },
  focus: function() {
    console.log("Trying to focus");
    this.$el.addClass('highlight').siblings().removeClass('highlight');
  },
  template: JST['ooiui/static/js/partials/StreamTableItem.html'],
  render: function() {
    this.$el.html(this.template({model: this.model, columns: this.columns}));
  }
});
