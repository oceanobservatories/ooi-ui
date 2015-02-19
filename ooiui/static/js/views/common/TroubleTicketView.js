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
    var self = this;  
    this.listenTo(this.collection, "reset", function() {
      self.render();
    });

  },
  bindings:{
    //'#username':'name',
    '#titleSub':'subject',
    '#description':'description',
    '#comment':'comment',
    '[name=radio]': 'priority_id',
    '[name=date]' : 'due_date'
    //'[class=typeDrop]' : 'assigned_to_id'
  },

  template: JST['ooiui/static/js/partials/TroubleTicket.html'],

  render: function() {

    this.$el.html(this.template({collection: this.collection}));
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
    console.log(this.model.attributes);
    this.model.save()
  }
});
