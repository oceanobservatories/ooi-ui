/*"use strict";

* ooiui/static/js/views/common/TroubleTicketView.js
*
* Dependencies
* Partials
* - ooiui/static/js/partials/TroubleTicket.html
*/
var TroubleTicketView = Backbone.View.extend({
  events: {
    'click .btn-custom-submit' : function(e) {
        //this.render(e);
        this.submit(e);
    },
    'click .btn-custom-reset' : 'reset'
  },
  initialize: function() {
    console.log("binded");
    this.render();
  },
  bindings:{
    //'#username':'name',
    '#titleSub':'subject',
    '#description':'description',
    '#comment':'comment',
    '[name=radio]': 'priority_id',
    '[name=date]' : 'due_date'
    //'#event-type-selection' : 'assigned_to_id'
  },

  template: JST['ooiui/static/js/partials/TroubleTicket.html'],

  render: function() {
    this.$el.html(this.template());
    this.$el.find('#datePicker').datepicker({
        format: "yyyy-mm-dd",
        startDate: "+1d"
    });
    this.stickit();
    console.log(this.model.attributes);
  },
  reset: function() {
    this.model.clear().set(this.model.defaults);
  },

  submit: function() {
    console.log(this.model.attributes.project_id);
    this.model.save()
  }
});
