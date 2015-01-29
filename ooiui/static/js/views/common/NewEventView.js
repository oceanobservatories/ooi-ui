"use strict"

var NewEventView = Backbone.View.extend({
  initialize: function() {

    _.bindAll(this, "render", "show", "hide");
    this.render();
  },
  onClick: function() {
    this.show();
  },
  // show: function() {
  //   console.log("show");
  //   this.$el.find('.modal').modal('show');
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
    this.$el.find('.newEventUser-message').html('John Doe');
    this.$el.find('.newEventOrg-message').html('EasternOcean Platforms, Inc.');

    console.log("#usrInput");

    return this;
    // this.$el.find('.modal').modal('show');
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
