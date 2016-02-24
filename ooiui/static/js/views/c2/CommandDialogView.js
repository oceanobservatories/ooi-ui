"use strict";
/*
 * ooiui/static/js/views/common/CommandDialogView.js
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
    'click button': 'executeCommand',
    'change #available_streams': 'getParticle'
  },

  getParticle: function(event) {
    this.options['selected_stream_method'] = event.target.selectedOptions[0].value;
    this.options['selected_stream_name'] = event.target.selectedOptions[0].text;
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
    _.bindAll(this, "render", "hidden", "getParticle");
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
          var buttons = '<div style="margin-bottom: 9px;"><i>Click to Execute Command</i></div>';
          var theCommands = response.value.capabilities[0];

          for(var c in theCommands){
            if(response.value.metadata.commands[theCommands[c]]){
                buttons = buttons.concat("<button style='margin-left: 7px;' type='button' data="+theCommands[c]+" class='btn btn-default' id="+theCommands[c]+" aria-pressed='false' autocomplete='off'>"+response.value.metadata.commands[theCommands[c]].display_name+"</button>");  
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
            var units = '';
            if(response.value.metadata.parameters[p].value['units']){
              units = response.value.metadata.parameters[p].value['units'];
            }
            var cell_value = '';
            if(response.value.metadata.parameters[p].value['type']){
              //TODO: Add other types
              if(response.value.metadata.parameters[p].value['type'] == 'string') {
                cell_value = '"'+response.value.parameters[p]+'"';
              }
              else{
                cell_value = response.value.parameters[p];
              }
            }
            //console.log('raw_value ', response.value.parameters[p]);
            //console.log('cell_value ', cell_value);
            if(response.value.metadata.parameters[p].visibility == "READ_WRITE"){
                parameter_html = parameter_html.concat("<div style='font-size:12px;height:inherit;' class='row' ><div class='col-md-4'>"+response.value.metadata.parameters[p].display_name+"</div><div style='font-style: italic;' class='col-md-4'>"+response.value.metadata.parameters[p].description+"</div><div class='col-md-2'><input id="+p+" value="+cell_value+"></input></div><div style='font-style: italic;right:-55px' class='col-md-2'>"+units+"</div></div>");
            } 
            //disable this parameter from editing     
            else{
                parameter_html = parameter_html.concat("<div style='font-size:12px;height:inherit;' class='row' ><div class='col-md-4'>"+response.value.metadata.parameters[p].display_name+"</div><div style='font-style: italic;' class='col-md-4'>"+response.value.metadata.parameters[p].description+"</div><div class='col-md-2'><input id="+p+" disabled value="+cell_value+"></input></div><div style='font-style: italic;right:-55px' class='col-md-2'>"+units+"</div></div>");
            }
          }
          that.options['parameter_options'] = parameter_html;

          // Get the available streams and put in drop-down list
          var theStreams = that.options['model'].streams;
          var stream_select = '';
          for(var stream in theStreams) {
            var streamValue = theStreams[stream];
            stream_select+="<option value="+streamValue+">"+stream+"</option>";
          }
          that.options['available_streams'] = stream_select;
        }
        
        that.$el.html(that.template(that.options));
        if(parameter_html !=''){
          that.$el.find('.submitparam').show();
          that.$el.find('.submitparam').prop('disabled', false);
        }

        that.$el.find('.modal-title').html("<b>"+that.options.title);
        if(response.value){
          that.$el.find('.modal-subtitle').html("State: "+String(response.value.state).split('_').join(' '));  
        }
        that.$el.find('.modal-content').resizable();
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
    if(button.target.id =='refresh_win_param'){
      that.render(that.options);
      that.options.parameter_options= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
      that.options.command_options= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
      that.$el.html(this.template(this.options));
    }
    else if(button.target.id =='plot_c2'||button.target.className.search('chart')>-1){
      var ref_array = ref_des.split('-');
      var plot_url = '/plotting/'+ref_des.substring(0, 2)+'/'+ref_array[0]+'/'+ref_array[1]+'/'+ref_des;

      //plotting/CP/CP05MOAS/GL001/CP05MOAS-GL001-05-PARADM000
      window.open(plot_url,'_blank');
    }
    // Get the last particle
    else if(button.target.id =='get_particle'){
      console.log('clicked get_particle');

      var particle_url = '/api/c2/'+that.options.ctype+'/'+that.options.variable+'/'+'get_last_particle'+'/'+that.options.selected_stream_method+'/'+that.options.selected_stream_name;
      console.log(particle_url);

      var processParticle = function(data) {
        console.log(data);
        that.options['last_particle'] = data;
        console.log(that.options['last_particle']);

        var html_sample = "<div><h4>Last Particle</h4></div><hr><div style='font-size:12px;font-weight:bold;margin-bottom: -17px;font-style: italic;margin-top: 12px;' class='row' ><div class='col-md-6'>Parameter Name</div><div style='' class='col-md-6'>Value</div><hr style='margin-bottom:28px'></div>";

        var data_sample = that.options['last_particle'];
        for (var a in data_sample) {
          console.log('data_sample[a]: ' + data_sample[a]);
          if (!(data_sample[a] instanceof Object) && a.search('timestamp') < 0) {
            var val_data = data_sample[a];
            //if (a == 'time') {
            //  val_data = new Date(data_sample[a]).toJSON();
            //}
            html_sample += "<div style='' class='row' ><div style='font-weight:bold;' class='col-md-6'>" + String(a).split('_').join(' ') + "</div><div style='' class='col-md-6'>" + val_data + "</div></div>";
          }
        }
        console.log(html_sample);
        var m = new ModalDialogView();
        m.show({
          message: html_sample,
          type: "success"
        });
      };

      $.ajax( particle_url, {
        type: 'GET',
        dataType: 'json',
        success: function( resp ) {
          console.log('success: '+ resp);
          processParticle( resp );
        },
        error: function( req, status, err ) {
          var errorMessage = '<div><h4>An error occured processing the returned JSON object</h4></div>';
          errorMessage += '<div>' + status + '</div>';
          errorMessage += '<div>' + err + '</div>';
          var errorModal = new ModalDialogView();
          errorModal.show({
            message: errorMessage,
            type: "danger"
          });
          console.log( 'something went wrong', status, err );
        }
      });
    }
    else if(button.target.id =='submit_win_param'){
        //execute parameter changes
        var param_model = new ParameterModel();
        param_model.url = '/api/c2/'+this.options.ctype+'/'+ref_des+'/parameters';
        
        //loop through and get all the parameters
        var theParameters = this.options['model'].value.metadata.parameters;
        var param_list = {};

        for(var p in theParameters){
          if(theParameters[p].visibility == "READ_WRITE"){
            if(theParameters[p].value.type == 'int'){
              param_list[p]=parseInt(this.$el.find('#'+p).val());
            }
            //todo add validation for date
            else{
              param_list[p]=this.$el.find('#'+p).val();
              console.log('param', this.$el.find('#'+p).val());
            }
          }
        }

        param_model.set('resource',param_list);
        /*var post_data_param = {'resource':param_list,'timeout':60000};
        var data_param  = JSON.stringify(post_data_param, null, '\t');*/

        this.options.parameter_options= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
        this.$el.html(this.template(this.options));

        param_model.save({},{
          success: function(response){
              var m = new ModalDialogView();
              if(response.attributes.response.message == ''){
                  m.show({
                  message: "Settings Saved Successfully",
                  type: "success"
                });

                that.render(that.options);
              }
              else{
                  m.show({
                  message: "Error Saving Settings:  "+response.attributes.response.message,
                  type: "danger"
                });
                that.render(that.options);
              }  
            },
            error: function(response){
              console.log(response);
              var m = new ModalDialogView();
              m.show({
                message: "Error Saving Settings (dict here):  ",
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
        that.command = '';

        //aquire sample data
        if(command.search('ACQUIRE_SAMPLE')>-1){
            //that.acquire('sample',ref_des)
            that.command = 'sample';
        }
        //aquire status
        else if(command.search('ACQUIRE_STATUS')>-1){
            //that.acquire('status',ref_des)
            that.command = 'status';
        }       

        var command_model = new CommandModel();
        command_model.url = '/api/c2/'+this.options.ctype+'/'+ref_des+'/execute';
        command_model.set('command',command);

        this.options.command_options= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
        this.$el.html(this.template(this.options));
        
        command_model.save({},{
          success: function(response){
            var m = new ModalDialogView();
            if(response.attributes.response.message != ''){
                m.show({
                message: "Error Executing Command:  "+response.attributes.response.message,
                type: "danger"
              });
            } 
            else if(that.command=='status'){
                var html_status = "<div><h4>Current Status</h4></div><hr><div style='font-size:12px;font-weight:bold;margin-bottom: -17px;font-style: italic;margin-top: 12px;' class='row' ><div class='col-md-6'>Status Name</div><div style='' class='col-md-6'>Value</div></div><hr>";
                
                if(response.changed.acquire_result){
                  //get the latest sample
                  var data_status = response.changed.acquire_result[response.changed.acquire_result.length-1];
                  console.log(data_status);
                  for(var a in data_status){
                    var val_data = data_status[a];
                    if(a=='time'){
                        val_data = new Date(data_status[a]).toJSON();
                    }
                    if(!(data_status[a] instanceof Object)&&a.search('timestamp')<0){
                      html_status+="<div style='' class='row' ><div style='font-weight:bold;' class='col-md-6'>"+String(a).split('_').join(' ')+"</div><div style='' class='col-md-6'>"+val_data+"</div></div>";
                    }                    
                  }
                }

                m.show({
                  message: html_status,
                  type: "info"
                });  
            }
            //sample data
            else if(that.command=='sample'){
              var html_sample = "<div><h4>Current Sample Values</h4></div><hr><div style='font-size:12px;font-weight:bold;margin-bottom: -17px;font-style: italic;margin-top: 12px;' class='row' ><div class='col-md-6'>Parameter Name</div><div style='' class='col-md-6'>Value</div><hr style='margin-bottom:28px'></div>";

              if(response.changed.acquire_result){
                console.log(response.changed.acquire_result);
                //get the latest sample
                var data_sample = response.changed.acquire_result[response.changed.acquire_result.length-1];
                console.log(data_sample);
                for(var a in data_sample){
                  if(!(data_sample[a] instanceof Object)&&a.search('timestamp')<0){
                    var val_data = data_sample[a];
                    if(a=='time'){
                        val_data = new Date(data_sample[a]).toJSON();
                    }
                    html_sample+="<div style='' class='row' ><div style='font-weight:bold;' class='col-md-6'>"+String(a).split('_').join(' ')+"</div><div style='' class='col-md-6'>"+val_data+"</div></div>";
                  }
                }
              }

              m.show({
                message: html_sample,
                type: "info"
              }); 
            }

            else{
                m.show({
                message: "Command Executed Successfully",
                type: "success"
              });
            } 

            //refresh
            that.render(that.options);
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
});
