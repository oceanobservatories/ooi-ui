"use strict";
/*
 * ooiui/static/js/views/aa/AlertToggleRetireModalFormView.js
 * View for event clear (resolve) modal
 */

var AlertToggleRetireModalFormView = ModalFormView.extend({
  bindings: {

  },
  events: {
    "click #toggleRetire": "onSubmit",
    "change input[name='alertalarm']": "updatedType"
  },
  initialize: function() {
    _.bindAll(this, "render","onSubmit");
    // Intentionally left blank to override parent
  },
  initialRender:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  template: JST['ooiui/static/js/partials/AlertToggleRetiredModalForm.html'],
  onSubmit: function(e) {
    var self = this;

    //stop the page redirect
    e.preventDefault();

    // Sends retire
    var retire_model = new RetireModel();
    var retireit = retire_model.set('id', this.model.get('id'));
    //retire_model.set('id', this.model.get('id'));

    retireit.save(null,{success: function(model, response, opts) {
      //console.log('success?');
      ooi.trigger('alertToggleRetire:success');
      ooi.views.alertFilterView.collection.fetch({reset:true});
    },
      error: function(model, response, opts) {
        console.log('Retire Error!');
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
