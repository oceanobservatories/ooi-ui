"use strict";
/*
 *
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
    'click #download-btn2' : 'onDownloadLargeFormat',
    'change #type-select select' : 'onTypeChange',
    'click #provenance-select' : 'onCheckboxSelect',
    'click #annotation-select' : 'onCheckboxSelect',
    'change #time-range select': 'timeRangeChange',
    'click #subscription-selection-select': 'onSubscribeSelect',
    'click .subscribe-info': 'clickSubscribeInfo',
    'change #data-date' : 'onChangeDataDate',
    'click #select-all-parameters' : 'onSelectAllParameters'
  },
  initialize: function() {
    _.bindAll(this, 'onDownload', 'onTypeChange', 'onCheckboxSelect', 'timeRangeChange', 'resetTimeRange','onSubscribeSelect', 'clickSubscribeInfo');
    this.largeFileFormatView = null;
    this.render();
  },
  onSelectAllParameters: function() {
    if(!$('#select-all-parameters').is(':checked')){
      $('#parameter-selection-span').show();
      $("#param-multi-select").find('option').prop("selected",true);
    }else{
      $('#parameter-selection-span').hide();
      $("#param-multi-select").find('option').prop("selected",false);
    }
  },
  onCheckboxSelect: function() {
    if((this.$el.find('#provenance-select').is(':checked')) || (this.$el.find('#annotation-select').is(':checked'))){
      this.$el.find("#type-select select option[value*='csv']").prop('disabled',true);
    }else{
      this.$el.find("#type-select select option[value*='csv']").prop('disabled',false);
    }
  },
  clickSubscribeInfo: function() {
      alert(this.$el.find('.subscribe-info .fa').data('title'));
  },
  onSubscribeSelect: function(ev){
    var self = this;
    //disable it
    this.$el.find('#subscription-selection-select').attr('disabled','disabled');
    if (!this.model.get('subscriptionEnabled')){
      //try and add subscription
      try{
        var subscribeModel = new DataSubscriptionModel({});
        var stream_names = self.model.get('stream_name').split('_');
        var refParts = self.model.get('ref_des').split('-');
        if (stream_names.length == 2 && refParts.length == 4){
          subscribeModel.set('stream',stream_names[1].replace(/-/g,"_"));
          subscribeModel.set('method',stream_names[0]);
          subscribeModel.set('email',self.model.get('email'))

          subscribeModel.attributes.referenceDesignator.node = refParts[1];
          subscribeModel.attributes.referenceDesignator.subsite = refParts[0];
          subscribeModel.attributes.referenceDesignator.sensor = refParts[2] +"-"+ refParts[3];

          subscribeModel.save(null, {
            success: function() {
              self.$el.find('#subscription-selection-icon').removeClass('fa-heart-o');
              self.$el.find('#subscription-selection-icon').addClass('fa-heart');
              self.model.set('subscriptionModel',subscribeModel);
              self.model.set('subscriptionEnabled',true);
              self.$el.find('#subscription-selection-select').attr('disabled',null);
              ooi.trigger('StreamDownloadFormView:resetSubscriptionCollection', null);
            },
            error: function(model, response) {
              console.error('ERROR:',response);
              self.$el.find('#subscription-selection-select').attr('disabled',null);
            }
          });
        }else{
          console.error("ERROR:", "setting model");
          self.$el.find('#subscription-selection-select').attr('disabled',null);
        }
      }catch(e){
        console.error("ERROR:", e);
        self.$el.find('#subscription-selection-select').attr('disabled',null);
      }
    }else{
      //remove subscription
      self.model.get('subscriptionModel').destroy({
        success: function() {
          self.$el.find('#subscription-selection-icon').removeClass('fa-heart');
          self.$el.find('#subscription-selection-icon').addClass('fa-heart-o');
          self.model.set('subscriptionEnabled',false);
          self.$el.find('#subscription-selection-select').attr('disabled',null);
          ooi.trigger('StreamDownloadFormView:resetSubscriptionCollection', null);
        },
        error: function(model, response) {
          console.error('ERROR:',response);
          //once its set, re-enable it
          self.$el.find('#subscription-selection-select').attr('disabled',null);
        }
      });
    }
  },
  timeRangeChange: function() {
    var timeRangeDelta, timeChangedTo, startDate, endDate;

    // get the time in days to subtract from the end date.
    timeRangeDelta = this.$el.find('#time-range select').val();

    // reset the start and end date.
    endDate = moment.utc(this.model.get('end')).toJSON();
    startDate = moment.utc(this.model.get('start')).toJSON();

    // set the start date to be the time range delta from the selection.
    if (timeRangeDelta === "all") {
        startDate = moment.utc(this.model.get('start')).toJSON();
    } else {
        startDate = moment.utc(this.model.get('end')).subtract(timeRangeDelta,'hours').toJSON();
    }

    // set the fields.
    this.$end_date_picker.date(endDate);
    this.$start_date_picker.date(startDate);

    // dance.
  },
  resetTimeRange: function() {
    $("#time-range > select").val("Reset").change();
  },
  onChangeDataDate: function() {
    // Go request the new date
    ooi.trigger('GetLargeFormatFiles:fetch', {
      ref_des: this.model.attributes.reference_designator,
      date: moment.utc(this.$data_date.data('date')).format("YYYY-MM-DD")
    });
  },
  onTypeChange: function() {
    var type = this.$el.find('#type-select select').val();
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
  onDownloadLargeFormat: function() {
    /*
     * Redirect the user to the HYRAX server
     */
    var self = this;
    var selection = this.$type_select.val();
    var localModel = this.model.clone();
    var startDate = moment.utc(this.$start_date.data('date')).toJSON();
    var endDate = moment.utc(this.$end_date.data('date')).toJSON();
    localModel.set('start', startDate);
    localModel.set('end', endDate);

    var email = this.$el.find('#dlEmail').val();
    var user_name = this.model.get('user_name');
    localModel.set('email', email);

    // This is a large file format. Navigate to the download directory
    // But first we need to get the config file to get the base URL
    $.ajax({
      url: '/get_config',
      type: "GET",
      dataType: "json",
      model: this.model,
      success: function(resp){
        var base = resp.COMMON.SAN_DATA_SERVER;
        var site = this.model.attributes.reference_designator.substring(0,8);
        var assembly = this.model.attributes.reference_designator.substring(9,14);
        var instrument = this.model.attributes.reference_designator.substring(15);
        var url = base + site + '/' + assembly + '/' + instrument ;
        var popup = window.open(url, '_blank');
        self.popupBlockerChecker(popup);
      },
      error: function(){
        var msg = 'Error getting Data URL!'
        ooi.trigger('DownloadModalFail:onFail', msg);
      }
    });
    this.hide();
  },
  popupBlockerChecker: function(popup){
      setTimeout( function() {
          if(!popup || popup.outerHeight === 0) {
              alert("Popup Blocker is enabled! Please add this site to your exception list.");
          }
      }, 300);
  },
  onDownload: function() {
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

    // Set the selected parameters
    // console.log($('#param-multi-select').val());
    var parameters = '';
    if($('#param-multi-select').val()){
      localModel.set('parameters', $('#param-multi-select').val());
      parameters = $('#param-multi-select').val()
    }else{
      localModel.set('parameters', '')
    }


    // Create the typical download AJAX request
    var url = localModel.getURL(selection);
    $.ajax({
      url: url,
      type: "GET",
      // dataType: "json",
      user_email: email,
      user_name: user_name,
      parameters: parameters,
      success: function(resp){
        var timeCalculation = _.has(resp, "timeCalculation") ? resp.timeCalculation : null;
        ooi.trigger('DownloadModal:onSuccess', this.user_email, timeCalculation);
      },
      error: function(msg){
        ooi.trigger('DownloadModalFail:onFail', msg);
      }
    });

    this.hide();
  },
  failure: function() {
    console.log("this failure");
  },
  show: function(options) {
    var model = options.model;
    // console.log("SHOW", options.model.attributes);
    this.model = model;


    $.ajax({
      url: "/api/uframe/stream/parameters/"+this.model.get("ref_des")+"/"+this.model.get("stream_method")+"/"+this.model.get("stream"),
      type: "GET",
      dataType: "json",
      success: function(resp){
        var parameters = "";
        // console.log(resp);

        var plen = 1;
        for(var key in resp.parameters) {
          parameters += '<option value="' + resp.parameters[key] + '">' + key + '</option>';
          plen++;
        }

        $("#param-multi-select").empty().append(parameters);
        $("#param-multi-select").attr("size", plen)
      },
      error: function(msg){
        // console.log(msg);
        ooi.trigger('DownloadModalFail:onFail', msg);
      }
    });





    var startDate = null;
    var endDate = null;
    var isPlotDl = false;
    if(model.get('startDate') != null){
      startDate = model.get('startDate');
      endDate = model.get('endDate');
      //console.log('got to startDate');
      //console.log(startDate);
      //console.log(endDate);
      model.set('startDate',startDate);
      model.set('endDate',endDate);
      isPlotDl = true;
    }


    this.$start_date_picker.date(startDate);
    this.$end_date_picker.date(endDate);

    if(model.get('long_display_name') != null) {
      this.$el.find('#streamName').text(model.get('long_display_name'));
      this.$el.find('#streamName2').text(model.get('long_display_name'));
    }else{
      this.$el.find('#streamName').text(model.get('stream_name'));
      this.$el.find('#streamName2').text(model.get('stream_name'));
    }

    if (this.model.attributes.variables.indexOf("filepath") > -1) {
      // This is a large file format!
      $("#large-format-file-view").find("tbody").remove().end();


      var date = moment.utc(model.get('endDate')).format("YYYY-MM-DD");


      // Go get the files (set the date to trigger the request!)
      if (date === moment.utc(this.$data_date.data('date')).format("YYYY-MM-DD")){
        // Trigger the request becasue the date is already set correctly
        ooi.trigger('GetLargeFormatFiles:fetch', {
          ref_des: this.model.attributes.reference_designator,
          date: date
        });
      }else{
        this.$data_date_picker.setDate(date);
      }

      // Display the explanation
      this.$el.find('#sans-data-text').show()
      this.$el.find('#dlModalTitle').html("<h3>Metadata Stream being downloaded:</h3>")
      // Display the second download
      this.$el.find('#download-btn2').show()
      this.$el.find('#download2-row').show()

      $('#tabs a:first').show()
      $('#tabs a[href="#data"]').tab('show') // Select tab by name
      $('#tabs li:eq(1) a').html('Metadata')


    }else{
      // Hide the stuff that only applies to Large Format Downloads
      this.$el.find('#sans-data-text').hide()
      this.$el.find('#dlModalTitle').html("<h3>Streams being downloaded:</h3>")
      this.$el.find('#download-btn2').hide()
      this.$el.find('#download2-row').hide()

      $('#tabs a:first').hide()
      $('#tabs a[href="#metadata"]').tab('show') // Select tab by name
      $('#tabs li:eq(1) a').html('Data')

      var email = model.get('email');
      this.$el.find('#dlEmail').val(email);

      if (!(this.model.get('stream_name').split('_')[0] == 'telemetered')){
        this.$el.find('.subscription-selection').css('visibility','hidden');
      }else{
        this.$el.find('.subscription-selection').css('visibility','visible');
      }
      //reset it first incase
      this.$el.find('#subscription-selection-icon').attr('class','fa fa-heart-o');
      this.$el.find('#subscription-selection-select').attr('disabled',null);
      if (model.get('subscriptionEnabled')){
        this.$el.find('#subscription-selection-icon').removeClass('fa-heart-o');
        this.$el.find('#subscription-selection-icon').addClass('fa-heart');
        //this.$el.find('#subscription-selection-select').attr('disabled','disabled');
      }
    }
    //console.log(model.get('hideTimeRange'));
    if(model.get('hideTimeRange'))
      this.$el.find('#timeRangeDiv').hide();
    else
      this.$el.find('#timeRangeDiv').show();
    this.$el.find('#download-modal').modal('show');

    // Update parameters dropdown
    // $("#download-param-select").html($("#yvar0-select-default").html())
    // $('.selectpicker').selectpicker('refresh');

    $('#parameter-selection-span').hide();
    $("#param-multi-select").find('option').prop("selected",true);
    $("#select-all-parameters").prop("checked",true);

    this.onTypeChange();
    if(!isPlotDl){
      this.timeRangeChange();
    }

    return this;
  },
  hide: function() {
    this.$el.find('#download-modal').modal('hide');
    return this;
  },

  template: JST["ooiui/static/js/partials/StreamDownloadForm.html"],
  render: function() {
    this.$el.html(this.template({}));

    this.$el.find('#start-date').datetimepicker({format: 'YYYY-MM-DD HH:mm:ss.SSS',
      sideBySide: false,
      widgetPositioning: {horizontal: 'auto', vertical: 'bottom'}
    });
    this.$el.find('#end-date').datetimepicker({format: 'YYYY-MM-DD HH:mm:ss.SSS',
      sideBySide: false,
      widgetPositioning: {horizontal: 'auto', vertical: 'bottom'}
    });
    this.$el.find('#data-date').datetimepicker({format: "YYYY-MM-DD"});
    this.$start_date = this.$el.find('#start-date');
    this.$end_date = this.$el.find('#end-date');
    this.$data_date = this.$el.find('#data-date');
    this.$type_select = this.$el.find('#type-select select');
    this.$param_multi_select = this.$el.find('#param-multi-select select');
    this.$start_date_picker = this.$start_date.data('DateTimePicker');
    this.$end_date_picker = this.$end_date.data('DateTimePicker');
    this.$data_date_picker = this.$data_date.data('DateTimePicker');


  }
});
