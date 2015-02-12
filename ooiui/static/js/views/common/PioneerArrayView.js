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
  },
  initialize: function(options) {
    _.bindAll(this, "render", "onListView", "onSync");
    this.listenTo(this.collection, "sync", this.onSync);
    this.listenTo(this.collection, "reset", this.onSync);
    this.newEventView = new NewEventView();
    this.listenTo(ooi, 'neweventview:newevent', this.onNewEventTrigger);
    this.render();
  },

  onListView: function() {
    this.viewSelection = 'list';
    this.render();
  },
  onSync: function() {
    this.render();
  },
  template: JST['ooiui/static/js/partials/PioneerArray.html'],
  render: function() {
    this.$el.html(this.template());
    // Event List View
    if(this.viewSelection == 'list') {
      this.$el.find('#list-view').toggleClass('active');
      this.eventView = new EventListView({collection: this.collection});
    }

    // Bind the sub-view
    this.$el.find('#panel-events').html(this.eventView.el);

    // NewEventView ?????????
    if(this.newEventView !== null) {
      this.$el.find('#new-event-modal').html(this.newEventView.el);
      this.newEventView.onSync();
    }
  }
});
