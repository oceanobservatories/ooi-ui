"use strict"

var NewEventView = Backbone.View.extend({
  initialize: function() {
    console.log("NewEventView initialized");
    _.bindAll(this, "render");
    this.render();
  },
  onClick: function() {
    this.show();
  },
  show: function() {
    console.log("show");
    this.$el.find('.modal').modal('show');
  },
  hide: function() {
    this.$el.find('.modal').modal('hide');
  },
  onNewEvent: function() {
    /*
    var newEvent = new EventModel();

    newEvent.set({
      event_title: $('#event-title').value(),
      event_comment: $('#event-comment').value(),
      watch_id: ...
    });
    newEvent.save();
    */
    this.hide();
  },
  template:   JST["ooiui/static/js/partials/NewEvent.html"],
  render: function() {
    this.$el.html(this.template());
  }
})
