"use strict";
/*
 * ooiui/static/js/views/science/StreamDownloadFormView.js
 * View Definition for DownloadFormView
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/DownloadFOrm.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */


var StreamDownloadFormView = Backbone.View.extend({
  events: {
    'click #download-btn' : 'onDownload',
    'change #type-select' : 'onTypeChange',
    'click #provenance-select' : 'onCheckboxSelect',
    'click #annotation-select' : 'onCheckboxSelect',
  },
  initialize: function() {
    this.render();
  },
  onCheckboxSelect: function() {
    if((this.$el.find('#provenance-select').is(':checked')) || (this.$el.find('#annotation-select').is(':checked'))){
      this.$el.find("#type-select option[value*='csv']").prop('disabled',true);
    }else{
      this.$el.find("#type-select option[value*='csv']").prop('disabled',false);
    }
  },
  onTypeChange: function() {
    var type = this.$el.find('#type-select').val();
    if(type == 'csv') {
      this.$el.find('#provenance-select').attr("disabled", true);
      this.$el.find('#provenance-select').attr('checked', false);
      this.$el.find('#annotation-select').attr("disabled", true);
      this.$el.find('#annotation-select').attr('checked', false);
    } else {
      this.$el.find('#provenance-select').removeAttr("disabled");
      this.$el.find('#annotation-select').removeAttr("disabled");
    }
  },
  onDownload: function() {
    /*
     * Make a copy of the stream model and then set the start and end dates to
     * the form fields, then grab the URL and send the user to it.
     */
    var selection = this.$type_select.val();
    var localModel = this.model.clone();
    var startDate = new Date(this.$start_date.data('date')).toISOString();
    var endDate = new Date(this.$end_date.data('date')).toISOString();
    localModel.set('start', startDate);
    localModel.set('end', endDate);
    // Check for provenance and set the model
    if(this.$el.find('#provenance-select').is(':checked')){
      localModel.set('provenance', 'true');
    }else{
      localModel.set('provenance', 'false');
    }
    // Check for annotations and set the model
    if(this.$el.find('#annotation-select').is(':checked')){
      localModel.set('annotations', 'true');
    }else{
      localModel.set('annotations', 'false');
    }
    var url = localModel.getURL(selection);
    window.open(url, '_blank');
//    window.location.href = url;
    this.hide();
  },
  failure: function() {
    console.log("this failure");
  },
  show: function(options) {
    var model = options.model;
    var selection = options.selection;
    console.log("SHOW", options.model.attributes);
    this.model = model;
    var startDate = new Date(model.get('start'));
    var endDate = new Date(model.get('end'));
    this.$start_date_picker.setDate(startDate);
    this.$end_date_picker.setDate(endDate);
    
    if(model.get('long_display_name') != null) {
      this.$el.find('#streamName').text(model.get('long_display_name'));
    }else{
      this.$el.find('#streamName').text(model.get('stream_name'));
    }
    this.$el.find('#type-select').val(selection);
    this.$el.find('#download-modal').modal('show');
    return this;
  },
  hide: function() {
    this.$el.find('#download-modal').modal('hide');
    return this;
  },
  template: JST["ooiui/static/js/partials/StreamDownloadForm.html"],
  render: function() {
    this.$el.html(this.template({}));
    this.$el.find('#start-date').datetimepicker({format: "YYYY-MM-DD HH:mm:ss",
                                                 sideBySide: true
                                                 });
    this.$el.find('#end-date').datetimepicker({format: "YYYY-MM-DD HH:mm:ss",
                                               sideBySide: true
                                               });
    this.$start_date = this.$el.find('#start-date');
    this.$end_date = this.$el.find('#end-date');
    this.$type_select = this.$el.find('#type-select');
    this.$start_date_picker = this.$start_date.data('DateTimePicker');
    this.$end_date_picker = this.$end_date.data('DateTimePicker');
  }
});
