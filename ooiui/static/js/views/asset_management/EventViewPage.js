"use strict";
/*
 *
 * ooiui/static/js/models/asset_management/EventViewPage.js
 * Validation model for Alerts and Alarms Page.
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/compiled/alertPage.js
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * Usage
 * 
 */

var EventViewPage = Backbone.View.extend({

	initialize: function(d) {
    if(d){
      this.setEventId(d);
    }
    else{
      var modalDialog = new ModalDialogView();
      modalDialog.show({
        message: 'There is no Event to View',
        type: "danger",
      });
    }
		_.bindAll(this,"render");
		this.render();
	},

  setEventId:function(d){
      var self = this;
      if(d.assetid){
        //set asset id to the model to create new event under that asset
        self.eventid = 'new';
        self.model= new  SingleEvent();
        self.model.attributes.asset['@class'] = d.aclass;
        self.model.attributes.asset['assetId'] = d.assetid;
        $('#asset_table tbody').append("<tr id="+d.assetid+"><td style=''>"+d.assetid+"</td><td style=''>"+d.aclass+"</td><td style=''>n/a</td></tr>");
        $('#editdep_panel').html('');
        self.clearform();
      }
      else if(d.eventid){
        self.eventid= d.eventid;
      }
      else{
        var modalDialog = new ModalDialogView();
          modalDialog.show({
            message: 'There is no Event to View',
            type: "danger",
          });
      }
  },

	//renders a simple map view
	render: function() {
        
        self = this;
        var classtypelist = {'.ReturnToManufacturerEvent':{'val':7,'label':'ReturnToManufacturer'},'.StorageEvent':{'val':4,'label':'Storage'},'.DeploymentEvent':{'val':1,'label':'Deployment'},'.IntegrationEvent':{'val':2,'label':'Integration'},'.TestEvent':{'val':5,'label':'Test'},'.CalibrationEvent':{'val':6,'label':'Calibration'},'.RetirementEvent':{'val':3,'label':'Retirement'}};

        self.initializeEvent();
        self.modalDialog = new ModalDialogView();
        if(self.eventid !='new'){
          var eventModel = new SingleEvent({id:self.eventid});

          self.model = eventModel;

          eventModel.fetch({
            success: function (event) {
              $('#editdep_panel').html('');

              //M@Campbell - 4/7/2015
              //---
              //Set calibration table 
              if (self.model.get('calibrationCoefficient')) { 
                  //render the tab if there is calibration coefficients
                  $('#cal-tab').show();
                  $('#cal_table tbody').empty(); 
                  
                  //keeping things tidy...
                  var ccLen = event.attributes.calibrationCoefficient.length; 
                  for ( var t = 0; t < ccLen; t++ ) {
                      var ccName = event.attributes.calibrationCoefficient[t].name;
                      var ccValue = event.attributes.calibrationCoefficient[t].values; 
                      $('#cal_table tbody').append(
                          "<tr class="+event.attributes.eventId+">" +
                          "<td style=''>"+ ccName+ "</td>" +
                          "<td class=cal-cof-"+event.attributes.eventId +
                              " id=" + ccName +">" + ccValue +
                          "</td></tr>"
                          );
                  }; 
              };
                //set asset_table to assetInfo table
              $('#asset_table tbody').empty();
              $('#asset_table tbody').append("<tr id="+event.attributes.asset.assetId+"><td style=''>"+event.attributes.asset.assetInfo.name+"</td><td style=''>"+event.attributes.asset.assetInfo.type+"</td><td style=''>"+event.attributes.asset.assetInfo.owner+"</td></tr>");

              $('#name_d').val(event.attributes.eventId);
              $('#cruise_e').val(event.attributes.cruiseNumber);
              $('#cur_loc_d').val(event.attributes.currentLocationName);
              
              if(event.attributes.deploymentDepth){
                $('#depth_e').val(event.attributes.deploymentDepth);
              }
              else{
                 $('#depth_e').val('');
              }

              //start date
              if(event.attributes.startDate){
                var eventStartDate = event.attributes.startDate;
                $("#startdate_d" ).val(eventStartDate);

                var s_date = new Date(event.attributes.startDate);
                $("#startdate_d" ).data("DateTimePicker").setDate(s_date);
              }
              else{
                 $("#startdate_d" ).data("DateTimePicker").setDate();
              }

              //end date
              if(event.attributes.endDate){
                var eventEndDate = event.attributes.endDate;
                $("#enddate_d" ).val(eventEndDate);

                var e_date = new Date(Date.parse(event.attributes.endDate));
                $("#enddate_d" ).data("DateTimePicker").setDate(e_date);
              }
              else{
                 $("#enddate_d" ).data("DateTimePicker").setDate();
              }
              
              $('#desc_d').val(event.attributes.eventDescription);
              $('#notes_d').val(event.attributes.notes[0]);
              $('#recordedby_d').val(event.attributes.recordedBy);
              $('#dep_name_e').val(event.attributes.deploymentName);
              $('#dep_num_e').val(event.attributes.deploymentNumber);

              /*if(event.attributes.manufactureInfo){
                $('#manufacture_d').val(event.attributes.manufactureInfo['manufacturer']);
              }
              else{
                 $('#manufacture_d').val('');
              }*/
              $("#type_e").val(event.attributes.eventType);
              $("#type_switcher_but").attr('data', event.attributes['class']);
              $("#type_switcher_but").val(classtypelist[event.attributes['class']].val);
              $('#type_switcher_but').html(classtypelist[event.attributes['class']].label+' <span class="caret"></span>');
                          
              if(event.attributes.deploymentLocation != null){
                  //for geojson ....
                  if(event.attributes.deploymentLocation.length>0){
                  //if(model.attributes.geo_location.type == "Point"){
                      //[x,y]
                      $('#geo_d_lat').val(event.attributes.deploymentLocation[0]);
                      $('#geo_d_long').val(event.attributes.deploymentLocation[1]);

                      // add a marker in the given location, attach some popup content to it and open the popup
                      var asset_mark = L.marker([event.attributes.deploymentLocation[0], event.attributes.deploymentLocation[1]]).addTo(map)
                          .bindPopup(event.attributes['class'])
                          .openPopup();
                      self.asset_mark = asset_mark;
                      map.panTo({lat: event.attributes.deploymentLocation[0], lng: event.attributes.deploymentLocation[1]});
                      //map.setView({lat: 50, lng: 30},8);
                  }
              }
            },
            error: function(er){
              $('#editdep_panel').html('Error finding the Event');
            }
          });
        }
        

        //add map
        L.Icon.Default.imagePath = '/img';
        var map = L.map('editdep_map').setView([1.505, 1.09], 2);
        L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }).addTo(map);
        // add an OpenStreetMap tile layer
        L.tileLayer('http://{s}.tile.stamen.com/toner-hybrid/{z}/{x}/{y}.png', {
        }).addTo(map);
        self.map = map;

        //bind
        self.modalDialog = new ModalDialogView();
    },

    initializeEvent:function(){
        var self = this;
        
        $('#enddate_d').datetimepicker();
        $('#startdate_d').datetimepicker();
        $("#enddate_d").on("dp.change", function (e) {
          $('#startdate_d').data("DateTimePicker").setMaxDate(e.date);
        });
        $("#startdate_d").on("dp.change", function (e) {
          $('#enddate_d').data("DateTimePicker").setMinDate(e.date);
        });

        //asset type switcher
        $('#type_switcher_but').dropdown();
        $('#type_switcher_but_val').on('click', function(e) {
            $('#type_switcher_but').attr('data',e.target.attributes[0].value);
            $('#type_switcher_but').html(e.target.innerHTML);
        })
        //on button bar click
        $('#deploy_edit').click(function(t) {
            var deploy_obj_ = {};

            //this is because the data model is different coming in and going out!
            var Event4Post = self.model;

            if(t.target.innerText.search('NEW')>-1){
                self.clearform();
                //check to see if there is marker on the map and remove it
                //reset eventId
                self.model.attributes.eventId = null;
                $('#editdep_panel').html('Click Save to create new Event.');
            }
            else if(t.target.innerText.search('SAVE'>-1)){
                //save to db 
                if (self.model.isValid()) {
                  $('#editdep_panel').html('<i class="fa fa-spinner fa-spin"></i>  Saving...');
                 
                  if($('#startdate_d').data("DateTimePicker").getDate() !=null){
                      Event4Post.set('startDate',$('#startdate_d').data("DateTimePicker").getDate().toISOString());
                  }
                  if($('#enddate_d').data("DateTimePicker").getDate()!=null){
                      Event4Post.set('endDate',$('#enddate_d').data("DateTimePicker").getDate().toISOString());  
                  }

                  Event4Post.set('eventType',$('#type_e').val());
                  Event4Post.set('cruiseNumber',$('#cruise_e').val());
                  Event4Post.set('deploymentName', $('#dep_name_e').val());
                  Event4Post.set('deploymentNumber',Number($('#dep_num_e').val()));
                  Event4Post.set('recordedBy',$('#recordedby_d').val());
                  //Event4Post.set('deploymentLocationName',$('#cur_loc_d').val());
                  
                  Event4Post.set('class', $('#type_switcher_but').attr('data'));
                  Event4Post.set('deploymentDepth',Number($('#depth_e').val()));
                  Event4Post.set('deploymentLocation',[Number($('#geo_d_long').val()),Number($('#geo_d_lat').val())])
                  Event4Post.set('eventDescription', $('#desc_d').val());
                  Event4Post.set('notes',[$('#notes_d').val()]);
                  
                  //M@Campbell - 4/7/2015
                  //---
                  //Save the calibration coefficients here.
                  
                  //create the coefficients container:
                  var arrCalCoef = [];
                  var calCoefClassName = 'cal-cof-'+self.model.attributes.eventId;
                  var domCalCoef = document.getElementsByClassName(calCoefClassName);
                  for (var i=0; i < domCalCoef.length; i++) { 
                      arrCalCoef.push({"name": domCalCoef[i].getAttribute('id'),"values": domCalCoef[i].getAttribute('value')});
                  };

                  //TOOD: Once the services are chatting again with
                  //  uframe events POST/PUT, circle back to this.
                  //
                  //add the calibration coefficient's array to the message:
                  //Event4Post.set('calibrationCoefficient',arrCalCoef);
                  
                  //---

                  //this never changes
                  var assetObj = {}
                  assetObj= {
                    "@class": self.model.attributes.asset['@class'],
                    "assetId": self.model.attributes.asset['assetId']
                   };
                  Event4Post.set('asset',assetObj);
                  /*var manObj = {};
                  manObj['manufacturer']=$('#manufacture_d').val()
                  self.model.set('manufactureInfo',manObj);*/
                  //var geoObj = {};
                  //var coord = [Number($('#geo_d_long').val()),Number($('#geo_d_lat').val())];
                  //geoObj['coordinates']=coord;
                  //geoObj['type'] = "Point";
                  //self.model.set('geo_location',wellknown.stringify(geoObj));

                  //existing? this is to put edits
                  if(self.model.attributes.eventId != null){
                      Event4Post.set('id',self.model.attributes.eventId);                    
                      //If the model does not yet have an id, it is considered to be new.
                      //self.model.url = '/api/asset_deployment/'+selectedInstrument['assetId']
                  }
                  if($('#dep_name_e').val() != ''){
                      Event4Post.save(null, {
                        success: function(model, response) {
                          if(response.statusCode.search('ERROR')>-1||response.statusCode.search('BAD')>-1){
                            var errMessage = response.message;
                            self.modalDialog.show({
                              message: "Unable to Save Event because:  "+errMessage,
                              type: "danger",
                            });
                            $('#editdep_panel').html('There was an error saving the Event.');
                          }
                          else{
                            self.modalDialog.show({
                            message: "The Event was saved Successfully.",
                            type: "success",
                            ack: function() { 
                              //window.location = "/assets/list/"
                            }
                            });
                            $('#editdep_panel').html('The Event was saved Successfully.');
                            //reload page
                            //location.reload();
                          }
                          
                        },
                        error: function(model, response) {
                          try {
                            var errMessage = JSON.parse(response.responseText).error;
                          } catch(err) {
                            var errMessage = "Unable to Save Event";
                          }
                          self.modalDialog.show({
                            message: errMessage,
                            type: "danger",
                          });
                          $('#editdep_panel').html('There was an error saving the Event.');
                        }
                      });
                  
                      //reset
                      //self.clearform();
                  }
                  else{
                      $('#editdep_panel').html('The Deployment Name is Required.');
                      self.modalDialog.show({
                        message: "Please fill out Name fields",
                        type: "danger",
                      });
                  }
                }
            }
            //not using now - no function in uframe
            else if(t.target.innerText == 'DELETE'){
                //delete from db 
                //selectedInstrument
                if(selectedInstrument['assetId']){

                    $('#editdep_panel').html('<i class="fa fa-spinner fa-spin"></i>  Deleting.');
                    self.model.set('id',selectedInstrument['assetId']);                    

                    self.model.destroy({
                      success: function(model, response, options) {
                        console.log("destroyed");
                        self.modalDialog.show({
                          message: "Event successfully deleted.",
                          type: "success",
                          ack: function() { 
                            window.location = "/assets/list/"
                          }
                        });
                        $('#editdep_panel').html('Deleted Successfully.');
                      },
                      error: function(model, response, options) {
                        try {
                          var errMessage = JSON.parse(response.responseText).error;
                        } catch(err) {
                          console.log(err);
                          var errMessage = "Unable to Delete Asset";
                        }
                        self.modalDialog.show({
                          message: errMessage,
                          type: "danger",
                        });
                        console.log(model);
                        console.log(response.responseText);
                        $('#editdep_panel').html('Delete Error.');
                      }
                    });
                    
                    //reset
                    self.clearform();
                }
            }
        });
        
        //add events for DMS changes
        $('#dms_longEW').on('change',self.updateDD);
        $('#dms_longD').on('change',self.updateDD);
        $('#dms_longM').on('change',self.updateDD);
        $('#dms_longS').on('change',self.updateDD);
        $('#dms_latd').on('change',self.updateDD);
        $('#dms_latm').on('change',self.updateDD);
        $('#dms_lats').on('change',self.updateDD);
        $('#dms_latNS').on('change',self.updateDD);
        $('#geo_d_lat').on('change',self.updatemarker);
        $('#geo_d_long').on('change',self.updatemarker);
        
        //change lat/long input types
        $("#coordinate_switcher li a").click(function(){
          $("#coordinate_switcher .btn:first-child").html($(this).text()+'  <span class="caret"> </span>');
          $("#coordinate_switcher .btn:first-child").val($(this).text());
          if($(this).text() == 'DD DD'){
            $('#dd_input').show();
            $('#ddmm_input').hide();
            $('#ddmmss_input').hide();
            $('#dd_inputG').show();
            $('#ddmm_inputG').hide();
            $('#ddmmss_inputG').hide();
          }
          else if($(this).text()== 'DD MM.MM'){
            $('#dd_input').hide();
            $('#ddmmss_input').hide();
            $('#dd_inputG').hide();
            $('#ddmmss_inputG').hide();
            $('#ddmm_input').show();
            $('#ddmm_inputG').show();
          }
          else if($(this).text()== 'DD MM.SS'){
            $('#dd_input').hide();
            $('#ddmm_input').hide();
            $('#dd_inputG').hide();
            $('#ddmm_inputG').hide();
            $('#ddmmss_input').show();
            $('#ddmmss_inputG').show();

            if($('#geo_d_long').val()!=''){
              var dmsN=self.ConvertDDToDMS($('#geo_d_long').val());
              if($('#geo_d_long').val()>0){
                  $('#dms_longEW').val('E');
              }
              else{
                  $('#dms_longEW').val('W');
              }
              $('#dms_longD').val(dmsN[0]);
              $('#dms_longM').val(dmsN[1]);
              $('#dms_longS').val(dmsN[2]);
            }
            if($('#geo_d_lat').val()!=''){
              var dmsE=self.ConvertDDToDMS($('#geo_d_lat').val());
              if($('#geo_d_lat').val()>0){
                  $('#dms_latNS').val('N');
              }
              else{
                  $('#dms_latNS').val('S');
              }
              $('#dms_latd').val(dmsE[0]);
              $('#dms_latm').val(dmsE[1]);
              $('#dms_lats').val(dmsE[2]);
            }
          }
       });
    },

    clearform: function(){
        $('#depth_e').val('');
        $('#name_d').val('');
        $('#startdate_d').data("DateTimePicker").setDate();
        $('#enddate_d').data("DateTimePicker").setDate();
        $('#type_e').val('');
        $('#cruise_e').val('');
        $('#dep_name_e').val('');
        $('#dep_num_e').val('');
        $('#geo_d_lat').val('');
        $('#geo_d_long').val('');
        //$('#manufacture_d').val('');
        $('#desc_d').val('');
        $('#notes_d').val('');
        $('#recordedby_d').val('');
        $('#cur_loc_d').val('');
    },

    ConvertDDToDMS: function (dd)
    {
        var deg = dd | 0; // truncate dd to get degrees
        var frac = Math.abs(dd - deg); // get fractional part
        var min = (frac * 60) | 0; // multiply fraction by 60 and truncate
        var sec = frac * 3600 - min * 60;
        return [Math.abs(deg),min,sec];
    },

    ConvertDMSToDD: function (dmsStr) {
        var output = NaN, dmsMatch, degrees, minutes, seconds, hemisphere;
        var dmsRe = /^(-?\d+(?:\.\d+)?)[°:d]?\s?(?:(\d+(?:\.\d+)?)['′:]?\s?(?:(\d+(?:\.\d+)?)["″]?)?)?\s?([NSEW])?/i;
        dmsMatch = dmsRe.exec(dmsStr);
        if (dmsMatch) {
          degrees = Number(dmsMatch[1]);
     
          minutes = typeof (dmsMatch[2]) !== "undefined" ? Number(dmsMatch[2]) / 60 : 0;
          seconds = typeof (dmsMatch[3]) !== "undefined" ? Number(dmsMatch[3]) / 3600 : 0;
          hemisphere = dmsMatch[4] || null;
          if (hemisphere !== null && /[SW]/i.test(hemisphere)) {
            degrees = Math.abs(degrees) * -1;
          }
          if (degrees < 0) {
            output = degrees - minutes - seconds;
          } else {
            output = degrees + minutes + seconds;
          }
        }
        return output;
    },

    updateDD: function(e){
      //lat
      $('#geo_d_long').val(self.ConvertDMSToDD($('#dms_longD').val()+':'+$('#dms_longM').val()+':'+$('#dms_longS').val()+$('#dms_longEW').val()));

      //long
      $('#geo_d_lat').val(self.ConvertDMSToDD($('#dms_latd').val()+':'+$('#dms_latm').val()+':'+$('#dms_lats').val()+$('#dms_latNS').val()));
      self.updatemarker();
    },

    updatemarker:function(){

      if(self.asset_mark){self.map.removeLayer(self.asset_mark)};
      if($('#geo_d_lat').val()!=''& $('#geo_d_long').val()!=''){
        var asset_mark = L.marker([$('#geo_d_lat').val(), $('#geo_d_long').val()]).addTo(self.map);
        self.asset_mark = asset_mark;
        self.map.panTo({lat: $('#geo_d_lat').val(), lng: $('#geo_d_long').val()}); 
      }
    }
});
