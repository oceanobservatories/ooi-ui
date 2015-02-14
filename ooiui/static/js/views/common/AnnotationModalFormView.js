"use strict";
/*
 * ooiui/static/js/views/common/AnnotationModalFormView.js
 * View Definition for Generic ModalFormViews
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/ModalForm.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Views
 * - ooiui/static/js/views/common/ModalFormView.js
 * Usage
 */

var AnnotationModalFormView = ModalFormView.extend({
  bindings: {
    '#date' : 'pos_x',
    '#yvalue' : 'pos_y',
    '#title-input' : 'title',
    '#comments-input' : 'comment'
  },
  initialize: function() {
  },
  show: function(options) {
    if(options
      && options.model // annotation model
      && options.streamModel
      && options.userModel) {
        ModalFormView.prototype.show.apply(this);
    } else {
      console.error("Annotation Modal has insufficient information");
    }
  },
  template: JST['ooiui/static/js/partials/AnnotationModalForm.html'],
  render: function() {
    this.$el.html(this.template({
      model: this.model,
      username: this.username
    }));
    this.stickit();
  }
});
