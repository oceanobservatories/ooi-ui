"use strict";
/*
 * ooiui/static/js/views/aa/ClearModalFormView.js
 * View for event clear (resolve) modal
 */

var ClearModalFormView = ModalFormView.extend({
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
  template: JST['ooiui/static/js/partials/ClearModalForm.html'],
  onSubmit: function(e) {
    var self = this;

    //stop the page redirect
    e.preventDefault();

    var clearModel = new AlertClearModel();
    clearModel.set('id', this.model.get('id'));
    clearModel.set('resolved_comment', this.$el.find('#inputDescription').val()); //str

    //console.log(clearModel);
    // Sends ack
    clearModel.save(null,{success: function(model, response, opts) {
      //console.log('Cleared OK!');
      ooi.trigger('alertClear:success');
    },
      error: function(model, response, opts) {
        console.log('Clear Error!');
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
