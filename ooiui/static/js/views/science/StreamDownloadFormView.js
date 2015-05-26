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
    'click #download-btn' : 'onDownload'
  },
  initialize: function() {
    this.render();
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
    this.$el.find('.message h3').text(model.get('display_name'));

    this.$el.find('#type-select').val(selection);

    this.$el.find('.stream-name').text(model.get('stream_name'));

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
    this.$el.find('#start-date').datetimepicker();
    this.$el.find('#end-date').datetimepicker();
    this.$start_date = this.$el.find('#start-date');
    this.$end_date = this.$el.find('#end-date');
    this.$type_select = this.$el.find('#type-select');
    this.$start_date_picker = this.$start_date.data('DateTimePicker');
    this.$end_date_picker = this.$end_date.data('DateTimePicker');
  }
});
