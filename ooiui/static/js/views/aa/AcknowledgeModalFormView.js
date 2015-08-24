"use strict";
/*
 * ooiui/static/js/views/aa/AcknowledgeModalFormView.js
 * View for event acknowledgement modal
 */

var AcknowledgeModalFormView = ModalFormView.extend({
  bindings: {

  },
  events: {
    "click #addDef": "onSubmit",
    "change input[name='alertalarm']": "updatedType"
  },
  initialize: function() {
    _.bindAll(this, "render","onSubmit");
    // Intentionally left blank to override parent
  },
  initialRender:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  template: JST['ooiui/static/js/partials/AcknowledgeModalForm.html'],
  onSubmit: function(e) {
    var self = this;

    //stop the page redirect
    e.preventDefault();

    var ackModel = new AlertAckModel();
    ackModel.set('id', this.model.get('id'));
    ackModel.set('uframe_event_id', this.model.get('uframe_event_id'));
    ackModel.set('uframe_filter_id', this.model.get('uframe_filter_id'));
    ackModel.set('system_event_definition_id', this.model.get('system_event_definition_id'));
    ackModel.set('event_type', this.model.get('event_type'));
    ackModel.set('ack_by', 1); //TODO Needs a real user here

    // Sends ack
    ackModel.save(null,{success: function(model, response, opts) {
      console.log('Acknowledged OK!');
    },
      error: function(model, response, opts) {
        console.log('Acknowledge Error!');
      }
    });
      this.hide();
  },
  render: function() {
    var self = this;

    this.$el.html(this.template({
      model: this.model
    }));
  }
});
