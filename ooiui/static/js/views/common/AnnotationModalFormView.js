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
    _.bindAll(this, "render", "show", "changeEvent" );
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
  changeEvent:function(ev){   
  },
  onSubmit: function(event) {
    var self = this;
    event.stopPropagation();
    event.preventDefault();
    this.model.set('annotation',this.$el.find('#comments-input').val());

    var min = moment.utc(self.model.get('beginDTSafe'),'DD/MM/YYYY HH:mm').format("YYYY-MM-DDTHH:mm:ss.000")+"Z";
    var max = moment.utc(self.model.get('endDTSafe'),'DD/MM/YYYY HH:mm').format("YYYY-MM-DDTHH:mm:ss.000")+"Z";

    self.model.set('beginDT', min);
    self.model.set('endDT', max);

    self.model.unset('beginDTSafe', {silent:true})
    self.model.unset('endDTSafe', {silent:true})

    this.model.save(null, {
      success: function(model,response) {
        if(model.id) {
          ooi.trigger('AnnotationModalFormView:onUpdate', model);
        }else{
          ooi.trigger('AnnotationModalFormView:onSubmit', model);
        }
      },
      error: function(){
        console.log('error saving annotation...')
      }
    });
    this.hide();
  },
  template: JST['ooiui/static/js/partials/AnnotationModalForm.html'],
  render: function() {
    var self = this;
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

    $('#startAnnotationDateTime').datetimepicker({defaultDate: this.model.get('beginDTSafe') ,format: 'DD/MM/YYYY HH:mm'})                                              
                                              .on('dp.change', function(){
                                                var min = moment.utc($('#startAnnotationDateTime').data('date'),'DD/MM/YYYY HH:mm').format("DD/MM/YYYY HH:mm");
                                                self.model.set('beginDTSafe',min)
                                              });
    $('#endAnnotationDateTime').datetimepicker({defaultDate: this.model.get('endDTSafe'), format: 'DD/MM/YYYY HH:mm'})
                                              .on('dp.change', function(){
                                                var max = moment.utc($('#endAnnotationDateTime').data('date'),'DD/MM/YYYY HH:mm').format("DD/MM/YYYY HH:mm");
                                                self.model.set('endDTSafe',max)                                                
                                              });


  }
});
