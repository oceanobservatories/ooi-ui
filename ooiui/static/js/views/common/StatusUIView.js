"use strict";



var StatusUIView = Backbone.View.extend({
  className: "panel",
  events: {
    'click #list-view' : 'onListView',
    'click #timeline-view' : 'onTableView',
  },
  initialize: function(options) {
    _.bindAll(this, "render", "onListView", "onTableView", "onSync", "onNewEventTrigger");
    this.viewSelection = 'table';
    this.listenTo(this.collection, "sync", this.onSync);
    this.listenTo(this.collection, "reset", this.onSync);
    this.render();
  },
   onListView: function() {
    this.viewSelection = 'list';
    this.render();
  },
  onTableView: function() {
    this.viewSelection = 'table';
    this.render();
  },
  onSync: function() {
    this.render();
  },
  template: JST['ooiui/static/js/partials/StatusUIIconEvent.html'],
  render: function() {
    this.$el.html(this.template());
    // Event List View
    if(this.viewSelection == 'list') {
      this.$el.find('#list-view').toggleClass('active');
      this.eventView = new EventListView({collection: this.collection});
    }
    // Timeline Event View
    else {
      this.$el.find('#table-view').toggleClass('active');
      this.eventView = new TimeLineEventView({collection: this.collection});
    }
    // Bind the sub-view
    this.$el.find('#panel-events').html(this.eventView.el);

  }
});

