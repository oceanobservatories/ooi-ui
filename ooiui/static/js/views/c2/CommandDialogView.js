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

var socket = "";

var CommandDialogView = Backbone.View.extend({
  className: 'modal fade',

  events: {
    'hidden.bs.modal' : 'hidden',
    'click button': 'executeCommand',
    'change #available_streams': 'getParticle',
    'change #instrument_select': 'selectInstrument'
  },

  getParticle: function(event) {
    this.options['selected_stream_method'] = event.target.selectedOptions[0].value;
    this.options['selected_stream_name'] = event.target.selectedOptions[0].text;
    this.options['available_streams_index'] = event.target.selectedIndex;
    this.$el.find('#get_particle').prop('disabled', false);
    this.$el.find('#plot_c2').prop('disabled', false);
  },

  selectInstrument: function(event) {
    var that = this;
    //console.log('event');
    //console.log(event);
    //console.log('options1111');
    //console.log(that.options);
    //console.log('options1111');
    if(event.target.options[event.target.selectedIndex].value!='empty'){
      that.$el.find("#da_command_buttons").prop('hidden', false);
      that.options['selected_instrument_index'] = event.target.selectedIndex;
      that.options['selected_instrument'] = event.target.options[that.options.selected_instrument_index].value;

      // Sniffer stuff
      var returnedData = $.grep(that.options.direct_config, function (element) {
        return element.title.indexOf(that.options.selected_instrument) >= 0;
      });
      //console.log('returned data');
      //console.log(returnedData);
      that.options['selected_instrument_ip'] = returnedData[0].ip;
      that.options['selected_instrument_data_port'] = returnedData[0].data;
      that.options['selected_instrument_sniffer_port'] = returnedData[0].sniffer;

      that.$el.find('#start_sniffer').prop('disabled', false);
      that.$el.find("#stop_sniffer").prop('disabled', true);

      //console.log('options');
      //console.log(that.options);
    }else{
      that.$el.find("#da_command_buttons").prop('hidden', true);
      that.options['selected_instrument'] = 'empty';
      that.options['selected_instrument_index'] = 0;
    }



    //var namespace = '/test'; // change to an empty string to use the global namespace
    //if(socket.connected){
    //  socket.close();
    //}
    //
    //socket = io.connect('http://' + '10.0.0.14:5005' + namespace);
    ////console.log(socket);
    //// the socket.io documentation recommends sending an explicit package upon connection
    //// this is specially important when using the global namespace
    //socket.on('connect', function() {
    //  //socket.emit('my event', {data: 'I\'m connected from ooi-ui!'});
    //});
    //
    ////socket.emit('get sniffer', JSON.stringify({"ip": that.options.selected_instrument_ip, "port": that.options.selected_instrument_sniffer_port}));
    //
    //socket.on('my result', function(msg) {
    //  //console.log('got a msg: ');
    //  //console.log(msg);
    //  that.$el.find('#direct-output-ta').append(msg.data);
    //  that.$el.find('#direct-output-ta').scrollTop(that.$el.find('#direct-output-ta')[0].scrollHeight);
    //});
    //
    //socket.on('disconnect', function() {
    //  // removes the handler for this specific socket,
    //  // leaving the others intact
    //  //ee.removeListener('update', onUpdate);
    //  socket.close();
    //});

    //var namespace = '/c2_direct_access'; // change to an empty string to use the global namespace
    //
    //socket = io.connect('http://' + '10.0.0.14:5000' + namespace);
    ////var theRoom = {"room": snifferRoom};
    ////socket.emit('join', JSON.stringify({"room": snifferRoom}));
    ////socket.join(snifferRoom); // Not supported on client side
    //
    //socket.on('my result', function(msg) {
    //  console.log('got a msg: ');
    //  console.log(msg);
    //  that.$el.find('#direct-output-ta').append('emit message');
    //  that.$el.find('#direct-output-ta').append(msg);
    //  that.$el.find('#direct-output-ta').scrollTop(that.$el.find('#direct-output-ta')[0].scrollHeight);
    //});

    // Commands buttons
    //var theButtons = response.value.direct_config[0].input_dict;
    var theButtons = $.grep(that.options['direct_config'], function(e) { return e.title == event.target.selectedOptions[0].value })[0].input_dict;
    var btnKeys = Object.keys(theButtons);

    btnKeys.sort();
    //console.log(btnKeys);

    var daButtons = "";
    for (var ii=0; ii<btnKeys.length; ii++) {
      var btnKey = btnKeys[ii];
      var btnKeyValue = theButtons[btnKey];
      //console.log(btnKey);
      //console.log(btnKeyValue);
      daButtons += "<button type=\"button\" class=\"btn btn-primary\" style='margin-top:2px; margin-left:1px;' id=\""+btnKey+"\" value='preset_button' title='"+btnKeyValue+"'><i class=\"fa fa-chevron-circle-right\"> </i>"+btnKey+"</button>";
    }
    that.options['direct_access_buttons'] = "<div style='margin-top:4px;'>"+daButtons+"</div>";

    that.$el.html(that.template(that.options));
    that.$el.find("#instrument_select")[0].selectedIndex = that.options.selected_instrument_index;
    that.$el.find("#instrument_select")[0].options[that.options.selected_instrument_index].selected = true;
    if((that.options.model.value.state=='DRIVER_STATE_DIRECT_ACCESS')){
      that.$el.find('#c2_direct_access').prop('disabled', true);
      that.$el.find('#c2_direct_access_exit').prop('disabled', false);
      this.$el.find("#main_div").prop('hidden', true);
      that.$el.find("#direct_access_div").prop('hidden', false);
    }
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
    _.bindAll(this, "render", "hidden", "getParticle", "selectInstrument");
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

    that.$el.find("#main_div").prop('hidden', true);
    that.$el.find("#direct_access_div").prop('hidden', true);
    that.$el.find('#start_sniffer').prop('disabled', true);
    //var socket = "";
    commandist.fetch({
      success: function(collection, response, options) {
        //console.log(response);

        that.options['instrument_state'] = response.value.state;
        that.options['title'] = "<b>"+that.options.title+"</b>";
        that.options['refresh_state'] = "";

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
            //that.options['processing_state'] = "<i style='color:#337ab7;margin-left:20px' class='fa fa-spinner fa-spin fa-2x'></i>";
          }

          // Direct Access
          if(response.value.state=='DRIVER_STATE_DIRECT_ACCESS'){
            //console.log('in direct access mode');
            // Hide the main_div and just show the direct access div
            //that.$el.find("#main_div").prop('hidden', true);
            //that.$el.find("#direct_access_div").prop('hidden', false);
            // Direct Access Output
            //var namespace = '/test'; // change to an empty string to use the global namespace
            //socket = io.connect('http://' + that.options.selected_instrument_ip + 'ooi.rutgers.edu:' + that.options.selected_instrument_sniffer_port + namespace);
            ////console.log(socket);
            //// the socket.io documentation recommends sending an explicit package upon connection
            //// this is specially important when using the global namespace
            //socket.emit('get sniffer', {data: 'ip:port'});


            //// event handler for new connections
            //socket.on('connect', function() {
            //  socket.emit('my event', {data: 'I\'m connected from ooi-ui!'});
            //});
            //
            //socket.on('my response', function(msg) {
            //  //console.log('got a msg: ');
            //  //console.log(msg);
            //  that.$el.find('#direct-output-ta').append(msg.data);
            //  that.$el.find('#direct-output-ta').scrollTop(that.$el.find('#direct-output-ta')[0].scrollHeight);
            //});

            //socket.on('connect', function(socket) {
            //  // every socket gets a closure
            //  // and a distinct onUpdate function object
            //  function onUpdate(data) {
            //    socket.emit('update', data);
            //  }
            //  ee.on('update', onUpdate);
            //
            //  socket.on('disconnect', function() {
            //    // removes the handler for this specific socket,
            //    // leaving the others intact
            //    ee.removeListener('update', onUpdate);
            //  });
            //});

            // Tabbed instruments
            var theInstruments = response.value.direct_config;
            //console.log(theInstruments);
            var theTabs = "<option value='empty' disabled selected>Select Instrument</option>";;
            var tabHtml = "";
            for (var ti=0; ti<theInstruments.length; ti++) {
              var theTab=theInstruments[ti];
              //console.log(theTab.title);
              if(ti==0){
                //theTabs += "<li class=\"active\"><a href=\"#\" id='"+theTab.title+"'>"+theTab.title+"</a></li>";
                theTabs += "<option value='"+theTab.title+"'>"+theTab.title+"</option>";
              }else{
                //theTabs += "<li><a href=\"#\" id='"+theTab.title+"'>"+theTab.title+"</a></li>";
                theTabs += "<option value='"+theTab.title+"'>"+theTab.title+"</option>";
              }
            }
            tabHtml += "<div style='font-size:12px;height:inherit;' class='row' ><div class='col-md-2'><select id='instrument_select'>"+theTabs+"</select></div></div>";
            //tabHtml += "<div style='font-size:12px;height:inherit;' class='row' ><div class='col-md-2'>"+theTabs+"</div></div>";

            that.options['direct_access_tabs'] = tabHtml;

            that.options['direct_config'] = response.value.direct_config;
            //// Commands buttons
            //var theButtons = response.value.direct_config[0].input_dict;
            //var btnKeys = Object.keys(theButtons);
            //
            //btnKeys.sort();
            //console.log(btnKeys);
            //
            //var daButtons = "";
            //for (var ii=0; ii<btnKeys.length; ii++) {
            //  var btnKey = btnKeys[ii];
            //  var btnKeyValue = theButtons[btnKey];
            //  //console.log(btnKey);
            //  //console.log(btnKeyValue);
            //  daButtons += "<button type=\"button\" class=\"btn btn-primary\" style='margin-top:2px; margin-left:1px;' id=\""+btnKeyValue+"\"><i class=\"fa fa-floppy-o\"> </i>"+btnKey+"</button>";
            //}
            //that.options['direct_access_buttons'] = "<div style='margin-top:4px;'>"+daButtons+"</div>";
          } else {
            //console.log('not in direct access');
            //console.log(that);
            //that.$el.find("#direct_access_div").prop('hidden', true);
            //that.$el.find("#main_div").prop('hidden', false);
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
                //console.log(response.parameter_display_values[key]);
                var display_values = response.parameter_display_values[key];
                var drop_down = "";

                // Check value against display options
                for(var dv in display_values){
                  //console.log(dv);
                  //console.log(vpValue);
                  //console.log(display_values[dv]==vpValue);
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

        // Set the selected stream to last chosen
        if(that.options.available_streams_index > 0){
          that.$el.find("#available_streams")[0].selectedIndex = that.options.available_streams_index;
          that.$el.find("#available_streams")[0].options[that.options.available_streams_index].selected = true;
          that.$el.find('#get_particle').prop('disabled', false);
          that.$el.find('#plot_c2').prop('disabled', false);
        }

        if((parameter_html !='') && (response.value.state=='DRIVER_STATE_COMMAND')){
          //that.$el.find('.submitparam').show();
          //that.$el.find('.refreshparam').show();
          //that.$el.find('.submitparam').prop('disabled', false);
          //that.$el.find('#available_streams').prop('disabled', false);
          that.$el.find('#c2_direct_access').prop('disabled', false);
          that.$el.find('#c2_direct_access_exit').prop('disabled', true);
          //that.$el.find("#direct_access_div").prop('hidden', true);
        }

        // Apply Setting allowed if SET in capabilities
        if((parameter_html !='') && (response.value.capabilities[0].includes('DRIVER_EVENT_SET'))){
          //that.$el.find('.submitparam').show();
          that.$el.find('.submitparam').prop('disabled', false);
        }

        // Direct Access
        if((parameter_html !='') && (response.value.capabilities[0].includes('DRIVER_EVENT_START_DIRECT'))){
          that.$el.find('#c2_direct_access').prop('disabled', false);
        }

        if((parameter_html !='') && (response.value.state=='DRIVER_STATE_DIRECT_ACCESS')){
          that.$el.find('#c2_direct_access').prop('disabled', true);
          that.$el.find('#c2_direct_access_exit').prop('disabled', false);
        }

        if(response.value){
          that.options['instrument_state'] = String(response.value.state).split('_').join(' ');
        }
        that.$el.find('.modal-content').resizable();

        if(response.value.state=='DRIVER_STATE_DIRECT_ACCESS') {
          //console.log('in direct access mode');
          that.$el.find("#direct_access_div").prop('hidden', false);
          that.$el.find("#main_div").prop('hidden', true);
          that.$el.find("#da_command_buttons").prop('hidden', true);
          that.$el.find("#start_sniffer").prop('disabled', true);
          that.$el.find("#stop_sniffer").prop('disabled', true);
        }else{
          //console.log('not in direct access mode');
          that.$el.find("#direct_access_div").prop('hidden', true);
          that.$el.find("#main_div").prop('hidden', false);
        }

        if(that.options.locked_by==null){
          that.$el.find("#c2_locked_by")[0].className = 'btn btn-primary fa fa-unlock-alt';
          that.$el.find("#c2_locked_by")[0].title = 'Unlocked';
        }else{
          that.$el.find("#c2_locked_by")[0].className = 'btn btn-primary fa fa-lock';
          that.$el.find("#c2_locked_by")[0].title = 'Locked by: '+that.options.locked_by;
        }
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
      //console.log(response);
      //console.log(title);
      var m = new ModalDialogView();
      var html_header = "<div><h3>"+title+"</h3></div>";

      var combined_html = html_header;

      if(response.changed.acquire_result){
        //console.log('acquire_result: ');
        //console.log(response.changed.acquire_result);

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
      that.$el.find("#direct_access_div").prop('hidden', true);
      that.$el.find("#main_div").prop('hidden', true);
      that.render(that.options);
      that.options.parameter_options= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
      that.options.command_options= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
      that.options.processing_state= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
      that.options.refresh_state= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
      that.$el.html(this.template(this.options));
      if(that.options.selected_instrument_index > 0){
        that.$el.find("#instrument_select")[0].selectedIndex = that.options.selected_instrument_index;
        that.$el.find("#instrument_select")[0].options[that.options.selected_instrument_index].selected = true;
      }
      if(that.options.available_streams_index > 0){
        that.$el.find("#available_streams")[0].selectedIndex = that.options.available_streams_index;
        that.$el.find("#available_streams")[0].options[that.options.available_streams_index].selected = true;
        that.$el.find('#get_particle').prop('disabled', false);
        that.$el.find('#plot_c2').prop('disabled', false);
      }
    }
    // Locked By
    else if(button.target.id=='c2_locked_by'){
      //console.log(button);
      var userModel = new UserModel();
      userModel.url = '/api/current_user';


      var userInfo = "empty";
      userModel.fetch({
        success: function(collection, response, options) {
          that.options.current_user_info = response;

          userInfo = "<div>"+response.email+"</div>";
          userInfo += "<div>"+response.first_name+"</div>";
          userInfo += "<div>"+response.last_name+"</div>";
          userInfo += "<div>"+response.phone_primary+"</div>";
          that.options.current_user_id = response.user_id;

          if(button.target.className.search('fa-lock')>-1){
            var theMessage="This instrument is currently locked by: <br>";
            theMessage += userInfo;
            theMessage += "Do you wish to override this lockout?<br>";
            theMessage += "Note that overriding a mission execution lockout will interrupt the mission and may cause it to fail.<br>";
            theMessage += "If the instrument is locked by another user, please check with them before releasing the lock.<br>";
            theMessage += "Are you sure you wish to release the lock?<br>";

            var lockWarningModal = new ModalDialogView();
            lockWarningModal.show({
              message: "<div style='color:red;font-size: 16px;text-align:center;'>"+theMessage+"</div>",
              type: "danger"
            });
            button.target.className = 'btn btn-primary fa fa-unlock-alt';
            button.target.title = "";
            // TODO: Send to route to unlock
            button.target.blur();
            that.options.locked_by = null;
          }else{
            button.target.className = 'btn btn-primary fa fa-lock';
            that.options.locked_by = that.options.current_user_id;
            button.target.title = 'Locked by: ' + that.options.locked_by;
            // TODO: Send to route to lock
            button.target.blur();
          }
        },
        error:function(collection, response, options) {
          console.log('Error getting user data');
        }
      });
      //that.render(that.options);
    }
    // Plotting redirect
    else if(button.target.id =='plot_c2'||button.target.className.search('chart')>-1){
      var plot_url = '/data_access/?search='+ref_des+'/'+that.options.selected_stream_method+'_'+that.options.selected_stream_name.replace(/_/g, '-');

      //plotting/#CP05MOAS-GL001-05-PARADM000/<steam_method>_<stream-name>
      window.open(plot_url,'_blank');
    }
    else if(button.target.id=='start_sniffer'){
      that.options.sniffer_loop = 1;
      button.target.blur();
      that.$el.find("#start_sniffer").prop('disabled', true);
      that.$el.find("#stop_sniffer").prop('disabled', false);

      var snifferRoom = that.options.selected_instrument.replace(/\s+/g, '');
      var snifferData = {"ip": that.options.selected_instrument_ip, "port": that.options.selected_instrument_sniffer_port, "title": snifferRoom};

      var direct_access_sniffer_url = '/api/c2/'+that.options.ctype+'/'+that.options.variable+'/'+'direct_access/sniffer';

      //that.options.sniffer_loop = setInterval(function() {
        $.ajax(direct_access_sniffer_url, {
          type: "POST",
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify(snifferData),
          success: function (resp) {
            //console.log('sending custom direct access command: ');
            //console.log(JSON.stringify(snifferData));
            //console.log(resp);

            that.$el.find('#direct-output-ta').append(resp['msg']);
            that.$el.find('#direct-output-ta').scrollTop(that.$el.find('#direct-output-ta')[0].scrollHeight);

            // Click the button to simulate a loop until "Stop Sniffer" is clicked
            if(that.options.sniffer_loop==1){
              that.$el.find("#start_sniffer").prop('disabled', false);
              that.$el.find("#start_sniffer").click();
              that.$el.find("#start_sniffer").prop('disabled', true);
            }
          },
          error: function (req, status, err) {
            //console.log(req);
            var errorMessage = '<div><h3>An error occurred sending the command:</h3></div>';
            errorMessage += '<div><h4>' + req.statusText + '</h4></div>';
            errorMessage += '</br>';
            if (req.responseJSON) {
              errorMessage += '<div><h4>' + req.responseJSON['message'] + '</h4></div>';
            }
            //console.log(req.responseJSON['message']);
            //var errorModal = new ModalDialogView();
            //errorModal.show({
            //  message: errorMessage,
            //  type: "danger"
            //});
          }
        });
      //}, 9900);
    }
    else if(button.target.id=='stop_sniffer') {
      //console.log(button);
      that.options.sniffer_loop = 0;
      button.target.blur();
      clearInterval(that.options.sniffer_loop);
      that.$el.find("#start_sniffer").prop('disabled', false);
      that.$el.find("#stop_sniffer").prop('disabled', true);
    }
    // Direct Access - Start
    else if(button.target.id =='c2_direct_access'){
      // Build the direct access
      var direct_access_start_url = '/api/c2/'+that.options.ctype+'/'+that.options.variable+'/'+'direct_access/start';

      that.options['refresh_state'] = "<i style='color:#337ab7;margin-left:20px' class='fa fa-spinner fa-spin fa-2x'></i>";
      that.$el.html(that.template(that.options));
      that.$el.find("#direct_access_div").prop('hidden', true);
      that.$el.find("#main_div").prop('hidden', true);

      $.ajax( direct_access_start_url, {
        type: 'GET',
        dataType: 'json',
        success: function( resp ) {
          that.$el.find('#c2_direct_access').prop('disabled', true);
          that.$el.find('#c2_direct_access_exit').prop('disabled', false);
          //console.log('success starting direct access: ');
          //console.log(resp);
          var m = new ModalDialogView();

          m.show({
            message: "Started Direct Access Successfully",
            type: "success"
          });

          that.$el.find('#refresh_win_param').click();

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
          that.$el.find('#refresh_win_param').click();
        }
      });
    }
    // Direct Access - Launch
    else if(button.target.id=='send_custom_command'){
      // Build the direct access
      var direct_access_execute_url = '/api/c2/'+that.options.ctype+'/'+that.options.variable+'/'+'direct_access/execute';
      //console.log(that.$el.find('#da_custom_command'));
      var da_custom_command = that.$el.find('#da_custom_command')[0].value;
      //console.log('da_custom_command:');
      //console.log(da_custom_command);
      var commandData = {
        "command_text": decodeURIComponent(da_custom_command),
        "title": that.options.selected_instrument
      };

      $.ajax( direct_access_execute_url, {
        type: "POST",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(commandData),
        success: function( resp ) {
          //console.log('sending custom direct access command: ' + JSON.stringify(commandData));
          //console.log(resp);
          //var m = new ModalDialogView();
          //
          //m.show({
          //  message: "Sent Direct Access Command Successfully"+"<br>"+JSON.stringify(commandData),
          //  type: "success"
          //});

        },
        error: function( req, status, err ) {
          //console.log(req);
          var errorMessage = '<div><h3>An error occurred sending the command:</h3></div>';
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
    else if(button.target.value=='preset_button'){
      // Build the direct access
      var direct_access_execute_url = '/api/c2/'+that.options.ctype+'/'+that.options.variable+'/'+'direct_access/execute';
      var commandData = {
        "command": button.target.id,
        "title": that.options.selected_instrument
      };

      $.ajax( direct_access_execute_url, {
        type: "POST",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(commandData),
        success: function( resp ) {
          //console.log('sending preset direct access command: ' + JSON.stringify(commandData));
          //console.log(resp);
          //var m = new ModalDialogView();
          //
          //m.show({
          //  message: "Sent Direct Access Command Successfully"+"<br>"+JSON.stringify(commandData),
          //  type: "success"
          //});

        },
        error: function( req, status, err ) {
          //console.log(req);
          var errorMessage = '<div><h3>An error occurred sending the command:</h3></div>';
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

      that.options['refresh_state'] = "<i style='color:#337ab7;margin-left:20px' class='fa fa-spinner fa-spin fa-2x'></i>";
      that.$el.html(that.template(that.options));
      that.$el.find("#direct_access_div").prop('hidden', true);
      that.$el.find("#main_div").prop('hidden', true);

      $.ajax( direct_access_exit_url, {
        type: 'GET',
        dataType: 'json',
        success: function( resp ) {
          that.$el.find('#c2_direct_access').prop('disabled', false);
          that.$el.find('#c2_direct_access_exit').prop('disabled', true);
          //console.log('success starting direct access: ');
          //console.log(resp);
          var m = new ModalDialogView();

          m.show({
            message: "Exited Direct Access Successfully",
            type: "success"
          });

          that.$el.find('#refresh_win_param').click();

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
          that.$el.find('#refresh_win_param').click();
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
        //complete: pollStatus,
        timeout: 50000,
        async: true,
        error: function( req, status, err ) {
          //console.log(req);
          var errorMessage = '<div><h3>An error occured:</h3></div>';
          errorMessage += '<div><h4>' + req.statusText + '</h4></div>';
          errorMessage += '</br>';
          if(req.responseJSON){
            errorMessage += '<div><h4>' + req.responseJSON['message'] + '</h4></div>';
          }

          errorMessage += status;
          errorMessage += err;

          var errorModal = new ModalDialogView();
          errorModal.show({
            message: errorMessage,
            type: "danger"
          });

          that.$el.find('#refresh_win_param').click();
        }
      });
    }
    // Submit form parameter(s)
    else if(button.target.id =='submit_win_param') {
      //execute parameter changes
      var param_model = new ParameterModel();
      param_model.url = '/api/c2/' + this.options.ctype + '/' + ref_des + '/parameters';

      //loop through and get all the parameters
      var theParameters = this.options['model'].value.metadata.parameters;
      var param_list = {};

      for (var p in theParameters) {
        if (theParameters[p].visibility == "READ_WRITE") {
          if (theParameters[p].value.type == 'int') {
            param_list[p] = parseInt(this.$el.find('#' + p).val());
          }
          //todo add validation for date
          else {
            param_list[p] = this.$el.find('#' + p).val();
            //console.log('param', this.$el.find('#'+p).val());
          }
        }
      }

      param_model.set('resource', param_list);
      /*var post_data_param = {'resource':param_list,'timeout':60000};
       var data_param  = JSON.stringify(post_data_param, null, '\t');*/

      this.options.parameter_options = "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
      this.$el.html(this.template(this.options));

      param_model.save({}, {
        success: function (response) {
          //console.log('param save response');
          //console.log(response);

          var m = new ModalDialogView();
          if (response.attributes.response.status_code == 200) {
            m.show({
              message: "Settings Saved Successfully",
              type: "success"
            });

            that.render(that.options);
          }
          else {
            // Generate the error message from the message, status_code and range_errors
            var range_error_response = "";
            var error_response_header = "<table><tr><td class='error_message_header'>Parameter</td><td class='error_message_header'>Error Message</td></tr>";
            if (response.attributes.response.range_errors != "") {
              var range_error_rows = "";
              for (var re in response.attributes.response.range_errors) {
                range_error_rows += "<tr><td class='error_message_column_desc'>" + response.attributes.response.range_errors[re].display_name + ":</td><td class='error_message_column_text'>" + response.attributes.response.range_errors[re].message + "</td></tr>";
              }
              var range_error_response = "</br><hr><div>" + error_response_header + range_error_rows + "</div>";
            }

            m.show({
              message: "Error Saving Settings: " + response.attributes.response.message + range_error_response,
              type: "danger"
            });
            that.render(that.options);
          }
        },
        error: function (response) {
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
    //// Close form and sniffer socket
    //else if((button.target.id=='close_win_command') && (that.options.model.value.state=='DRIVER_STATE_DIRECT_ACCESS')){
    //  //if(response.value.state=='DRIVER_STATE_DIRECT_ACCESS') {
    //    console.log('Disconnect socket in direct access mode');
    //    //var namespace = '/test'; // change to an empty string to use the global namespace
    //    //socket = io.connect('http://' + '10.0.0.14' + ':' + '5002' + namespace);
    //    socket.emit('disconnect request');
    //    that.$el.find('#close_win_command').click();
    //  //}
    //}
    else if(button.target.id =='close_win_command'){
      that.options.sniffer_loop = 0;
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
      //this.options.refresh_state= "<i style='margin-left:20px' class='fa fa-spinner fa-spin fa-4x'></i>";
      this.$el.html(this.template(this.options));

      command_model.save({},{
        success: function(response){
          var m = new ModalDialogView();
          if(response.attributes.response.message != ''){
            //console.log('Error Executing Command:');
            //console.log(response);
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
          that.$el.find('#refresh_win_param').click();
        },
        error: function(){
          var m = new ModalDialogView();
          m.show({
            message: "Error Executing Command",
            type: "danger"
          });
          that.render(that.options);
          that.$el.find('#refresh_win_param').click();
        }
      });
    }
  }
});
