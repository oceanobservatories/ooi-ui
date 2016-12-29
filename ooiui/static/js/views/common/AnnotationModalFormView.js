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
    if (options && options.showUpdate){
      this.showUpdate = options.showUpdate;
    }

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

    var minDate = moment.utc(self.model.get('beginDTSafe'),'YYYY-MM-DD HH:mm');
    var maxDate = moment.utc(self.model.get('endDTSafe'),'YYYY-MM-DD HH:mm');
    var min = minDate.format("YYYY-MM-DDTHH:mm:ss.000")+"Z";
    var max = maxDate.format("YYYY-MM-DDTHH:mm:ss.000")+"Z";

    if (maxDate.isAfter(minDate)){
      $('#startLabel').css('color','#004773');
      $('#endLabel').css('color','#004773');


      self.model.set('beginDT', min);
      self.model.set('endDT', max);

      self.model.unset('beginDTSafe', {silent:true});
      self.model.unset('endDTSafe', {silent:true});

      self.model.set('source', this.username);

      this.model.save(null, {
        success: function(model,response) {
          console.log(model.ui_id);
          if(model.ui_id) {
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
    }else{      
      $('#startLabel').css('color','darkred');
      $('#endLabel').css('color','darkred');
      //invalid date
    }
  },
  template: JST['ooiui/static/js/partials/AnnotationModalForm.html'],
  render: function() {
    var self = this;
    this.$el.html(this.template({
      model: this.model,
      username: this.username
    }));
    this.stickit();


    if(self.showUpdate) {
      this.$el.find('#submit-button').text('Update');
      this.$el.find('#reset-button').prop('disabled', 'disabled');
    }else{
      this.$el.find('#submit-button').text('Add');
      this.$el.find('#reset-button').prop('disabled', '');
    }


    if(this.model.get('annotation')) {
      this.$el.find('#comments-input').val(this.model.get('annotation'));
    }

    $('#startAnnotationDateTime').datetimepicker({defaultDate: this.model.get('beginDTSafe') ,format: 'YYYY-MM-DD HH:mm'})                                              
                                              .on('dp.change', function(){
                                                var min = moment.utc($('#startAnnotationDateTime').data('date'),'YYYY-MM-DD HH:mm').format("YYYY-MM-DD HH:mm");
                                                self.model.set('beginDTSafe',min)
                                              });
    $('#endAnnotationDateTime').datetimepicker({defaultDate: this.model.get('endDTSafe'), format: 'YYYY-MM-DD HH:mm'})
                                              .on('dp.change', function(){
                                                var max = moment.utc($('#endAnnotationDateTime').data('date'),'YYYY-MM-DD HH:mm').format("YYYY-MM-DD HH:mm");
                                                self.model.set('endDTSafe',max)                                                
                                              });


  }
});
