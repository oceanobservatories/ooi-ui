"use strict";
/*
* ooiui/static/js/views/common/EventListView.js
* View definitions an accordion style for event views
*
* Dependencies
* Partials
* - ooiui/static/js/partials/Event.html
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
* Models
* - ooiui/static/js/models/common/EventModel.js
*
* Usage
*/

var EventView = Backbone.View.extend({
  className: "panel",
  events: {
    'click #list-view' : 'onListView',
    'click #timeline-view' : 'onTimelineView',
    'click #new-event-link' : 'onNewEvent'
  },
  initialize: function(options) {
    _.bindAll(this, "render", "onListView", "onTimelineView", "onSync", "onNewEventTrigger");
    this.viewSelection = 'timeline';
    this.listenTo(this.collection, "sync", this.onSync);
    this.listenTo(this.collection, "reset", this.onSync);
    this.newEventView = new NewEventView();
    this.listenTo(ooi, 'neweventview:newevent', this.onNewEventTrigger);
    this.render();
  },
  onNewEventTrigger: function() {
    this.collection.fetch({
      data: $.param({watch_id: ooi.models.watchModel.get('id')}),
    });
  },
  onNewEvent: function() {
    if(this.newEventView === null) {
      console.error("This button should be disabled");
    } else {
      this.newEventView.show();
    }
  },
  onListView: function() {
    this.viewSelection = 'list';
    this.render();
  },
  onTimelineView: function() {
    this.viewSelection = 'timeline';
    this.render();
  },
  onSync: function() {
    this.render();
  },
  template: JST['ooiui/static/js/partials/Event.html'],
  render: function() {
    this.$el.html(this.template());
    // Event List View
    if(this.viewSelection == 'list') {
      this.$el.find('#list-view').toggleClass('active');
      this.eventView = new EventListView({collection: this.collection});
    } 
    // Timeline Event View
    else {
      this.$el.find('#timeline-view').toggleClass('active');
      this.eventView = new TimeLineEventView({collection: this.collection});
    }
    // Bind the sub-view
    this.$el.find('#panel-events').html(this.eventView.el);

    // NewEventView
    if(this.newEventView !== null) {
      this.$el.find('#new-event-modal').html(this.newEventView.el);
      this.newEventView.onSync();
    }
  }
});

