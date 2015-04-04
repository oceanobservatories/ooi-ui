/*
 *
 * ooiui/static/js/models/common/FilterViewModel.js
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
Backbone.Validation.configure({
    forceUpdate: true
});

_.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.removeClass('has-error');
        $group.find('.help-block').html('').addClass('hidden');
    },
    invalid: function (view, attr, error, selector) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.addClass('has-error');
        $group.find('.help-block').html(error).removeClass('hidden');
    }
});


var AlertFilterView = Backbone.View.extend({
   events: {
        'click #saveAlert': function (e) {
            e.preventDefault();
            this.submit();
        },
        'click #RemoveConditions':function(e) {
          e.preventDefault();
          this.removeConditions(e);
        }
    },

    // Use stickit to perform binding between
    // the model and the view
    bindings: {
        '[name=array]': {
            observe: 'array',
            selectOptions: {
                collection: []
            },

            setOptions: {
                validate:false 
            }
        },
        '[name=Platform]': {
            observe: 'Platform',
            setOptions: {
                validate: false
            }
        },
        '[name=Instrument]': {
            observe: 'Instrument',
            selectOptions:{
              collections: []
            },
            setOptions: {
                validate: false
            }
        },
         '[name=Email]': {
            observe: 'Email',
            setOptions: {
                validate: false
            }
          },
           '[name=Redmine]': {
            observe: 'Redmine',
            setOptions: {
                validate: false
            }
          },
           '[name=PhoneCall]': {
            observe: 'PhoneCall',
            setOptions: {
                validate: true
            }
          },

           '[name=TextMessage]': {
            observe: 'TextMessage',
            setOptions: {
                validate: false
            }
          },
            '[name=LogEvent]': {
            observe: 'LogEvent',
            setOptions: {
                validate: false
            }
          },   
    },

    initialize: function () {
        Backbone.Validation.bind(this);
        _.bindAll(this, "render", "submit", "remove", "addConditions","triggernewAlertList", "removeConditions","filterOptionsbyInstrument","showtypeoptions","showenabledoptions" );
         
        this.listenTo(ooi, 'arrayItemView:arraySelect', this.triggerTOCClickA);
        this.listenTo(ooi, 'platformDeploymentItemView:platformSelect',this.triggerTOCClickP);
        this.listenTo(ooi, 'instrumentDeploymentItemView:instrumentSelect', this.triggerTOCClickI);
        //this.listenTo(ooi, 'streamItemView:streamSelect', this.changeStream);
        var self = this;

        
        self.modalDialog = new ModalDialogView();
        //this.listenTo(this.collection, 'reset', function(){
        self.render();
        //});
    },

    render: function () {
        var self = this;
        var AlertsFullCollectionPage = Backbone.PageableCollection.extend({
            model: AlertModel,
            url:"/api/aa/arrays",
            state: {
              pageSize: 7
            },
            mode: "client",
            parse: function(response, options) {
              //this.trigger("pageabledeploy:updated", { count : response.count, total : response.total, startAt : response.startAt } );
              
              //for the response after asset query
              if(response.alert_alarm_definition){
                return response.alert_alarm_definition;
              }
              else{
                return response
              }
            } 
        });

        var pageablealerts = new AlertsFullCollectionPage();
        self.collection = pageablealerts;

        var HtmlCell = Backgrid.HtmlCell = Backgrid.Cell.extend({
          className: "html-cell",
          initialize: function () {
              Backgrid.Cell.prototype.initialize.apply(this, arguments);
          },
          render: function () {
              this.$el.empty();
              var rawValue = this.model.get(this.column.get("name"));
              var formattedValue = this.formatter.fromRaw(rawValue, this.model);
              this.$el.append(formattedValue);
              this.delegateEvents();
              return this;
          }
        });

        var columns = [{
            name: "array_name", // The key of the model attribute
            label: "Array", // The name to display in the header
            editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
            cell: "string"
        }, {
            name: "instrument_name",
            label: "Platform",
            editable: false,
            // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
            cell: "string",
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
              fromRaw: function (rawValue, model) {
                return "Platform Q";
              }
            }),
            sortValue: function (model, colName) {
                return colName;
            }
        },{
            name: "instrument_name",
            label: "Instrument",
            editable: false,
            cell: "string",
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
              fromRaw: function (rawValue, model) {
                return "Instrument B"
                //return rawValue;
              }
            }) ,
            sortValue: function (model, colName) {
                return model.attributes[colName]['instrument_name'];
            }
        }, {
            name: "priority",
            label: "Priority",
            editable: false,
            cell: "string",
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
              fromRaw: function (rawValue, model) {
                return rawValue;
              }
            })
        }, {
            name: "created_time",
            label: "Created",
            editable: false,
            cell: "string"
        },{
            name: "priority",
            editable: false,
            label: "Condition Met?",
            cell: HtmlCell,
            formatter: _.extend({}, Backgrid.Cell.prototype, {
              fromRaw: function (rawValue, model) {

                //place holder right now for triggered events
                if(rawValue =='alarm'){
                  //fa fa-bullhorn
                    return "<i id='condition_met' style='font-size:20px;float:right;padding-right: 20px;color:#a94442' class='fa fa-exclamation-triangle'> Yes</i>";
                }
                else if(rawValue =='alert'){
                    return "<i id='condition_met' style='font-size:20px;float:right;padding-right: 20px;color:#3c763d' class='fa fa-thumbs-up'> No</i>";
                }
              }
            })
        }
        /*,{
            name: "description",
            editable: false,
            label: "Descritption",
            cell: "string"
        }*/];

        //add click event
        var ClickableRow = Backgrid.Row.extend({
          highlightColor: "#eee",
          events: {
            "click": "onClick",
            mouseover: "rowFocused",
            mouseout: "rowLostFocus"
          },
          onClick: function (e) {
            Backbone.trigger("deployrowclicked", this.model);
            this.el.style.backgroundColor = this.highlightColor;

            //check to see if the condtion met item has ben clicked and open triggered events
            if(e.target.id=='condition_met'){
               this.triggeredalertView = new TriggeredAlertDialogView();
                $('.container-fluid').first().append(this.triggeredalertView.el);

                this.triggeredalertView.show({
                  instrument: "Instrument Name: "  + this.model.attributes.Instrument,
                  recent: "<i>None at this time</i>",
                  history: "<i style='color:#337ab7;' class='fa fa-spinner fa-spin fa-5x'></i>",
                  variable: this.model.attributes.reference_designator,
                  //ctype: "alert",
                  //title: this.model.attributes.display_name,
                  ack: function() { console.log("Closed");}
                });
            }
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
          collection: pageablealerts,
          row: ClickableRow
        });

        // Render the grid and attach the root to your HTML document
        $("#alertslist").append(pageableGrid.render().el);

        // Initialize the paginator
        var paginator = new Backgrid.Extension.Paginator({
          collection: pageablealerts
        });

        // Render the paginator
        $("#alertslist").after(paginator.render().el);
        var AssetFilter = Backgrid.Extension.ClientSideFilter.extend({
          placeholder: "Search Alerts and Alarms",
          makeMatcher: function(query){
               var q = '';
               if(query!=""){
                 q = String(query).toUpperCase();
               }
               return function (model) {
                var queryhit= false;
                if(model.attributes['instrument_name']){
                  if(String(model.attributes['instrument_name']).toUpperCase().search(q)>-1){
                      queryhit= true;
                  }
                }
                if(model.attributes['description']){
                  if(String(model.attributes['description']).toUpperCase().search(q)>-1){
                      queryhit= true;
                  }
                }
                if(model.attributes['array_name']){
                  if(String(model.attributes['array_name']).toUpperCase().search(q)>-1){
                      queryhit= true;
                  }
                }
                if(model.attributes['priority']){
                  if(String(model.attributes['priority']).toUpperCase().search(q)>-1){
                      queryhit= true;
                  }
                }
                return queryhit;
              };
          }
        });

        var filter = new AssetFilter({
          collection: pageablealerts
        });
        self.filter = filter;

        // Render the filter
        $("#alertslist").before(filter.render().el);
        // Add some space to the filter and move it to the right
        $(filter.el).css({float: "right", margin: "20px"});
        $(filter.el).find("input").attr('id', 'alert_search_box');

        pageablealerts.fetch({reset: true,
            error: (function (e) {
                alert(' Service request failure: ' + e);
            }),
            complete: (function (e) {
                $('#loading_alerts').html('');
            })
        });

        //move clicked row to edit panel
        Backbone.on("deployrowclicked", function (model) {
            self.addConditions(model);

        });
        
        $('#resetAlarms').click(function(row) {
            $('#loading_alerts').html('<i style="color:#337ab7" class="fa fa-spinner fa-spin"></i>  Loading Alerts and Alarms');
            self.collection.url = "/api/aa/arrays";

            self.collection.fetch({reset: false,
                error: (function (e) {
                    self.modalDialog.show({
                      message: "Error Requesting Alerts for this Asset.",
                      type: "danger",
                    });
                }),
                complete: (function (e) {
                    $('#loading_alerts').html('');                
                })
            });
        });

        $('#saveAlarm').click(function(row) {
            //save data
            self.modalDialog.show({
                message: "Alert Saved",
                type: "success",
              });

            /*if(response.statusCode.search('ERROR')>-1||response.statusCode.search('BAD')>-1){
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
            }*/
        });

        $('#newAlert').click(function(row) {
            //add new line
            if($('#loading_alerts').html() == ''){
              self.modalDialog.show({
                message: "Please Select an Instrument to Add Alert to",
                type: "danger",
              });
            }
            else{
            }
        });
        //needs model to stickit not using right now
        //this.stickit();
    },

    addConditions: function(val){
      //<i id='removealert' style='padding-left:20px' class='fa fa-minus-circle'></i>
      //var $table = $('#table-transform');
      //$table.bootstrapTable();
      //backgrid extentsions
      //https://github.com/twatson83/Backgrid.Extensions
      $('#loading_alerts').html('Instrument: '+val.attributes.Instrument);
      $('#alert_table tbody').empty();
      
      var filteroptions = this.filterOptionsbyInstrument(val.attributes.reference_designator);
      $('#alert_table tbody').append("<tr id="+val.attributes.uframe_definition_id+"><td style='min-width:180px'>"+filteroptions+"</td><td style=''>"+val.attributes.operator+' '+val.attributes.values+"</td><td style=''>"+val.attributes.description+"</td><td style=''>John Smith - WHOI</td><td style=''>"+this.showtypeoptions()+"</td><td style=''>"+this.showenabledoptions()+"</td></tr>");
      
      //stupid hack to make the columns match
      $('.fixed-table-container').css('padding-bottom','0px');
      $('#alert_table').css('margin-top','0px');
      $('.fixed-table-header').css('display','none');

      $('#conditions_dd').selectpicker().val(val.attributes.instrument_parameter);
      $('#type_dd').selectpicker();
      $('#type_dd').selectpicker().val(val.attributes.priority);
      $('#enabled_dd').selectpicker();
      $('#enabled_dd').selectpicker().val(val.attributes.active);

      $('#alert_table tr').click(function(row) {
          //var eventrow = new SingleEvent({id:row.currentTarget.id});
          //location.reload();
          /*if(row.target.id == 'removealert'){
            self.modalDialog.show({
                message: "Alert is deactivated",
                type: "success",
              });
          }*/
      });  
    },

    filterOptionsbyInstrument: function(instru_id){
      //get unique values for the dropdown
      return "<select  class='form-control' data-container='body' id='conditions_dd'><option>Longitude</option><option>Latitude</option><option>Salinity</option><option>Temperature</option><option>Water Speed</option><option>Wave Height</option></select><span class='help-block hidden'</span>";
    },

    showtypeoptions:function(){
      return "<select data-show-icon='true' data-container='body' class='form-control' id='type_dd'><option value='Alert'>Alert</option><option data-content='<i class='fa fa-exclamation-triangle'></i>' value='Alarm'> Alarm</option></select>"; 
    },

    showenabledoptions:function(){
      return "<select data-show-icon='true' data-container='body' class='form-control' id='enabled_dd'><option data-content='<i class='fa fa-minus-circle'></i>' value='false'> False</option><option data-content='<i class='fa fa-check-circle'></i>' value='true'>True</option></select>"; 
    },
    

    /*click on the left hand side of the TOC */
    triggerTOCClickP:function(tocitem){
        $('#listTitle').html('Showing Alerts for Platform: <b>'+ tocitem.attributes.assetInfo['name']  +' ' +tocitem.attributes.assetId);
        //tocitem.attributes.reference_designator
        $('#loading_alerts').html('<i style="color:#337ab7" class="fa fa-spinner fa-spin"></i>  Loading Alerts and Alarms');
        this.triggernewAlertList('platform='+tocitem.attributes.reference_designator,false);
    },
    triggerTOCClickI:function(tocitem){
        $('#listTitle').html('Showing Alerts for Instrument: <b>'+ tocitem.attributes.assetInfo['name'] +' ' +tocitem.attributes.assetId);
        $('#loading_alerts').html('<i style="color:#337ab7" class="fa fa-spinner fa-spin"></i>  Loading Alerts and Alarms');
        this.triggernewAlertList('instrument='+tocitem.attributes.ref_des,true);
    },
    triggerTOCClickA:function(tocitem){
        $('#listTitle').html('Showing Alerts for Array: <b>'+ tocitem.attributes.display_name);
        $('#loading_alerts').html('<i style="color:#337ab7" class="fa fa-spinner fa-spin"></i>  Loading Alerts and Alarms');
        this.triggernewAlertList('array='+tocitem.attributes.reference_designator,false)
    },

    triggernewAlertList:function(id_val,instr){
      //this is for later for filtering alerts on certain platforms, arrays, instruments
      var self = this;
      self.instru = instr;
      self.name = id_val;
      this.collection.url = '/api/aa/'+id_val;

      this.collection.fetch({reset: false,
          error: (function (e) {
              self.modalDialog.show({
                message: "Error Requesting Alerts for this Asset.",
                type: "danger",
              });
          }),
          complete: (function (e) {
              if(self.instru == true){
                $('#loading_alerts').html('Instrument: '+ self.name);
              }
              else{
                $('#loading_alerts').html('');
              }                
          })
      });
    },

    submit: function () {
        var self = this;
       if (this.model.isValid(false)) {
            this.model.save(null, {
              success: function(model, response) {
               },
              error: function(model, response) {
                try {
                  var errMessage = JSON.parse(response.responseText).error;
                } catch(err) {
                  console.error(err);
                  var errMessage = "Unable to submit user";
                }
              }
            });
        }
    },
    
    conditionsFilter: function(e){

    },
    
    removeConditions: function(e){
      
    },
  
    remove: function () {
        
    }
});
