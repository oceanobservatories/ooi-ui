"use strict";
/*
 * ooiui/static/js/views/aa/AlertToggleNotificationModalFormView.js
 * View for event acknowledgement modal
 */

var AlertToggleNotificationModalFormView = ModalFormView.extend({
  bindings: {

  },
  events: {
    "click #toggleNotification": "onSubmit",
    "change input[name='alertalarm']": "updatedType"
  },
  initialize: function() {
    _.bindAll(this, "render","onSubmit");
    // Intentionally left blank to override parent
  },
  initialRender:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  template: JST['ooiui/static/js/partials/AlertToggleNotificationModalForm.html'],
  onSubmit: function(e) {
    var self = this;

    //stop the page redirect
    e.preventDefault();

    //console.log('id from modal form after submit: ', this.model.get('id'));

    ooi.trigger('alertToggleNotification:update', this.model);

// TODO: Set the redmine ticket field
/*    if (this.model.get('active') == 0) {
      this.model.set('active', true);
    } else {
      this.model.set('active', false);
    }

    // Sends ack
    this.model.save(null,{success: function(model, response, opts) {
      console.log('Notification Toggled OK!');
    },
      error: function(model, response, opts) {
        console.log('Notification Toggled Error!');
      }
    });*/
      this.hide();
  },
  render: function() {
    var self = this;

    this.$el.html(this.template({
      model: this.model,
      metadata_collection: this.metadata_collection
    }));
  }
});
