"use strict";
/*
 * ooiui/static/js/views/common/MissionDialogView.js
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

var MissionDialogView = Backbone.View.extend({
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
    if(!options) {
      options = {};
    }
    if(options && typeof options.ack == "function") {
      this.ack = options.ack.bind(this);
    }
    this.render(options);
    this.$el.modal({
        keyboard:false,
        backdrop:'static'
    });
    this.$el.modal('show');
  },
  template: JST['ooiui/static/js/partials/MissionDialog.html'],
  render: function(options) {
    this.$el.html(this.template(options));
  }
});

