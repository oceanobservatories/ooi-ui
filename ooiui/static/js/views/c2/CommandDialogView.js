"use strict";
/*
 * ooiui/static/js/views/common/ModalDialogView.js
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

var CommandDialogView = Backbone.View.extend({
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
  
  template: JST['ooiui/static/js/partials/CommandDialog.html'],
  
  render: function(options) {
    var that = this;
    that.options = options;
    console.log(this.options);
    var commandist = new ArrayDataModel();
    commandist.url='/api/c2/'+options.ctype+'/'+options.variable+'/commands';
    console.log(commandist.url);

    this.$el.html(this.template(options));

    commandist.fetch({
      success: function(collection, response, options) {
        console.log(response);
        console.log("capabilities: ", response.value.capabilities);
        console.log("commands: ", response.value.capabilities[0]);

        console.log("response.value.metadata.commands: ", response.value.metadata.commands);

        for(var availableCommands in response.value.metadata.commands){
          console.log("availableCommands: ", availableCommands);
          for(var activeCommand in availableCommands){
            //console.log("display_name: ", response.value.metadata.commands.String(activeCommand).display_name);
          }


          //console.log(String(availableCommands.display_name));
        }


        if(response.value.capabilities.length==0){
          that.options['command_options'] = '<div><i>No Commands available at this time.</i></div>';
        }
        else{
          var buttons = '';
          var theCommands = response.value.capabilities[0];
          console.log("one command: ", theCommands[0]);
          for(var c in theCommands){
            console.log(c);
            console.log(String(theCommands[c]));
            //console.log("display_name: ", response.value.metadata.commands.theCommands[c].display_name);
            buttons = buttons.concat("<div style='padding-top:12px;padding-left:15px;'><button type='button' class='btn btn-primary' data-toggle='button' aria-pressed='false' autocomplete='off'>"+String(theCommands[c])+"</button></div>");
          }
          that.options['command_options'] = buttons;
        }
        that.$el.html(that.template(that.options));
        $('.modal-title').html("<b>"+that.options.title);
      },
      error:function(collection, response, options) {
        $('.modal').remove();
        var m = new ModalDialogView();
          m.show({
            message: "Error Getting Command Data",
            type: "danger"
          });
      }
    });
    
  },

  executeCommand:function(command,id){
    //execute a command from the button
  }
});

