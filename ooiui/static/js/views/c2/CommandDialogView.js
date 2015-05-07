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
    'click button': 'executeCommand'
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
    _.bindAll(this, "render", "hidden",'acquire');
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
    
    var commandist = new ArrayDataModel();
    commandist.url='/api/c2/'+options.ctype+'/'+options.variable+'/commands';
    
    this.$el.html(this.template(options));

    commandist.fetch({
      success: function(collection, response, options) {

        that.options['model'] = response;
        //Command Options
        if(!response.value){
          that.options['command_options'] = '<div><i>No Commands available at this time.</i></div>';
        }
        else if(response.value.capabilities.length==0){
          that.options['command_options'] = '<div><i>No Commands available at this time.</i></div>';
        }
        else{
          var buttons = '<i style"margin-bottom:5px">Click to Execute Command</i>';
          var theCommands = response.value.capabilities[0];

          for(var c in theCommands){
            if(response.value.metadata.commands[theCommands[c]]){
                buttons = buttons.concat("<div style='padding-top:4px;padding-left:2px;'><button type='button' data="+theCommands[c]+" class='btn btn-default' id="+theCommands[c]+" aria-pressed='false' autocomplete='off'>"+response.value.metadata.commands[theCommands[c]].display_name+"</button></div>");  
                //data-toggle='button'
            }
            else{
                //other none listed capabilities
               //buttons = buttons.concat("<div style='padding-top:12px;padding-left:15px;'><button type='button' id="+theCommands[c]+" data="+theCommands[c]+" class='btn btn-primary'  aria-pressed='false' autocomplete='off'>"+theCommands[c]+"</button></div>");  
            }            
          }
          that.options['command_options'] = buttons;
        }

        //Parameter Options and values
        var parameter_html = '';
        if(!response.value){
          that.options['parameter_options'] = '<div><i>No Parameters available at this time.</i></div>';
        }
        else if(!response.value.metadata.parameters || response.value.metadata.parameters == null){
          that.options['parameter_options'] = '<div><i>No Parameters available at this time.</i></div>';
        }
        else{
          var theParameters = response.value.metadata.parameters;

          for(var p in theParameters){
            var units = 'None';
            if(response.value.metadata.parameters[p].value['units']){
              units = response.value.metadata.parameters[p].value['units'];
            }
            if(response.value.metadata.parameters[p].visibility == "READ_WRITE"){
                parameter_html = parameter_html.concat("<div style='font-size:12px;' class='row' ><div class='col-md-4'>"+response.value.metadata.parameters[p].display_name+"</div><div style='font-style: italic;' class='col-md-4'>"+response.value.metadata.parameters[p].description+"</div><div class='col-md-2'><input id="+p+" value="+response.value.parameters[p]+"></input></div><div style='font-style: italic;right:-55px' class='col-md-2'>"+units+"</div></div>");  
            } 
            //disable this parameter from editing     
            else{
                parameter_html = parameter_html.concat("<div style='font-size:12px;' class='row' ><div class='col-md-4'>"+response.value.metadata.parameters[p].display_name+"</div><div style='font-style: italic;' class='col-md-4'>"+response.value.metadata.parameters[p].description+"</div><div class='col-md-2'><input id="+p+" disabled value="+response.value.parameters[p]+"></input></div><div style='font-style: italic;right:-55px' class='col-md-2'>"+units+"</div></div>");  
            }
          }
          that.options['parameter_options'] = parameter_html;
        }
        
        that.$el.html(that.template(that.options));
        if(parameter_html !=''){
          $('.submitparam').show();
          $('.submitparam').prop('disabled', false);
        }

        $('.modal-title').html("<b>"+that.options.title);
      },

      error:function(collection, response, options) {
        that.$el.modal('hide');
        var m = new ModalDialogView();
          m.show({
            message: "Error Getting Command Data",
            type: "danger"
          });
      }
    });
    
  },

  executeCommand:function(button)
  {
    var that = this;
    
    var ref_des = that.options.variable;

    if(button.target.id =='submit_win_param'){
        //execute parameter changes
        var post_url_param = '/api/c2/'+this.options.ctype+'/'+ref_des+'/parameters';
        var param_list = {};

        //loop through and get all the parameters
        var theParameters = this.options['model'].value.metadata.parameters;

        for(var p in theParameters){
          if(theParameters[p].visibility == "READ_WRITE"){
            if(theParameters[p].value.type == 'int'){
              param_list[p]=parseInt($('#'+p).val());
            }
            //todo add validation for date
            else{
              param_list[p]=$('#'+p).val();
            }
          }
        }

        var post_data_param = {'resource':param_list,'timeout':60000};
        var data_param  = JSON.stringify(post_data_param, null, '\t');

        this.options.parameter_options= "<i style='color:#337ab7;margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
        this.$el.html(this.template(this.options));

        $.ajax({
          type: "POST",
          url: post_url_param,
          data: data_param,
          contentType: 'application/json;charset=UTF-8',
          dataType:'json',
          success: function(response){
            var m = new ModalDialogView();
            if(response.response.message == ''){
                m.show({
                message: "Settings Saved Successfully",
                type: "success"
              });

              that.render(that.options);
            }
            else{
                m.show({
                message: "Error Saving Settings:  "+response.response.message,
                type: "danger"
              });
              that.render(that.options);
            }  
          },
          error: function(){
            var m = new ModalDialogView();
            m.show({
              message: "Error Saving Settings",
              type: "danger"
            });
            that.render(that.options);
          }
        });
    }

    //for commands
    else if(button.target.id !='close_win_command'){
        //execute a command from the button
        var command = button.target.id;
        
        //aquire sample data
        if(command.search('ACQUIRE_SAMPLE')>-1){
            that.acquire('sample',ref_des)
        }
        //aquire status
        else if(command.search('ACQUIRE_STATUS')>-1){
            that.acquire('status',ref_des)
        }
        //all other commands
        else{
            var post_url = '/api/c2/'+this.options.ctype+'/'+ref_des+'/execute';

            var post_data = {'command':command,'timeout':60000};
            var data  = JSON.stringify(post_data, null, '\t');
            //arguments - optional
            //post_data['kwargs'] = command;

            this.options.command_options= "<i style='color:#337ab7;margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
            this.$el.html(this.template(this.options));

            $.ajax({
              type: "POST",
              url: post_url,
              data: data,
              contentType: 'application/json;charset=UTF-8',
              dataType:'json',
              success: function(response){
                var m = new ModalDialogView();
                if(response.response.message == ''){
                    m.show({
                    message: "Command Executed Successfully",
                    type: "success"
                  });

                  that.render(that.options);
                }
                else{
                    m.show({
                    message: "Error Executing Command:  "+response.response.message,
                    type: "danger"
                  });
                  that.render(that.options);
                }  
              },
              error: function(){
                var m = new ModalDialogView();
                m.show({
                  message: "Error Executing Command",
                  type: "danger"
                });
                that.render(that.options);
              }
            });
        }
    }
  },

  //aquire latest values
  acquire: function(type,ref_des)
  {
      var m = new ModalDialogView();
      //check status
      if(type=='status'){
          m.show({
            message: "<div><h3>Current Status</h3></div><hr> <div style='font-size:12px;font-weight:bold;margin-bottom: -17px;font-style: italic;margin-top: 12px;' class='row' ><div class='col-md-4'>Parameter Name</div><div class='col-md-4'>Description</div><div style='right:25px' class='col-md-2'>Value</div></div>",
            type: "info"
          });
      }
      //sample data
      else{
          m.show({
            message: "<div><h3>Current Sample Values</h3></div><hr><div style='font-size:12px;font-weight:bold;margin-bottom: -17px;font-style: italic;margin-top: 12px;' class='row' ><div class='col-md-4'>Parameter Name</div><div class='col-md-4'>Description</div><div style='right:25px' class='col-md-2'>Value</div>",
            type: "info"
          });
      }
  }
});
