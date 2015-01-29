"use strict"

var NewEventView = Backbone.View.extend({
  initialize: function() {
<<<<<<< HEAD
    console.log("NewEventView initialized");
    _.bindAll(this, "render");
=======
    _.bindAll(this, "render", "show", "hide");
>>>>>>> bbec69c... watch-view_fixed css issues for newEvents modal_cleanned up code for login modal
    this.render();
  },
  onClick: function() {
    this.show();
  },
<<<<<<< HEAD
  show: function() {
    console.log("show");
    this.$el.find('.modal').modal('show');
=======
  onListView: function(){
    $('#list-view').addClass('active')
    $('#timeline-view').removeClass('active')
    $('#panelEvents').empty()
  },
  onTimelineView: function(){
    $('#timeline-view').addClass('active');
    $('#list-view').removeClass('active')
    $('#panelEvents').empty()
  },
  show: function() {
    $('#newEventModal').modal('show');
    return this;
    // this.$el.find('.modal').modal('show');
>>>>>>> bbec69c... watch-view_fixed css issues for newEvents modal_cleanned up code for login modal
  },
  hide: function() {
    console.log("hide was called");

    $('#newEventModal').modal('hide');
    return this;
    // this.$el.find('.modal').modal('hide');
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
    this.$el.html(this.template({}));
  }
})
