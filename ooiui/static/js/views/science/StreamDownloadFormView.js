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
    "use strict";
    this.render();
  },
  onCheckboxSelect: function() {
    "use strict";
    if((this.$el.find('#provenance-select').is(':checked')) || (this.$el.find('#annotation-select').is(':checked'))){
      this.$el.find("#type-select option[value*='csv']").prop('disabled',true);
    }else{
      this.$el.find("#type-select option[value*='csv']").prop('disabled',false);
    }
  },
  onTypeChange: function() {
    "use strict";
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

    if(type == 'json') {
      this.$el.find('#download-param-select').attr("disabled", false);
    } else{
      this.$el.find('#download-param-select').attr("disabled", true);
    }
  },
  onDownload: function() {
    "use strict";
    /*
     * Make a copy of the stream model and then set the start and end dates to
     * the form fields, then grab the URL and send the user to it.
     */
    var selection = this.$type_select.val();
    var localModel = this.model.clone();
    var startDate = moment.utc(this.$start_date.data('date')).toJSON();
    var endDate = moment.utc(this.$end_date.data('date')).toJSON();
    localModel.set('start', startDate);
    localModel.set('end', endDate);

    var email = this.$el.find('#dlEmail').val();
    var user_name = this.model.get('user_name');
    localModel.set('email', email);
    /* 10/08/2015 @ 9:37am
     * M@Campbell
     *
     * Recipient was trying to create a directory of the user name,
     * which sometimes could be the user's email address.
     *
     * Lets remove the special characters; replace the @ with a - and
     * completely remove the .
     */
    if (user_name.indexOf('.') > -1) { user_name = user_name.replace('.', '-'); }
    if (user_name.indexOf('@') > -1) { user_name = user_name.replace('@', '-'); }

    if (user_name.indexOf('.') > -1) {
        var splitUserName = user_name.split('.');
        user_name = splitUserName[0];
    }
    localModel.set('user_name', user_name);

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
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      user_email: email,
      user_name: user_name,
      success: function(resp){
        ooi.trigger('DownloadModal:onSuccess', this.user_email);
      },
      error: function(msg){
        ooi.trigger('DownloadModalFail:onFail', msg);
      }
    });
    // window.open(url, '_blank');
//    window.location.href = url;
    this.hide();
  },
  failure: function() {
    "use strict";
    console.log("this failure");
  },
  show: function(options) {
    "use strict";
    var model = options.model;
    var selection = options.selection;
    // console.log("SHOW", options.model.attributes);
    this.model = model;

    var startDate = moment.utc(model.get('start')).toJSON();
    var endDate = moment.utc(model.get('end')).toJSON();

    this.$start_date_picker.setDate(startDate);
    this.$end_date_picker.setDate(endDate);

    if(model.get('long_display_name') != null) {
      this.$el.find('#streamName').text(model.get('long_display_name'));
    }else{
      this.$el.find('#streamName').text(model.get('stream_name'));
    }
    this.$el.find('#type-select').val(selection);

    var email = model.get('email');
    this.$el.find('#dlEmail').val(email);

    this.$el.find('#download-modal').modal('show');

    // Update parameters dropdown
    // $("#download-param-select").html($("#yvar0-select-default").html())
    // $('.selectpicker').selectpicker('refresh');

    this.onTypeChange();

    return this;
  },
  hide: function() {
    "use strict";
    this.$el.find('#download-modal').modal('hide');
    return this;
  },
  template: JST["ooiui/static/js/partials/StreamDownloadForm.html"],
  render: function() {
    "use strict";
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
