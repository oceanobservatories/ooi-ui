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
 * - ooiui/static/lib/backbone.stickit/backbone.stickit.js
 * - ooiui/static/js/ooi.js
 * Views
 * - ooiui/static/js/views/common/ModalFormView.js
 * Usage
 */

var AnnotationModalFormView = ModalFormView.extend({
  bindings: {    
    '#comments-input' : 'comment'
  },
  events: {
    'click #submit-button' : 'onSubmit'
  },
  initialize: function() {
    // Intentionally left blank to override parent
  },
  show: function(options) {
    //options.model = annotation model
    if(options && options.model && options.userModel) {
        this.model = options.model;
        this.username = options.userModel.get('user_name');
        this.render();
        ModalFormView.prototype.show.apply(this);
    } else {
      console.error("Annotation Modal has insufficient information");
    }
  },
  onSubmit: function(event) {
    var self = this;
    event.stopPropagation();
    event.preventDefault();
    this.model.set('annotation',this.$el.find('#comments-input').val());    
    this.model.save(null, {
      success: function(model,response) {             
        if(model.id) {
          ooi.trigger('AnnotationModalFormView:onUpdate', model);
        }else{
          ooi.trigger('AnnotationModalFormView:onSubmit', model);
        }
      },
      error: function(){            
      }
    });
    this.hide();
  },
  template: JST['ooiui/static/js/partials/AnnotationModalForm.html'],
  render: function() {
    this.$el.html(this.template({
      model: this.model,
      username: this.username
    }));
    this.stickit();
    if(this.model.id) {
      this.$el.find('#submit-button').text('Update');
      this.$el.find('#reset-button').prop('disabled', 'disabled');
    }

    if(this.model.get('annotation')) {
      this.$el.find('#comments-input').val(this.model.get('annotation'));

    }

  }
});
