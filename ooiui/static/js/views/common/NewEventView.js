"use strict"

var NewEventView = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this, "render", "show", "hide", "onSync", "onNewEvent", "onOperatorEventTypeSync", "onUserModelChange", "onBob");
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
    console.log("I really can't figure this out");
  },
  onBob: function() {
    console.log("BOB");
  },
  onClick: function() {
    this.show();
  },
  onOperatorEventTypeSync: function() {
    console.log("onOperatorEventTypeSync");
    this.conditions.operatorEventTypes = true;
    this.onSync();
  },
  onUserModelChange: function() {
    console.log("onUserModelChange");
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
    console.log(this.conditions);
    if(this.conditions.operatorEventTypes && this.conditions.userChange) {
      this.render();
    }
  },
  show: function() {
    console.log("SHOW");
    this.$el.find('.modal.fade').modal('show');

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
    console.log("on new event");
    var newEvent = new EventModel();

    console.log(this.$el.find('#event-type-selection option:selected'));
    newEvent.set({
      event_title: this.$el.find('#newTitleInput').val(),
      event_comment: this.$el.find('#newCommentInput').val(),
      event_type: {
        id: this.$el.find('#event-type-selection option:selected').val()
      }
    });

    console.log();
    newEvent.save();
    console.log(newEvent.toJSON());
    this.hide();
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
