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
    var selection = this.$type_select.val();
    var url = this.model.getURL(selection);
    url += '?'+$.param({startdate:this.$start_date_picker.getDate().format('YYYY-MM-DDTHH:mm:ss'), enddate:this.$end_date_picker.getDate().format('YYYY-MM-DDTHH:mm:ss')})
    window.location.href = url;
    ooi.trigger('DownloadModal:onHide'); 
    this.hide();
  },
  failure: function() {
    console.log("this failure");
  },
  show: function(options) {
    var model = options.model;
    var selection = options.selection;
    this.model = model;
    var startDate = model.get('start');
    var endDate = model.get('end');
    this.$start_date_picker.setDate(startDate);
    this.$end_date_picker.setDate(endDate);
    this.$el.find('.message h3').text(model.get('display_name'));

    // Download Link
    var base_url = window.location.origin;
    var raw_dl_url = base_url + this.model.getURL(selection);
    var dl_url = '<a href=\"' + raw_dl_url + '\">Download Link\</a>';
    this.$el.find('.download-link h4').html(dl_url);

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
