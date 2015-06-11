"use strict";
/*
 *
 * ooiui/static/js/models/asset_management/AssetView.js
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

var AssetView = Backbone.View.extend({

	initialize: function() {
		_.bindAll(this,"render");
		this.render();
	},
	//renders a simple map view
	render: function() {

        var self = this;
        self.modalDialog = new ModalDialogView();
        self.model = '';

        $('#datatable').bootstrapTable({
              method: 'get',
              url: '/api/asset_deployment',
              cache: false,
              height: 400,
              striped: false,
              pagination: true,
              //pageSize: 50,
              //pageList: [10, 25, 50, ],
              search: false,
              showColumns: true,
              showRefresh: true,
              minimumCountColumns: 2,
              onClickRow: self.rowClicked,
              //clickToSelect: true,
              responseHandler: function responseHandler(res) {
                  if(res.assets.error){
                    self.modalDialog.show({
                      message: res.assets.message,
                      type: "danger"
                    });

                    $('#asset_top_panel').html('Error Connecting to Data');
                    $('#editdep_panel').html('Error Connecting to Data'); 
                  }
                  else{
                    $('#asset_top_panel').html('Click on an Asset to Edit');
                    $('#editdep_panel').html('Click on an Asset above to Edit'); 
                  }
                  return res.assets;
              },
              showFilter:true,
              showExport:true,
              columns: [/*{
                  field: 'state',
                  checkbox: true
              },*/ 
              /*Doesn't seem to be a display name currently
              {
                  field: 'display_name',
                  title: 'Name',
                  align: 'left',
                  valign: 'top',
                  sortable: true,
                  col:'display_name',
                  searchable: true
              },*/
              {
                  field: 'assetInfo',
                  title: 'Name',
                  align: 'left',
                  valign: 'top',
                  sortable: true,
                  col:'name',
                  object:true,
                  formatter:  function aFormatter(value) {
                      return value['name'];
                  }
              },{
                  field: 'assetInfo',
                  title: 'Owner',
                  align: 'left',
                  valign: 'top',
                  sortable: true,
                  col:'owner',
                  object:true,
                  formatter:  function aFormatter(value) {
                      return value['owner'];
                  }
              },{
                  field: 'seriesClassification',
                  title: 'Series',
                  align: 'left',
                  valign: 'top',
                  sortable: true,
                  col:'seriesClassification',
                  visible:false
              },{
                  field: 'manufactureInfo',
                  title: 'Serial Number',
                  align: 'left',
                  valign: 'top',
                  sortable: true,
                  visible:false,
                  col:'serialNumber',
                  formatter:  function tFormatter(value) {
                      if(value == null){
                        return '';
                      }
                      else{
                        return value['serialNumber'];  
                      }
                      
                  }
              },{
                  field: "launch_date_time",
                  title: "Date",
                  align: 'left',
                  valign: 'bottom',
                  col:'launch_date_time',
                  sortable: true
              },{
                  field: 'class',
                  title: 'Class',
                  align: 'left',
                  valign: 'bottom',
                  col:'class',
                  sortable: true
              },{
                  field: 'assetInfo',
                  title: 'Type',
                  align: 'left',
                  valign: 'top',
                  sortable: true,
                  col:'type',
                  formatter:  function eFormatter(value) {
                      return value['type'];
                  }
                  //sorter: priceSorter
              },{
                  field: 'assetInfo',
                  title: 'Description',
                  align: 'left',
                  valign: 'top',
                  //clickToSelect: false,
                  sortable:true,
                  col:'description',
                  formatter:  function aFormatter(value) {
                      return value['description'];
                  }
                  //events: operateEvents
              },{
                  field: 'assetId',
                  title: 'ID',
                  align: 'center',
                  visible: false,
                  valign: 'left',
                  col:'assetId',
                  sortable: true
              }]
          });

        //datepickers with min/max validation
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
            $('#type_switcher_but').attr('data',e.target.attributes[1].value);
            $('#type_switcher_but').html(e.target.innerHTML);
        });

        //on button bar click
        $('#deploy_edit').click(function(t) {

            var deploy_obj_ = {};

            if(t.target.innerText.search('NEW')>-1||t.target.className.search('plus-square')>-1){
                self.clearform();
                self.selectedInstrument = [];
                self.model =  new AssetModel();
                $('#editdep_map').show();
                //map.invalidateSize();
                $('#editdep_form').show();
                //check to see if there is marker on the map and remove it
                //if(self.asset_mark){map.removeLayer(self.asset_mark)};
                $('#editdep_panel').html('Click Save to create new Record.');
            }
            else if(t.target.innerText.search('PLOT')>-1||t.target.className.search('chart')>-1){

                if (self.model!='') {
                  if(self.selectedInstrument.ref_des==null){
                    self.modalDialog.show({
                      message: "No Reference ID to Plot",
                      type: "danger"
                    });
                  }
                  else{
                    var ref_array = self.selectedInstrument.ref_des.split('-');
                    var plot_url = '/plotting/'+self.selectedInstrument.ref_des.substring(0, 2)+'/'+ref_array[0]+'/'+ref_array[1]+'/'+self.selectedInstrument.ref_des;

                    //plotting/CP/CP05MOAS/GL001/CP05MOAS-GL001-05-PARADM000
                    window.open(plot_url,'_blank'); 
                  }
                }
                else{
                    self.modalDialog.show({
                      message: "Please Select an Asset.",
                      type: "danger"
                    });
                }
            }
            else if(t.target.innerText.search('SAVE')>-1||t.target.className.search('floppy')>-1){
                //save to db
                if (self.model =='') {
                  self.modalDialog.show({
                    message: "Please Select an Asset.",
                    type: "danger"
                  });
                }
                else {
                    $('#editdep_panel').html('<i class="fa fa-spinner fa-spin"></i>  Saving...');
                    // that.model.attributes = selectedInstrument;
                    if($( "#startdate_d" ).data("DateTimePicker").getDate()!=null){
                      self.model.set('launch_date_time',$( "#startdate_d" ).data("DateTimePicker").getDate().toISOString());
                    }
                    else{
                      self.model.set('launch_date_time','');
                    }
                    
                    //self.model.set('end_date',$( "#enddate_d" ).datepicker('getDate' ));
                    var infoObj = {};
                    infoObj['name']= $('#name_d').val();
                    infoObj['owner']= $('#owner_d').val();
                    infoObj['type']= $('#type_d').val();
                    infoObj['description']= $('#desc_d').val();

                    //self.model.set('display_name',$('#name_d').val());
                    self.model.set('assetInfo',infoObj);
                    self.model.set('class', $('#type_switcher_but').attr('data'));
                    var depthObj={};
                    depthObj['unit']='m';
                    depthObj['value']=Number($('#depth_d').val());
                    self.model.set('water_depth',depthObj);

                    self.model.set('notes',[$('#notes_d').val()]);
                    //one way of updating the model
                    self.model.attributes.manufactureInfo.manufacturer = $('#manufacture_d').val();

                    //errors out
                    //self.model.set('physicalInfo',[$('#physinfo_d').val()]);
                    //--geojson connection
                    self.model.set('coordinates',[Number($('#geo_d_lat').val()),Number($('#geo_d_long').val())]);
                    //var geoObj = {};
                    //var coord = [Number($('#geo_d_long').val()),Number($('#geo_d_lat').val())];
                    //geoObj['coordinates']=coord;
                    //geoObj['type'] = "Point";
                    //self.model.set('geo_location',wellknown.stringify(geoObj));

                    self.model.set('lastModifiedTimestamp', self.selectedInstrument['lastModifiedTimestamp']);
                    self.model.set('ref_des', self.selectedInstrument['ref_des']);
                    //existing? this is to put edits
                    if(self.selectedInstrument['assetId']){
                        self.model.set('id',self.selectedInstrument['assetId']);
                        //If the model does not yet have an id, it is considered to be new.
                        //self.model.url = '/api/asset_deployment/'+selectedInstrument['assetId']
                    }
                    if($('#name_d').val() != ''){
                        self.model.save(null, {
                          success: function(model, response) {
                            if(response.statusCode.search('ERROR')>-1||response.statusCode.search('BAD')>-1){
                              self.modalDialog.show({
                                message: "Unable to Save Asset",
                                type: "danger",
                              });
                              $('#editdep_panel').html('Save Asset Error.');
                            }
                            else{
                              self.modalDialog.show({
                              message: "Asset successfully saved.",
                              type: "success",
                                ack: function() {
                                  window.location = "/assets/list/"
                                }
                              });
                              $('#editdep_panel').html('Saved Successfully.');
                            }
                          },
                          error: function(model, response) {
                            try {
                              var errMessage = JSON.parse(response.responseText).error;
                            } catch(err) {
                              console.log(err);
                              var errMessage = "Unable to Save Asset";
                            }
                            self.modalDialog.show({
                              message: errMessage,
                              type: "danger",
                            });
                            $('#editdep_panel').html('Save Error.');
                          }
                        });

                        //reset
                        self.selectedInstrument = [];
                        self.clearform();
                    }
                    else{
                        $('#editdep_panel').html('Display Name are Required.');
                        self.modalDialog.show({
                          message: "Please fill out Display Name fields.",
                          type: "danger"
                        });
                    }
                }
            }
            //not using now - no function in uframe
            else if(t.target.innerText == 'DELETE'){
                //delete from db
                //selectedInstrument
                if(self.selectedInstrument['assetId']){

                    $('#editdep_panel').html('<i class="fa fa-spinner fa-spin"></i>  Deleting.');
                    self.model.set('id',self.selectedInstrument['assetId']);

                    self.model.destroy({
                      success: function(model, response, options) {
                        self.modalDialog.show({
                          message: "Asset successfully deleted.",
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
                        $('#editdep_panel').html('Delete Error.');
                      }
                    });

                    //reset
                    self.selectedInstrument = [];
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
            if($('#geo_d_lat').val()!='')
            {
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

    rowClicked: function (model, element) {
        
        $('#event_panel').html('<i class="fa fa-spinner fa-spin"></i>  Loading Events...');
        var assetInfoModel = new AssetEvents({id:model.assetId});
        
        assetView.model = new AssetModel();
        assetView.selectedInstrument = model;

        assetInfoModel.fetch({
          success: function (events) {

            $('#butnewevent').show();

            $('#butnewevent').on('click',function(){
                window.open('/event/new/'+events.attributes.assetId+'/'+events.attributes.class,'_blank');
            });
            $('#physinfo_d').val(events.attributes.physicalInfo);

            if(events.attributes.events){
                for (var j in events.attributes.events){
                    switch (events.attributes.events[j].class) {
                        // Storage Events
                        case '.StorageEvent':
                            $('#storage_event_table tbody').empty();
                            $('#storage_event_table tbody').append("<tr id="+events.attributes.events[j].eventId+"><td style=''>"+events.attributes.events[j].eventId+"</td><td style=''>"+String(events.attributes.events[j].class).replace('.','')+"</td><td style=''><i class='fa fa-info-circle'></i></td></tr>");
                            break;
                        case '.DeploymentEvent':
                            $('#deployment_event_table tbody').empty();
                            $('#deployment_event_table tbody').append("<tr id="+events.attributes.events[j].eventId+"><td style=''>"+events.attributes.events[j].eventId+"</td><td style=''>"+String(events.attributes.events[j].class).replace('.','')+"</td><td style=''><i class='fa fa-info-circle'></i></td></tr>");
                            break;
                        case '.CalibrationEvent':
                            $('#calibration_event_table tbody').empty();
                            $('#calibration_event_table tbody').append("<tr id="+events.attributes.events[j].eventId+"><td style=''>"+events.attributes.events[j].eventId+"</td><td style=''>"+String(events.attributes.events[j].class).replace('.','')+"</td><td style=''><i class='fa fa-info-circle'></i></td></tr>");
                            break;
                        case '.IntegrationEvent':
                            $('#integration_event_table tbody').empty();
                            $('#integration_event_table tbody').append("<tr id="+events.attributes.events[j].eventId+"><td style=''>"+events.attributes.events[j].eventId+"</td><td style=''>"+String(events.attributes.events[j].class).replace('.','')+"</td><td style=''><i class='fa fa-info-circle'></i></td></tr>");
                            break;
                        case '.Service':
                            $('#service_event_table tbody').empty();
                            $('#service_event_table tbody').append("<tr id="+events.attributes.events[j].eventId+"><td style=''>"+events.attributes.events[j].eventId+"</td><td style=''>"+String(events.attributes.events[j].class).replace('.','')+"</td><td style=''><i class='fa fa-info-circle'></i></td></tr>");
                            break;

                            $('.fixed-table-container').css('padding-bottom','0px');
                            $('#event_table').css('margin-top','0px');
                            $('.fixed-table-header').css('display','none');
                    };
                }
            }
            $('#event_panel').html('Click on an event to inspect.');

            //event click -- go to event page add each time new events are loaded

            $('#storage_event_table tr').click(function(row) {
                //var eventrow = new SingleEvent({id:row.currentTarget.id});
                if(row.currentTarget.id){
                    window.open('/event/'+row.currentTarget.id,'_blank');
                }
            });
            $('#deployment_event_table tr').click(function(row) {
                //var eventrow = new SingleEvent({id:row.currentTarget.id});
                if(row.currentTarget.id){
                    window.open('/event/'+row.currentTarget.id,'_blank');
                }
            });
            $('#calibration_event_table tr').click(function(row) {
                //var eventrow = new SingleEvent({id:row.currentTarget.id});
                if(row.currentTarget.id){
                    window.open('/event/'+row.currentTarget.id,'_blank');
                }
            });
            $('#integration_event_table tr').click(function(row) {
                //var eventrow = new SingleEvent({id:row.currentTarget.id});
                if(row.currentTarget.id){
                    window.open('/event/'+row.currentTarget.id,'_blank');
                }
            });
            $('#service_event_table tr').click(function(row) {
                //var eventrow = new SingleEvent({id:row.currentTarget.id});
                if(row.currentTarget.id){
                    window.open('/event/'+row.currentTarget.id,'_blank');
                }
            });
            //allow to edit.
            //$('#event_table').editableTable();
          },
          error: function(er){
              $('#editdep_panel').html('Error finding Events');
          }
        });

        $('#editdep_form').show();
        //self.map.invalidateSize();

        $('#name_d').val(model.assetInfo['name']);
        $('#owner_d').val(model.assetInfo['owner']);

        if(model.water_depth){
            $('#depth_d').val(model.water_depth['value']);
        }
        else{
            $('#depth_d').val('');
        }

        //stupid catch for the date contat
        if(model.launch_date_time){
            if(String(model.launch_date_time).search('Z')>-1){
                var dobj = String(model.launch_date_time).split('Z')
                var l_date = Date.parse(dobj[0]);
            }
            else if(!isNaN(model.launch_date_time)){
                var l_date = new Date(model.launch_date_time*1000);
            }
            else{
                var l_date = new Date(Date.parse(model.launch_date_time));
            }
            $("#startdate_d" ).data("DateTimePicker").setDate(l_date);
        }
        else{
            $("#startdate_d" ).data("DateTimePicker").setDate();
        }

        if(model.end_date_time){
            if(String(model.end_date_time).search('Z')>-1){
                var dobj = String(model.end_date_time).split('Z')
                var l_date = Date.parse(dobj[0]);
            }
            else if(!isNaN(model.end_date_time)){
                var l_date = new Date(model.launch_date_time*1000);
            }
            else{
                var l_date = new Date(Date.parse(model.end_date_time));
            }
            $("#enddate_d" ).data("DateTimePicker").setDate(l_date);
        }
        else{
            $("#enddate_d" ).data("DateTimePicker").setDate();
        }

        $('#desc_d').val(model.assetInfo['description']);
        $('#notes_d').val(model.notes);
        if(model.manufactureInfo){
            $('#manufacture_d').val(model.manufactureInfo['manufacturer']);
        }
        else{
            $('#manufacture_d').val('');
        }

        var classtypelist = {'.AssetRecord':{'val':1,'label':'Asset'},'.InstrumentAssetRecord':{'val':2,'label':'Instrument'},'.PlatformAssetRecord':{'val':3,'label':'Platform'}};

        $("#type_d").val(model.assetInfo['type']);
        $("#type_switcher_but").attr('data', model['@class']);
        $("#type_switcher_but").val(classtypelist[model['@class']].val);
        $('#type_switcher_but').html(classtypelist[model['@class']].label+' <span class="caret"></span>');
    },

    clearform: function(){
        $('#depth_d').val('');
        $('#name_d').val('');
        $('#startdate_d').data("DateTimePicker").setDate();
        $('#enddate_d').data("DateTimePicker").setDate();
        $('#type_d').val('');
        $('#owner_d').val('');
        $('#geo_d_lat').val('');
        $('#geo_d_long').val('');
        $('#manufacture_d').val('');
        $('#desc_d').val('');
        $('#notes_d').val('');
        $('#physinfo_d').val('');
        //hide events because not update here
        $('#event_table tbody').empty();
        $('#butnewevent').hide();
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
});
