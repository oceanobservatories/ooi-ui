"use strict";
/*
 * ooiui/static/js/views/common/ModalDialogView.js
 * Model definitions for Arrays
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/ModalDialog.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var TermsDialogView = Backbone.View.extend({
  className: 'modal fade',
  events: {
    'hidden.bs.modal' : 'hidden'
  },
  hide: function() {
    this.$el.modal('hide');
  },
  hidden: function(e) {
    if(this.ack) {
      this.ack();
    }
    e.preventDefault();
  },
  initialize: function() {
    _.bindAll(this, "render", "hidden");
  },
  show: function(options) {
     bootbox.dialog({
      message: this.$el.find('.terms-modal')[0],
      className: "terms-and-conditions-modal",
      title: "OOI USER TERMS AND CONDITIONS",
      buttons: {
        success: {
          label: "Close",
          className: "btn-primary",
          callback: function() {
            return;
          }
        }
      }
    });
  },
  template: JST['ooiui/static/js/partials/TermsDialog.html'],
  render: function(options) {
    this.$el.html(this.template(options));
  }
});

