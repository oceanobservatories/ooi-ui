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
  initialize: function() {
    _.bindAll(this, "render", "onListView", "onTimelineView", "onSync");
    this.viewSelection = 'list';
    this.collection.on('sync', this.onSync);
    this.newEventView = new NewEventView();
    
   
    this.render();
  },
  onNewEvent: function() {
    console.log("onNewEvent");
    this.newEventView.show();
  },
  onListView: function() {
    console.log("List View");
    this.viewSelection = 'list';
    this.render();
  },
  onTimelineView: function() {
    console.log("Timeline View");
    this.viewSelection = 'timeline';
    this.render();
  },
  onSync: function() {
    console.log("EventView onSync");
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
    this.$el.find('#new-event-modal').html(this.newEventView.el);
  }
});

