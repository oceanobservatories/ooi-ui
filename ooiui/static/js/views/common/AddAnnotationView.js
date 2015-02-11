"use strict";
/*
 * ooiui/static/js/models/common/AnnotationModel.js
 * View definitions for charts
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/Annotation.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * - ooiui/static/lib/backbone-modal-dialog
 * Usage
 */

var AddAnnotationView = Backbone.View.extend({
  events: {
    'click #btnAddAnnotation' : "addAnnotation",
    'keyup #passInput' : "keyUp",
    'keypress #passInput' : 'keyPress',
    'hidden.bs.modal' : 'hidden'
  },
  initialize: function(params) {
    _.bindAll(this, "render", "addAnnotation", "show", "hide", "keyPress");
    this.render() 
  },
  addAnnotation: function(e) {
    var self = this;
    e.preventDefault();
    e.stopPropagation();
    this.model.set({
      title: this.$el.find('#titleInput').val(),
      comment: this.$el.find('#comment-text').val(),             
      stream_name: "flort_kn_stc_imodem_instrument",
      instrument_name: "CP02PMUO-WFP01-04-FLORTK000"      
    });
    this.model.save(null, {
      success: function() {
        console.log("I'm calling hide");
        self.hide();
        ooi.trigger('AddAnnotationView:addAnnotation', self.model);
      }
    });
  },
  hidden: function(e) {
    console.log("hidden");
  },
  /* Called when the user is successfully authenticated */
  success: function() {
    console.log("Success");
  },
  failure: function() {
    console.log("this failure");
  },
  show: function() {
    $('#annotationModal').modal('show');
    return this;
  },
  hide: function() {
    console.log("hide was called");
    this.isHidden = true;
    $('#annotationModal').modal('hide');
    return this;
  },
  keyUp: function(e) {
    if($(e.target).val() == '') {
       //If there is no text within the input then disable the button
       this.$el.find('.enableOnInput').prop('disabled', true);
     } else {
       //If there is text in the input, then enable the button
       this.$el.find('.enableOnInput').prop('disabled', false);
     }
  },
  keyPress: function(e) {
    if(e.which == 13) {
      console.log(this);
      this.login(e);
    }
  },
  template: JST["ooiui/static/js/partials/AnnotationModal.html"],
  render: function() {
    this.$el.html(this.template({model: this.model}));
  }
});
