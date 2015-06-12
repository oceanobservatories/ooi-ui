"use strict";
/*
 * ooiui/static/js/views/aa/TriggeredAlertDialogView.js
 * Model definitions for Arrays
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/ModalDialog.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 */

var TriggeredAlertDialogView = Backbone.View.extend({
  className: 'modal fade',
  
  events: {
    'hidden.bs.modal' : 'hidden',
    'button': 'click'
  },
  
  hide: function() {
    this.$el.modal('hide');
  },
  
  hidden: function(e) {
    if(this.ack) {
      this.ack();
    }
    e.preventDefault();
  },
  
  initialize: function() {
    _.bindAll(this, "render", "hidden");
  },
  
  show: function(options) {
    if(!options) {
      options = {};
    }
    if(options && typeof options.ack == "function") {
      this.ack = options.ack.bind(this);
    }
    this.render(options);
    this.$el.modal({
        keyboard:false,
        backdrop:'static'
    });
    this.$el.modal('show');
  },
  
  template: JST['ooiui/static/js/partials/TriggeredAlertDialog.html'],
  
  render: function(options) {
    var that = this;
    that.options = options;

    var alertist = new TriggeredAlertModel();
    //future call by instrument
    alertist.url='/api/aa/triggered/instrument_name='+options.variable;
    //alertist.url='/api/aa/triggered';

    this.$el.html(this.template(options));

    alertist.fetch({
      success: function(collection, response, options) {
        if(response.alert_alarm.length==0){
          that.options['history'] = '<div><i>No Alerts available at this time.</i></div>';
        }
        else{
          var buttons = '';
          for(var c in response.alert_alarm){
            if(response.alert_alarm[c].event_type =='alarm'){
              buttons = buttons.concat("<div style='padding-top:12px;padding-left:15px;'><i style='font-size:20px;padding-right: 20px;color:#a94442' class='fa fa-exclamation-circle'></i>"+String(response.alert_alarm[c].event_type).toUpperCase()+':  <u>'+response.alert_alarm[c].event_response+'</u> occured at <u>'+response.alert_alarm[c].event_time+"</u></div>");  
            }
            if(response.alert_alarm[c].event_type =='alert'){
              buttons = buttons.concat("<div style='padding-top:12px;padding-left:15px;'><i style='font-size:20px;padding-right: 20px;color:#E3A615' class='fa fa-flag'></i>"+String(response.alert_alarm[c].event_type).toUpperCase()+':  <u>'+response.alert_alarm[c].event_response+'</u> occured at <u>'+response.alert_alarm[c].event_time+"</u></div>");  
            }
          }
          that.options['history'] = buttons;
        }
        that.$el.html(that.template(that.options));

        //$('.modal-title').html("<b>"+that.options.instrument);
      },
      error:function(collection, response, options) {
        $('.modal').remove();
        var m = new ModalDialogView();
          m.show({
            message: "Error Getting Alerts",
            type: "danger",
          });
      }
    });
    
  },

  executeCommand:function(command,id){
    //execute a command from the button
  }
});

