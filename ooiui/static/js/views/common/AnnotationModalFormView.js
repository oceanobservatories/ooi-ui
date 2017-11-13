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

    if(options && options.model && options.userModel && options.qcFlagsModel) {
        this.model = options.model;
        this.username = options.userModel.get('user_name');
        this.qcFlags = options.qcFlagsModel;
        this.parameterDisplayNames = ooi.collections.selectedStreamCollection.models[0].attributes.parameter_display_name;
        this.parameterIds = ooi.collections.selectedStreamCollection.models[0].attributes.parameter_id;
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
    //console.log('Selected Parameters');
    //console.log(this.$el.find('#parameters-input').val());
    this.model.set('annotation',this.$el.find('#comments-input').val());
    this.model.set('qcFlag', this.$el.find('#qcflag-input').val());
    var pVal = this.$el.find('#parameters-input').val().toString();
    //console.log('pVal');
    //console.log(pVal);
    if(pVal === "null"){
      pVal = null;
    }
    this.model.set('parameters', pVal);
    this.model.set('exclusionFlag', (this.$el.find('#exclusionFlag-input').val().toLowerCase() === 'true'));


    var minDate = moment.utc(self.model.get('beginDTSafe'),'YYYY-MM-DD HH:mm:ss.SSS');
    var min = minDate.toISOString();

    var maxDate = moment.utc(self.model.get('endDTSafe'),'YYYY-MM-DD HH:mm:ss.SSS');
    var max = maxDate.toISOString();

    if(maxDate.isValid()) {



      if (maxDate.isAfter(minDate)) {
        $('#startLabel').css('color', '#004773');
        $('#endLabel').css('color', '#004773');


        self.model.set('beginDT', min);
        self.model.set('endDT', max);

        self.model.unset('beginDTSafe', {silent: true});
        self.model.unset('endDTSafe', {silent: true});
      }else{
        $('#startLabel').css('color', 'darkred');
        $('#endLabel').css('color', 'darkred');
        alert('End date is not after start date!');
        event.preventDefault();
        //invalid date
      }
    }else{
      self.model.set('beginDT', min);
      self.model.unset('beginDTSafe', {silent: true});
      self.model.set('endDT', null);
      self.model.unset('endDTSafe', {silent: true});
    }

      self.model.set('source', this.username);

      self.model.set('qcFlag', this.$el.find('#qcflag-input').val());

      self.model.set('parameters', pVal);

      self.model.set('exclusionFlag', (this.$el.find('#exclusionFlag-input').val().toLowerCase() === 'true'));

      // console.log(min);
      // console.log(max);

      this.model.save(null, {
        success: function(model,response) {
          //console.log(model.ui_id);
          if(model.ui_id !== null) {
            ooi.trigger('AnnotationModalFormView:onUpdate99', model);
          }else{
            ooi.trigger('AnnotationModalFormView:onSubmit99', model);
          }
        },
        error: function(model, e){
          //alert('There was a problem saving the annotation to uframe.');
          console.log('error saving annotation...');
          ooi.trigger('AnnotationModalFormView:onError', e);
        }
      });
      this.hide();

  },
  template: JST['ooiui/static/js/partials/AnnotationModalForm.html'],
  render: function() {
    var self = this;
    this.$el.html(this.template({
      model: this.model,
      username: this.username,
      qcFlags: this.qcFlags,
      parameterDisplayNames: this.parameterDisplayNames,
      parameterIds: this.parameterIds
    }));
    this.stickit();


    if(self.showUpdate) {
      this.$el.find('#submit-button').text('Update');
      this.$el.find('#reset-button').prop('disabled', 'disabled');
      self.showUpdate = false;
    }else{
      this.$el.find('#submit-button').text('Add');
      this.$el.find('#reset-button').prop('disabled', '');
    }


    if(this.model.get('annotation') !== undefined) {
    //console.log(this.model);
      this.$el.find('#comments-input').val(this.model.get('annotation'));
      // QC Flags
      //console.log("this.model.get('qcFlag')");
      //console.log(this.model.get('qcFlag'));
      $('#qcflag-input').val(this.model.get('qcFlag'));

      // Parameters
      if(this.model.get('parameters') !== null && this.model.get('parameters').length > 0){
        $('#parameters-input').val(this.model.get('parameters').toString().split(','));
      } else {
        $('#parameters-input').val("null");
      }
      // Exclusion Flag
      if(this.model.get('exclusionFlag') !== null){
        $('#exclusionFlag-input').val(this.model.get('exclusionFlag').toString());
      }

    }

    $('#startAnnotationDateTime').datetimepicker({
      defaultDate: moment.utc(this.model.get('beginDTSafe')).format("YYYY-MM-DD HH:mm:ss.SSS"),
      format: 'YYYY-MM-DD HH:mm:ss.SSS'})
        .on('dp.change', function(){
          var min = moment.utc($('#startAnnotationDateTime').data('date'),'YYYY-MM-DD HH:mm:ss.SSS').format("YYYY-MM-DD HH:mm:ss.SSS");
          // console.log('min');
          // console.log(min);
          self.model.set('beginDTSafe',min)
        });

    var endDTSafe = this.model.get('endDTSafe');
    var defaultEndDate = "";
    if(endDTSafe !== null){
      defaultEndDate = moment.utc(endDTSafe).format("YYYY-MM-DD HH:mm:ss.SSS");
    }
    $('#endAnnotationDateTime').datetimepicker({
      defaultDate: defaultEndDate,
      format: 'YYYY-MM-DD HH:mm:ss.SSS'})
        .on('dp.change', function(){
          var endDate = $('#endAnnotationDateTime').data('date');
          //console.log(endDate);
          if(endDate !== null){
            var max = moment.utc(endDate,'YYYY-MM-DD HH:mm:ss.SSS').format("YYYY-MM-DD HH:mm:ss.SSS");
          //console.log('max');
          //console.log(max);
          }else{
            max = null;
          }
          self.model.set('endDTSafe',max)
        });
  } //render
});
