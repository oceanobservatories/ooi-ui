"use strict";
/*
 * ooiui/static/js/views/aa/AlertToggleActiveModalFormView.js
 * View for event acknowledgement modal
 */

var AlertToggleActiveModalFormView = ModalFormView.extend({
  bindings: {

  },
  events: {
    "click #toggleActive": "onSubmit",
    "change input[name='alertalarm']": "updatedType"
  },
  initialize: function() {
    _.bindAll(this, "render","onSubmit");
    // Intentionally left blank to override parent
  },
  initialRender:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  template: JST['ooiui/static/js/partials/AlertToggleActiveModalForm.html'],
  onSubmit: function(e) {
    var self = this;

    //stop the page redirect
    e.preventDefault();

    if (this.model.get('active') == 0) {
      this.model.set('active', 1);
    } else {
      this.model.set('active', 0);
    }

    // Sends ack
    this.model.save(null,{success: function(model, response, opts) {
      console.log('Alert Toggled OK!');
    },
      error: function(model, response, opts) {
        console.log('Alert Toggled Error!');
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
