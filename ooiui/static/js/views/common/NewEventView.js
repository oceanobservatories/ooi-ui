"use strict"

var NewEventView = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this, "render", "show", "hide", "onSync", "onNewEvent", "onOperatorEventTypeSync", "onUserModelChange");
    this.conditions = {
      userChange: false,
      operatorEventTypes: false
    }
      
    if(options && options.watchModel && options.orgModel && options.operatorEventTypes && options.userModel) {
      this.watchModel = options.watchModel;
      this.orgModel = options.orgModel;
      this.operatorEventTypes = options.operatorEventTypes;
      this.listenTo(this.operatorEventTypes, 'sync', this.onOperatorEventTypeSync);
      this.userModel = options.userModel;
      this.listenTo(this.userModel, 'change', this.onUserModelChange);
    } else {
      console.error("Can't initialize new event view without necessary parameters");
    }
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
    this.orgModel.set('id', this.userModel.get('organization_id'));
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

    newEvent.set({
      event_title: this.$el.find('#newTitleInput').val(),
      event_comment: this.$el.find('#newCommentInput').val(),
      event_type: {
        id: this.$el.find('#event-type-selection option:selected').val()
      }
    });

    newEvent.save();
    this.hide();
    this.trigger('neweventview:newevent');
  },
  template:   JST["ooiui/static/js/partials/NewEvent.html"],
  render: function() {
    this.$el.html(this.template({
      orgModel: this.orgModel,
      operatorEventTypes: this.operatorEventTypes,
      userModel: this.userModel
    }));
    this.$el.find('#new-event-button').click(this.onNewEvent);
  }
})
