"use strict"

var NewEventView = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this, "render", "show", "hide", "onSync", "onNewEvent", "onOperatorEventTypeSync", "onUserModelChange");
    this.conditions = {
      userChange: false,
      operatorEventTypes: false
    }
    this.listenTo(ooi.collections.operatorEventTypes, 'sync', this.onOperatorEventTypeSync);
    this.listenTo(ooi.models.userModel, 'change', this.onUserModelChange);
  },
  onClick: function() {
    this.show();
  },
  onOperatorEventTypeSync: function() {
    this.conditions.operatorEventTypes = true;
    this.onSync();
  },
  onUserModelChange: function() {
    this.orgModel = new OrganizationModel();
    var self = this;
    this.orgModel.set('id', ooi.models.userModel.get('organization_id'));
    this.orgModel.fetch({
      success: function(model, response, options) {
        self.conditions.userChange = true; 
        self.onSync();
      }
    });
  },
  onSync: function() {
    if(this.conditions.operatorEventTypes && this.conditions.userChange) {
      this.render();
    }
  },
  show: function() {
    this.$el.find('.modal.fade').modal('show');

    return this;
    // this.$el.find('.modal').modal('show');
  },
  hide: function() {

    $('#newEventModal').modal('hide');
    return this;
  },
  onNewEvent: function() {
    var newEvent = new EventModel();
    var event_type = this.$el.find('#event-type-selection option:selected').val();
    if(event_type == '--Choose Type--') {
      this.$el.find('.new-event-message').text('Please select an event type');
      return this;
    }
    newEvent.set({
      event_title: this.$el.find('#newTitleInput').val(),
      event_comment: this.$el.find('#newCommentInput').val(),
      event_type: {
        id: this.$el.find('#event-type-selection option:selected').val()
      }
    });

    newEvent.save();
    this.hide();
    ooi.trigger('neweventview:newevent');
    return this;
  },
  template:   JST["ooiui/static/js/partials/NewEvent.html"],
  render: function() {
    this.$el.html(this.template({
      orgModel: this.orgModel,
      operatorEventTypes: ooi.collections.operatorEventTypes,
      userModel: ooi.models.userModel
    }));
    this.$el.find('#new-event-button').click(this.onNewEvent);
  }
})
