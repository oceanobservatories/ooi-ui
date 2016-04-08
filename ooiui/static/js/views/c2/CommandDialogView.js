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
    this.$el.find('#get_particle').prop('disabled', false);
    this.$el.find('#plot_c2').prop('disabled', false);
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
          var buttons = '<div style="margin-bottom: 5px;"><i>Click to Execute Command</i></div>';
          //var theCommands = response.value.capabilities[0];
          var theCommands = response.value.metadata.commands;
          // Sort those commands
          var keys = Object.keys(theCommands);
          keys.sort();
          //console.log(keys);
          for (var i=0; i<keys.length; i++) {
            var key = keys[i];
            //console.log(key);
            var value = theCommands[key];
            //console.log(value);
            //console.log(response.value.capabilities[0]);
            //console.log(response.value.capabilities[0].includes('"'+key+'"'));
            if(response.value.capabilities[0].includes(key)){
              buttons = buttons.concat("<button style='margin-left: 7px; padding-bottom: 3px;' type='button' data="+key+" class='btn btn-default' id="+key+" aria-pressed='false' autocomplete='off'>"+value.display_name+"</button>");
              //data-toggle='button'
            }
            else{
              //other none listed capabilities
              //buttons = buttons.concat("<div style='padding-top:12px;padding-left:15px;'><button type='button' id="+theCommands[c]+" data="+theCommands[c]+" class='btn btn-primary'  aria-pressed='false' autocomplete='off'>"+theCommands[c]+"</button></div>");
            }
          }
          //for(var c in theCommands){
          //  if(response.value.metadata.commands[theCommands[c]]){
          //    buttons = buttons.concat("<button style='margin-left: 7px; padding-bottom: 3px;' type='button' data="+theCommands[c]+" class='btn btn-default' id="+theCommands[c]+" aria-pressed='false' autocomplete='off'>"+response.value.metadata.commands[theCommands[c]].display_name+"</button>");
          //    //data-toggle='button'
          //  }
          //  else{
          //    //other none listed capabilities
          //    //buttons = buttons.concat("<div style='padding-top:12px;padding-left:15px;'><button type='button' id="+theCommands[c]+" data="+theCommands[c]+" class='btn btn-primary'  aria-pressed='false' autocomplete='off'>"+theCommands[c]+"</button></div>");
          //  }
          //}
          that.options['command_options'] = buttons;

          //console.log('trying to set submit param button state');
          //console.log(response);
          if(response.value.state=='DRIVER_STATE_COMMAND' || response.value.state=='DRIVER_STATE_UNKNOWN'){
            that.options['processing_state'] = '<div><i>Processing Offline</i></div>';
          }
          else{
            that.options['processing_state'] = "<i style='color:#337ab7;margin-left:20px' class='fa fa-spinner fa-spin fa-2x'></i>";
          }

          // Direct Access
          if(response.value.state=='DRIVER_STATE_DIRECT_ACCESS'){
            console.log('in direct access mode');
          }
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
          //console.log('theParameters');
          //console.log(theParameters);

          // Sort those commands
          keys = Object.keys(theParameters);
          keys.sort();
          //console.log(keys);
          for (var i=0; i<keys.length; i++) {
            key = keys[i];
            //console.log(key);
            var vmpValue = theParameters[key];
            var vpValue = response.value.parameters[key];

          //for(var p in theParameters){
            var units = '';
            if(vmpValue.value['units']){
              units = vmpValue.value['units'];
            }
            var cell_value = '';
            if(vmpValue.value['type']){
              //TODO: Add other types
              if(vmpValue.value['type'] == 'string') {
                cell_value = '"'+vpValue+'"';
              }
              else{
                cell_value = vpValue;
              }
            }
            //console.log('raw_value ', response.value.parameters[p]);
            //console.log('cell_value ', cell_value);
            if(vmpValue.visibility == "READ_WRITE"){
              //parameter_html = parameter_html.concat("<div style='font-size:12px;height:inherit;' class='row' ><div class='col-md-4'>"+vmpValue.display_name+"</div><div style='font-style: italic;' class='col-md-4'>"+vmpValue.description+"</div><div class='col-md-2'><input id="+key+" value="+cell_value+"></input></div><div style='font-style: italic;right:-55px' class='col-md-2'>"+units+"</div></div>");
              // Add drop-down parameter display values
              //console.log(response.parameter_display_values);
              //console.log(key);
              if(key in response.parameter_display_values){
                console.log(response.parameter_display_values[key]);
                var display_values = response.parameter_display_values[key];
                var drop_down = "";

                // Check value against display options
                for(var dv in display_values){
                  console.log(dv);
                  console.log(vpValue);
                  console.log(display_values[dv]==vpValue);
                  if(display_values[dv]==vpValue){
                    drop_down+="<option value='"+display_values[dv]+"' selected>"+dv+"</option>";
                  }
                  else{
                    drop_down+="<option value='"+display_values[dv]+"'>"+dv+"</option>";
                  }
                }
                parameter_html = parameter_html.concat("<div style='font-size:12px;height:inherit;' class='row' ><div class='col-md-4'>"+vmpValue.display_name+"</div><div style='font-style: italic;' class='col-md-4'>"+vmpValue.description+"</div><div class='col-md-2'><select id="+key+" value="+cell_value+">"+drop_down+"</select></div><div style='font-style: italic;right:-55px' class='col-md-2'>"+units+"</div></div>");
              }
              else{
                // It's not a drop-down, but still editable
                parameter_html = parameter_html.concat("<div style='font-size:12px;height:inherit;' class='row' ><div class='col-md-4'>"+vmpValue.display_name+"</div><div style='font-style: italic;' class='col-md-4'>"+vmpValue.description+"</div><div class='col-md-2'><input id="+key+" value="+cell_value+"></input></div><div style='font-style: italic;right:-55px' class='col-md-2'>"+units+"</div></div>");
              }
            }
            //disable this parameter from editing     
            else{
              parameter_html = parameter_html.concat("<div style='font-size:12px;height:inherit;' class='row' ><div class='col-md-4'>"+vmpValue.display_name+"</div><div style='font-style: italic;' class='col-md-4'>"+vmpValue.description+"</div><div class='col-md-2'><input id="+key+" disabled value="+cell_value+"></input></div><div style='font-style: italic;right:-55px' class='col-md-2'>"+units+"</div></div>");
            }
          }
          that.options['parameter_options'] = parameter_html;

          // Get the available streams and put in drop-down list
          var theStreams = that.options['model'].streams;
          var stream_select = '<option selected disabled="disabled">Select Stream</option>';
          for(var stream in theStreams) {
            var streamValue = theStreams[stream];
            stream_select+="<option value="+streamValue+">"+stream+"</option>";
          }
          that.options['available_streams'] = stream_select;
        }

        that.$el.html(that.template(that.options));
        if((parameter_html !='') && (response.value.state=='DRIVER_STATE_COMMAND')){
          that.$el.find('.submitparam').show();
          that.$el.find('.refreshparam').show();
          that.$el.find('.submitparam').prop('disabled', false);
          that.$el.find('#available_streams').prop('disabled', false);
        }

        // Direct Access
        if((parameter_html !='') && (response.value.capabilities[0].includes('DRIVER_EVENT_START_DIRECT'))){
          that.$el.find('#c2_direct_access').prop('disabled', false);
        }

        that.$el.find('.modal-title').html("<b>"+that.options.title);
        if(response.value){
          that.$el.find('.modal-subtitle').html("State: "+String(response.value.state).split('_').join(' '));
        }
        that.$el.find('.modal-content').resizable();
      },

      error:function(collection, response, options) {
        that.$el.modal('hide');
        var req = response;
        //console.log(collection);
        //console.log(response);
        //console.log(options);
        var errorMessage = '<div><h3>An error occured:</h3></div>';
        errorMessage += '<div><h4>' + req.statusText + '</h4></div>';
        errorMessage += '</br>';
        if(req.responseJSON){
          errorMessage += '<div><h4>' + req.responseJSON['message'] + '</h4></div>';
        }

        var errorModal = new ModalDialogView();
        errorModal.show({
          message: errorMessage,
          type: "danger"
        });
        //console.log( 'something went wrong', errorMessage );
      }
    });

  },

  executeCommand:function(button)
  {
    var that = this;

    var ref_des = that.options.variable;

    // Process particle (status, sample, particle) response to html
    var processParticle = function(response, title) {
      ////console.log(response);
      ////console.log(title);
      var m = new ModalDialogView();
      var html_header = "<div><h3>"+title+"</h3></div>";

      var combined_html = html_header;

      if(response.changed.acquire_result){
        ////console.log('acquire_result: ');
        ////console.log(response.changed.acquire_result);

        // Iterate over the status particles
        for(var data_status in response.changed.acquire_result){
          var html_parameter_header = "<hr style='margin-top:28px'>STREAM_TITLE<div style='font-size:12px;font-weight:bold;margin-bottom: -17px;font-style: italic;margin-top: 12px;' class='row' ><div class='col-md-6'>Parameter Name</div><div style='' class='col-md-6'>Value</div><hr style='margin-bottom:28px'></div>";
          var parameter_sample = "";

          // particle_metadata
          var particle_metadata = response.changed.acquire_result[data_status]['particle_metadata'];

          // particle_values
          var particle_values = response.changed.acquire_result[data_status]['particle_values'];

          // Get the stream_name from the particle_metadata
          var stream_name = "unknown stream";
          if('stream_name' in particle_metadata){
            stream_name = particle_metadata['stream_name'].split('_').join(' ');
          }
          else if('stream' in particle_metadata){
            stream_name = particle_metadata['stream'].split('_').join(' ');
          }

          var stream_title="<div><h4>"+stream_name+" (metadata)</h4></div>";
          combined_html+=html_parameter_header.replace(/STREAM_TITLE/g, stream_title);

          // Iterate over the attributes in particle_metadata
          for(var pm in particle_metadata){
            var pm_data = particle_metadata[pm];
            if(pm!='stream_name'){
              parameter_sample+="<div style='' class='row' ><div style='font-weight:bold;' class='col-md-6'>"+String(pm).split('_').join(' ')+"</div><div style='' class='col-md-6'>"+pm_data+"</div></div>";
            }
          }
          combined_html+=parameter_sample;
          stream_title="<div><h4>"+stream_name+" (values)</h4></div>";
          combined_html+=html_parameter_header.replace(/STREAM_TITLE/g, stream_title);
          parameter_sample = "";

          // Iterate over the attributes in particle_values
          for(var pv in particle_values){
            var pv_data = particle_values[pv];
            if(pv!='stream_name'){
              parameter_sample+="<div style='' class='row' ><div style='font-weight:bold;' class='col-md-6'>"+String(pv).split('_').join(' ')+"</div><div style='' class='col-md-6'>"+pv_data+"</div></div>";
            }
          }
          combined_html+=parameter_sample;
        }
      }
      // Display the results in modal popup
      m.show({
        message: combined_html,
        type: "success"
      });
      //that.options['processing_state'] = '<div><i>Processing Offline</i></div>';
      //that.$el.html(that.template(that.options));
      that.$el.find('#refresh_win_param').click();
    };

    // Refresh dialog
    if(button.target.id =='refresh_win_param'){
      that.render(that.options);
      that.options.parameter_options= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
      that.options.command_options= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
      that.options.processing_state= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
      that.$el.html(this.template(this.options));
    }
    // Plotting redirect
    else if(button.target.id =='plot_c2'||button.target.className.search('chart')>-1){
      var plot_url = '/plotting/#'+ref_des+'/'+that.options.selected_stream_method+'_'+that.options.selected_stream_name.replace(/_/g, '-');

      //plotting/#CP05MOAS-GL001-05-PARADM000/<steam_method>_<stream-name>
      window.open(plot_url,'_blank');
    }
    // Direct Access - Start
    else if(button.target.id =='c2_direct_access'){
      // Build the direct access
      var direct_access_start_url = '/api/c2/'+that.options.ctype+'/'+that.options.variable+'/'+'direct_access/start';

      $.ajax( direct_access_start_url, {
        type: 'GET',
        dataType: 'json',
        success: function( resp ) {
          that.$el.find('#c2_direct_access').prop('disabled', true);
          that.$el.find('#c2_direct_access_launch').prop('disabled', false);
          that.$el.find('#c2_direct_access_exit').prop('disabled', false);
          console.log('success starting direct access: ');
          console.log(resp);
          var m = new ModalDialogView();

          m.show({
            message: "Started Direct Access Successfully",
            type: "success"
          });

        },
        error: function( req, status, err ) {
          //console.log(req);
          var errorMessage = '<div><h3>An error occurred starting direct access:</h3></div>';
          errorMessage += '<div><h4>' + req.statusText + '</h4></div>';
          errorMessage += '</br>';
          if(req.responseJSON){
            errorMessage += '<div><h4>' + req.responseJSON['message'] + '</h4></div>';
          }

          var errorModal = new ModalDialogView();
          errorModal.show({
            message: errorMessage,
            type: "danger"
          });
        }
      });
    }
    // Direct Access - Launch
    else if(button.target.id =='c2_direct_access_launch'){
// Build the direct access
      var direct_access_execute_url = '/api/c2/'+that.options.ctype+'/'+that.options.variable+'/'+'direct_access/execute';

      $.ajax( direct_access_execute_url, {
        type: 'GET',
        dataType: 'json',
        success: function( resp ) {
          that.$el.find('#c2_direct_access').prop('disabled', true);
          that.$el.find('#c2_direct_access_launch').prop('disabled', false);
          that.$el.find('#c2_direct_access_exit').prop('disabled', false);
          console.log('success starting direct access: ');
          console.log(resp);
          var m = new ModalDialogView();

          m.show({
            message: "Launched (executed) Direct Access Successfully",
            type: "success"
          });

        },
        error: function( req, status, err ) {
          //console.log(req);
          var errorMessage = '<div><h3>An error occurred starting direct access:</h3></div>';
          errorMessage += '<div><h4>' + req.statusText + '</h4></div>';
          errorMessage += '</br>';
          if(req.responseJSON){
            errorMessage += '<div><h4>' + req.responseJSON['message'] + '</h4></div>';
          }

          var errorModal = new ModalDialogView();
          errorModal.show({
            message: errorMessage,
            type: "danger"
          });
        }
      });
    }
    // Direct Access - Exit
    else if(button.target.id =='c2_direct_access_exit'){
      // Build the direct access
      var direct_access_exit_url = '/api/c2/'+that.options.ctype+'/'+that.options.variable+'/'+'direct_access/exit';

      $.ajax( direct_access_exit_url, {
        type: 'GET',
        dataType: 'json',
        success: function( resp ) {
          that.$el.find('#c2_direct_access').prop('disabled', false);
          that.$el.find('#c2_direct_access_launch').prop('disabled', true);
          that.$el.find('#c2_direct_access_exit').prop('disabled', true);
          console.log('success starting direct access: ');
          console.log(resp);
          var m = new ModalDialogView();

          m.show({
            message: "Exited Direct Access Successfully",
            type: "success"
          });

        },
        error: function( req, status, err ) {
          //console.log(req);
          var errorMessage = '<div><h3>An error occurred exiting direct access:</h3></div>';
          errorMessage += '<div><h4>' + req.statusText + '</h4></div>';
          errorMessage += '</br>';
          if(req.responseJSON){
            errorMessage += '<div><h4>' + req.responseJSON['message'] + '</h4></div>';
          }

          var errorModal = new ModalDialogView();
          errorModal.show({
            message: errorMessage,
            type: "danger"
          });
        }
      });
    }
    // Get the last particle
    else if(button.target.id =='get_particle'){
      // Build the particle url
      var particle_url = '/api/c2/'+that.options.ctype+'/'+that.options.variable+'/'+'get_last_particle'+'/'+that.options.selected_stream_method+'/'+that.options.selected_stream_name;
      //console.log(particle_url);

      that.options['processing_state'] = "<i style='color:#337ab7;margin-left:20px' class='fa fa-spinner fa-spin fa-2x'></i>";
      that.$el.html(that.template(that.options));

      $.ajax( particle_url, {
        type: 'GET',
        dataType: 'json',
        success: function( resp ) {
          //console.log('success retrieving particle: ');
          //console.log(resp);
          // response.changed.acquire_result
          var particleResponse = {};
          particleResponse['changed'] = {};
          particleResponse['changed']['acquire_result'] = [];
          particleResponse['changed']['acquire_result'][0]= resp;
          //console.log('particleResponse');
          //console.log(particleResponse);
          processParticle(particleResponse, 'Last Particle');
        },
        error: function( req, status, err ) {
          //console.log(req);
          var errorMessage = '<div><h3>An error occured:</h3></div>';
          errorMessage += '<div><h4>' + req.statusText + '</h4></div>';
          errorMessage += '</br>';
          if(req.responseJSON){
            errorMessage += '<div><h4>' + req.responseJSON['message'] + '</h4></div>';
          }

          var errorModal = new ModalDialogView();
          errorModal.show({
            message: errorMessage,
            type: "danger"
          });
          //console.log( 'something went wrong', status, err );
        }
      });
    }
    // Submit form parameter(s)
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
            //console.log('param', this.$el.find('#'+p).val());
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
          //console.log('param save response');
          //console.log(response);

          var m = new ModalDialogView();
          if(response.attributes.response.status_code == 200){
            m.show({
              message: "Settings Saved Successfully",
              type: "success"
            });

            that.render(that.options);
          }
          else{
            // Generate the error message from the message, status_code and range_errors
            var range_error_response = "";
            var error_response_header="<table><tr><td class='error_message_header'>Parameter</td><td class='error_message_header'>Error Message</td></tr>";
            if(response.attributes.response.range_errors!=""){
              var range_error_rows = "";
              for(var re in response.attributes.response.range_errors){
                range_error_rows+="<tr><td class='error_message_column_desc'>"+response.attributes.response.range_errors[re].display_name+":</td><td class='error_message_column_text'>"+response.attributes.response.range_errors[re].message+"</td></tr>";
              }
              var range_error_response="</br><hr><div>"+error_response_header+range_error_rows+"</div>";
            }

            m.show({
              message: "Error Saving Settings: "+response.attributes.response.message+range_error_response,
              type: "danger"
            });
            that.render(that.options);
          }
        },
        error: function(response){
          //console.log(response);
          var m = new ModalDialogView();
          m.show({
            message: "Error Saving Settings:  ",
            type: "danger"
          });
          that.render(that.options);
        }
      });
    }
    // Clicked a command button
    else if(button.target.id !='close_win_command'){
      //execute a command from the button
      var command = button.target.id;
      that.command = '';

      //acquire sample data
      if(command.search('ACQUIRE_SAMPLE')>-1){
        //that.acquire('sample',ref_des)
        that.command = 'sample';
      }
      //acquire status
      else if(command.search('ACQUIRE_STATUS')>-1){
        //that.acquire('status',ref_des)
        that.command = 'status';
      }

      var command_model = new CommandModel();
      command_model.url = '/api/c2/'+this.options.ctype+'/'+ref_des+'/execute';
      command_model.set('command',command);

      this.options.command_options= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
      this.options.processing_state= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
      this.$el.html(this.template(this.options));

      command_model.save({},{
        success: function(response){
          var m = new ModalDialogView();
          if(response.attributes.response.message != ''){
            console.log('Error Executing Command:');
            console.log(response);
            var errorMessage = '<div><h3>Error Executing Command:</h3></div>';
            errorMessage += '<div><h4>' + response.attributes.response.message + '</h4></div>';
            errorMessage += '</br>';
            if(response.responseJSON){
              errorMessage += '<div><h4>' + response.responseJSON['message'] + '</h4></div>';
            }
            m.show({
              message: errorMessage,
              type: "danger"
            });
          }
          //STATUS
          else if(that.command=='status'){
            processParticle(response, 'Current Status');
          }
          //sample data
          else if(that.command=='sample'){
            //console.log('Acquire Sample: ');
            //console.log(response);
            // Check is async
            if(response.changed.acquire_result.length==0) {
              //console.log('Waiting for async result');
              // Wait for async response for drive state change
              var doneProcessingParticle = false;

              var pollStatus = function () {
                if (doneProcessingParticle) {
                  //console.log('get out of here!!!!');
                  //console.log(response);
                  //console.log('now we need to somehow get the data without causing another command state change');

                  // Refresh the modal
                  that.$el.find('#refresh_win_param').click();

                  m.show({
                    message: "<div><h3>Async Sample Acquired</h3></div><div style='padding-top: 30px;'><hr>You can request the last particle of data in the Stream Actions section of this page.</div>",
                    type: "success"
                  });

                  // Done processing retrieved sample data, return from function
                  return 'done';
                }

                $.ajax('/api/c2/instrument/' + ref_des + '/commands', {
                  type: 'GET',
                  dataType: 'json',
                  success: function (resp) {
                    //console.log('success waiting for async particle: ');
                    //console.log(resp);
                    //console.log(resp.value.state);

                    command_model.set('driver_state', resp.value.state);

                    if (resp.value.state == "DRIVER_STATE_COMMAND") {
                      doneProcessingParticle = true;
                    }
                  },
                  complete: pollStatus,
                  timeout: 50000,
                  async: true,
                  error: function (xhr) {
                    setTimeout(pollStatus, 50000);
                  },
                  error: function( req, status, err ) {
                    //console.log(req);
                    var errorMessage = '<div><h3>An error occured:</h3></div>';
                    errorMessage += '<div><h4>' + req.statusText + '</h4></div>';
                    errorMessage += '</br>';
                    if(req.responseJSON){
                      errorMessage += '<div><h4>' + req.responseJSON['message'] + '</h4></div>';
                    }

                    var errorModal = new ModalDialogView();
                    errorModal.show({
                      message: errorMessage,
                      type: "danger"
                    });
                    //console.log(errorMessage);
                  }
                });
              };
              // Poll for state change after submitting acquire sample request
              pollStatus();
            }
            else {
              processParticle(response, 'Current Sample');
            }

          }
          // All other commands
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
