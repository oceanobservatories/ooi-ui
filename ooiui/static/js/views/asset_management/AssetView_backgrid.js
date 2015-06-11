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

        self = this;
        var classtypelist = {'.AssetRecord':{'val':1,'label':'Asset'},'.InstrumentAssetRecord':{'val':2,'label':'Instrument'},'.PlatformAssetRecord':{'val':3,'label':'Platform'}};

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
        var selectedInstrument = [];
        //bind
        self.model = new AssetModel();
        self.modalDialog = new ModalDialogView();

        var PageableDeployments = Backbone.PageableCollection.extend({
          model: AssetModel,
          url: '/api/asset_deployment',
          state: {
            pageSize: 7
          },
          mode: "client",
          parse: function(response, options) {
            this.trigger("pageabledeploy:updated", { count : response.count, total : response.total, startAt : response.startAt } );
            return response.assets;
          } // page entirely on the client side  options: infinite, server
        });

        var pageabledeploy = new PageableDeployments();
        self.collection = pageabledeploy;

        var columns = [{
            name: "assetId", // The key of the model attribute
            label: "ID", // The name to display in the header
            editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
            // Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
            cell: Backgrid.IntegerCell.extend({
                orderSeparator: ''
            })
        }, {
            name: "assetInfo",
            label: "Name",
            editable: false,
            // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
            cell: "string",
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
              fromRaw: function (rawValue, model) {
                return rawValue['name'];
              }
            }),
            sortValue: function (model, colName) {
                return model.attributes[colName]['name'];
            }
        },{
            name: "assetInfo",
            label: "Owner",
            editable: false,
            cell: "string",
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
              fromRaw: function (rawValue, model) {
                return rawValue['owner'];
              }
            }) ,
            sortValue: function (model, colName) {
                return model.attributes[colName]['owner'];
            }
        }, {
            name: "assetInfo",
            label: "Type",
            editable: false,
            cell: "string",
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
              fromRaw: function (rawValue, model) {
                return rawValue['type'];
              }
            }),
            sortValue: function (model, colName) {
                return model.attributes[colName]['type'];
            }
        }, {
            name: "launch_date_time",
            label: "Launch Date",
            editable: false,
            cell: "string"
        },{
            name: "assetInfo",
            label: "Description",
            editable: false,
            cell: "string",
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
              fromRaw: function (rawValue, model) {
                return rawValue['description'];
              }
            }),
            sortValue: function (model, colName) {
                return model.attributes[colName]['description'];
            }
        }, {
            name: "class",
            editable: false,
            label: "Class",
            cell: "string"
        }];

        //add click event
        var ClickableRow = Backgrid.Row.extend({
          highlightColor: "#eee",
          events: {
            "click": "onClick",
            mouseover: "rowFocused",
            mouseout: "rowLostFocus"
          },
          onClick: function () {
            Backbone.trigger("deployrowclicked", this.model);
            this.el.style.backgroundColor = this.highlightColor;
            //var $table = $('#table-transform');
            //$table.bootstrapTable();
          },
          rowFocused: function() {
            this.el.style.backgroundColor = this.highlightColor;
          },
          rowLostFocus: function() {
            this.el.style.backgroundColor = '#FFF';
          }
        });

        // Set up a grid to use the pageable collection
        var pageableGrid = new Backgrid.Grid({
          columns: columns,
          // enable the select-all extension and select row
          /*[{
            name: "",
            cell: "select-row",
            headerCell: "select-all"
          }].concat(columns),*/
          collection: pageabledeploy,
          row: ClickableRow
        });

        // Render the grid and attach the root to your HTML document
        $("#datatable").append(pageableGrid.render().el);

        // Initialize the paginator
        var paginator = new Backgrid.Extension.Paginator({
          collection: pageabledeploy
        });

        // Render the paginator
        $("#datatable").after(paginator.render().el);

        // Initialize a client-side filter to filter on the client
        // mode pageable collection's cache.
        //extend to match the nested object parameters
        var AssetFilter = Backgrid.Extension.ClientSideFilter.extend({
          //collection: pageabledeploy,
          //fields: ["assetId",'@class'],
          placeholder: "Search",
          makeMatcher: function(query){
               var q = '';
               if(query!=""){
                 q = String(query).toUpperCase();
               }
               return function (model) {
                  if(self.query_filter){
                    var queryhit = true;
                    //iterate through the filtering to see if it matches any of the attributes
                    for(var obj in self.query_filter){
                      for (var j = 0; j < self.query_filter[obj].length; j++ ) {
                        if(self.query_filter[obj][j] == model.attributes['assetInfo'][String(obj).toLowerCase()]){queryhit= true;}
                        else if(self.query_filter[obj][j] == model.attributes[String(obj).toLowerCase()]){queryhit= true;}
                        //this is so that it refreshes if there is no drop down queries
                        else{queryhit = false;}
                      }
                    }
                    if(q == ''){
                      return queryhit;
                    }
                  }
                  //still allow upper right hand search to occur
                  if(q == ''){
                      return true;
                  }
                  else if(model.attributes['assetInfo']['name']){
                    if(String(model.attributes['assetInfo']['name']).toUpperCase().search(q)>-1){
                        return true;
                    }
                  }
                  else if(model.attributes['assetInfo']['description']){
                    if(String(model.attributes['assetInfo']['description']).toUpperCase().search(q)>-1){
                        return true;
                    }
                  }
                  else if(model.attributes['assetInfo']['owner']){
                    if(String(model.attributes['assetInfo']['owner']).toUpperCase().search(q)>-1){
                        return true;
                    }
                  }
                  else{
                    return false;
                  }
              };
          }
        });

        var filter = new AssetFilter({
          collection: pageabledeploy
        });
        self.filter = filter;

        // Render the filter
        $("#datatable").before(filter.render().el);
        // Add some space to the filter and move it to the right
        $(filter.el).css({float: "right", margin: "20px"});
        $(filter.el).find("input").attr('id', 'asset_search_box');

        //datepickers with min/max validation
        $( "#startdate_d" ).datepicker({
          changeMonth: true,
          numberOfMonths: 2,
          maxDate: "+1m +1w",
          onClose: function( selectedDate ) {
            $( "#enddate_d" ).datepicker( "option", "minDate", selectedDate );
          }
        });
        $( "#enddate_d" ).datepicker({
          changeMonth: true,
          numberOfMonths: 2,
          maxDate: "+1m +1w",
          onClose: function( selectedDate ) {
            $( "#startdate_d" ).datepicker( "option", "maxDate", selectedDate );
          }
        });

        //asset type switcher
        $('#type_switcher_but').dropdown();
        $('#type_switcher_but_val').on('click', function(e) {
            $('#type_switcher_but').attr('data',e.target.attributes[1].value);
            $('#type_switcher_but').html(e.target.innerHTML);
        })

        // Fetch some instruments from the url
        pageabledeploy.fetch({reset: true,
            error: (function (e) {
                $('#asset_top_panel').html('There was an error with the Asset list.');
                $('#editdep_panel').html('There was an error with the Asset list.');
                alert(' Service request failure: ' + e);
            }),
            complete: (function (e) {
                $('#number_of_assets').html(e.responseJSON['assets'].length+' total records');
                $('#asset_top_panel').html('Click on an Asset to Edit');
                $('#editdep_panel').html('Click on an Asset above to Edit');

                //need to add assets to the filtrify component
                for (var t = 0; t < e.responseJSON['assets'].length; t++ ) {
                    $('#container_of_data').append("<li data-Type='"+e.responseJSON['assets'][t].assetInfo['type']+"' data-Class='"+e.responseJSON['assets'][t]['class']+"' data-Owner='"+e.responseJSON['assets'][t].assetInfo['owner']+"'><span>Type: <i>"+e.responseJSON['assets'][t].assetInfo['type']+"</i></span><span>Class: <i>"+e.responseJSON['assets'][t]['class']+"</i></span><span>Owner: <i>"+e.responseJSON['assets'][t].assetInfo['owner']+"</span></li>");
                }

                //query drop downs filters based on data
                $.filtrify( 'container_of_data', 'asset_search_pan', {
                  callback : function( query, match, mismatch ) {
                      self.query_filter = query;
                      /* complicated
                      var this_q = query;
                      self.collection.reset(self.collection.fullCollection.filter(
                        function(model){
                            if(model.attributes['@class'] == this_q['Class'][0]){
                              return !0;
                            }
                            else{
                              return !1;
                            }
                      }),{reindex: !1});*/
                      self.filter.search();
                      $('#number_of_assets').html(match.length+' total records');
                  }
              });
            })
        });

        //try to call this on page change
        pageabledeploy.on("pageabledeploy:updated", function( details ){
            //updatePagination( details, showBicycles );
        });

        //move clicked row to edit panel
        Backbone.on("deployrowclicked", function (model) {
            //get all the events for the asset to populate table
            $('#editdep_panel').html('<i class="fa fa-spinner fa-spin"></i>  Loading Events...');
            var assetInfoModel = new AssetEvents({id:model.attributes.assetId});
            assetInfoModel.fetch({
              success: function (events) {
                $('#event_table tbody').empty();
                $('#butnewevent').show();

                $('#butnewevent').on('click',function(){
                    window.open('/event/new/'+events.attributes.assetId+'/'+events.attributes.class,'_blank');
                });
                $('#physinfo_d').val(events.attributes.physicalInfo);

                if(events.attributes.events){
                  for (var j in events.attributes.events){
                    var sd = new Date(events.attributes.events[j].startDate);
                    $('#event_table tbody').append("<tr id="+events.attributes.events[j].eventId+"><td style=''>"+events.attributes.events[j].eventId+"</td><td style=''>"+String(events.attributes.events[j].class).replace('.','')+"</td><td style=''>"+sd.toDateString()+"</td><td style=''><i class='fa fa-info-circle'></i></td></tr>");
                    //stupid hack again
                    $('.fixed-table-container').css('padding-bottom','0px');
                    $('#event_table').css('margin-top','0px');
                    $('.fixed-table-header').css('display','none');
                  }
                }
                $('#editdep_panel').html('Click on an Asset above to Edit');

                //event click -- go to event page add each time new events are loaded
                $('#event_table tr').click(function(row) {
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
            $('#editdep_map').show();
            map.invalidateSize();
            selectedInstrument = model.attributes;

            $('#name_d').val(model.attributes.assetInfo['name']);
            $('#owner_d').val(model.attributes.assetInfo['owner']);
            if(model.attributes.water_depth){
              $('#depth_d').val(model.attributes.water_depth['value']);
            }
            else{
               $('#depth_d').val('');
            }

            //stupid catch for the date contat
            if(model.attributes.launch_date_time){
              if(String(model.attributes.launch_date_time).search('Z')>-1){
                var dobj = String(model.attributes.launch_date_time).split('Z')
                var l_date = Date.parse(dobj[0]);
              }
              else if(!isNaN(model.attributes.launch_date_time)){
                var l_date = new Date(model.attributes.launch_date_time*1000);
              }
              else{
                var l_date = Date.parse(model.attributes.launch_date_time);
              }

              $("#startdate_d" ).datepicker( "setDate", l_date);
            }
            else{
               $("#startdate_d" ).datepicker( "setDate", '' );
            }
            /*if(model.attributes.launch_date_time){
              var l_date = Date.parse(model.attributes.launch_date_time);
              $("#enddate_d" ).datepicker( "setDate", l_date );
            }
            else{
               $("#enddate_d" ).datepicker( "setDate", '' );
            }*/

            $("#enddate_d" ).datepicker( "setDate", "" );//10/12/2014
            $('#desc_d').val(model.attributes.assetInfo['description']);
            $('#notes_d').val(model.attributes.notes);
            if(model.attributes.manufactureInfo){
              $('#manufacture_d').val(model.attributes.manufactureInfo['manufacturer']);
            }
            else{
               $('#manufacture_d').val('');
            }
            $("#type_d").val(model.attributes.assetInfo['type']);
            $("#type_switcher_but").attr('data', model.attributes.class);
            $("#type_switcher_but").val(classtypelist[model.attributes.class].val);
            $('#type_switcher_but').html(classtypelist[model.attributes.class].label+' <span class="caret"></span>');

            //remove marker
            if(self.asset_mark){map.removeLayer(self.asset_mark)};

            if(model.attributes.coordinates != null){
                //for geojson ....
                if(model.attributes.coordinates.length>0){
                //if(model.attributes.geo_location.type == "Point"){
                    //[x,y]
                    $('#geo_d_lat').val(model.attributes.coordinates[0]);
                    $('#geo_d_long').val(model.attributes.coordinates[1]);

                    // add a marker in the given location, attach some popup content to it and open the popup
                    var asset_mark = L.marker([model.attributes.coordinates[0], model.attributes.coordinates[1]]).addTo(map)
                        .bindPopup(model.attributes.assetInfo['name'])
                        .openPopup();
                    self.asset_mark = asset_mark;
                    map.panTo({lat: model.attributes.coordinates[0], lng: model.attributes.coordinates[1]});
                    //map.setView({lat: 50, lng: 30},8);
                }
            }
        });

        //on button bar click
        $('#deploy_edit').click(function(t) {
            var deploy_obj_ = {};

            if(t.target.innerText.search('NEW')>-1){
                self.clearform();
                selectedInstrument = [];
                self.model =  new AssetModel();
                $('#editdep_map').show();
                map.invalidateSize();
                $('#editdep_form').show();
                //check to see if there is marker on the map and remove it
                if(self.asset_mark){map.removeLayer(self.asset_mark)};
                $('#editdep_panel').html('Click Save to create new Record.');
            }
            else if(t.target.innerText.search('SAVE'>-1)){
                //save to db
                if (self.model.isValid()) {
                    $('#editdep_panel').html('<i class="fa fa-spinner fa-spin"></i>  Saving...');
                   // that.model.attributes = selectedInstrument;
                    self.model.set('launch_date_time',$( "#startdate_d" ).datepicker('getDate' ).toISOString());
                    //self.model.set('end_date',$( "#enddate_d" ).datepicker('getDate' ));
                    var infoObj = {};
                    infoObj['name']= $('#name_d').val();
                    infoObj['owner']= $('#owner_d').val();
                    infoObj['type']= $('#type_d').val();
                    infoObj['description']= $('#desc_d').val();
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

                    self.model.set('lastModifiedTimestamp', selectedInstrument['lastModifiedTimestamp']);
                    self.model.set('ref_des', selectedInstrument['ref_des']);
                    //existing? this is to put edits
                    if(selectedInstrument['assetId']){
                        self.model.set('id',selectedInstrument['assetId']);
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
                            console.log(model);
                            console.log(response.responseText);
                            $('#editdep_panel').html('Save Error.');
                          }
                        });

                        //reset
                        selectedInstrument = [];
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
                if(selectedInstrument['assetId']){

                    $('#editdep_panel').html('<i class="fa fa-spinner fa-spin"></i>  Deleting.');
                    self.model.set('id',selectedInstrument['assetId']);

                    self.model.destroy({
                      success: function(model, response, options) {
                        console.log("destroyed");
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
                        console.log(model);
                        console.log(response.responseText);
                        $('#editdep_panel').html('Delete Error.');
                      }
                    });

                    //reset
                    selectedInstrument = [];
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
        $('#depth_d').val('');
        $('#name_d').val('');
        $('#startdate_d').val('');
        $('#enddate_d').val('');
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

    updatemarker:function(){

      if(self.asset_mark){self.map.removeLayer(self.asset_mark)};
      if($('#geo_d_lat').val()!=''& $('#geo_d_long').val()!=''){
        var asset_mark = L.marker([$('#geo_d_lat').val(), $('#geo_d_long').val()]).addTo(self.map);
        self.asset_mark = asset_mark;
        self.map.panTo({lat: $('#geo_d_lat').val(), lng: $('#geo_d_long').val()});
      }
    }
});