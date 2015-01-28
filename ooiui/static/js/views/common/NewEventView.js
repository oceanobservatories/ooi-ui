"use strict"

var NewEventView = Backbone.View.extend({
  className: "pull-right",
  events: {
    'click #new-event-link' : 'onClick',
    'click #btn-new-event' : 'onNewEvent',
    'click #list-view' : 'onListView',
    'click #timeline-view' : 'onTimelineView',
  },
  initialize: function() {
    _.bindAll(this, "render");
    this.render();
  },
  onClick: function() {
    this.show();
  },
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
