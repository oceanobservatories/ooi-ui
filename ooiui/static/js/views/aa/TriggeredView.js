"use strict";
/*
 *
 * ooiui/static/js/models/aa/TriggeredView.js
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


var TriggeredView = Backbone.View.extend({
   events: {
        /*'click #saveAlert': function (e) {
            e.preventDefault();
            this.submit();
        }*/
    },

    initialize: function () {
        Backbone.Validation.bind(this);
        _.bindAll(this, "render" );
         
        this.listenTo(ooi, 'arrayItemView:arraySelect', this.triggerTOCClickA);
        this.listenTo(ooi, 'platformDeploymentItemView:platformSelect',this.triggerTOCClickP);
        this.listenTo(ooi, 'InstrumentItemView:instrumentSelect', this.triggerTOCClickI);
        //this.listenTo(ooi, 'streamItemView:streamSelect', this.changeStream);
        var self = this;

        self.modalDialog = new ModalDialogView();
        //this.listenTo(this.collection, 'reset', function(){
        self.render();
        //});
    },

    render: function () {
        var self = this;
        var TriggerFullCollectionPage = Backbone.PageableCollection.extend({
            model: TriggeredModel,
            url:"/api/aa/triggered",
            state: {
              pageSize: 16
            },
            mode: "client",
            parse: function(response, options) {
              //this.trigger("pageabledeploy:updated", { count : response.count, total : response.total, startAt : response.startAt } );
              
              //for the response after asset query
              if(response.alert_alarm){
                return response.alert_alarm;
              }
              else{
                return response
              }
            } 
        });

        var pageabletriggers = new TriggerFullCollectionPage();
        self.collection = pageabletriggers;

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
            name: "event_response", // The key of the model attribute
            label: "Event Label", // The name to display in the header
            editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
            cell: "string"
        },  {
            name: "event_time",
            label: "Event Time",
            editable: false,
            cell: "string"
        },
        {
            name: "event_response", // The key of the model attribute
            label: "Event Value", // The name to display in the header
            editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
            cell: "string",
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
              fromRaw: function (rawValue, model) {
                return "5.432"
              }
            })
        },
        {
            name: "event_type",
            editable: false,
            label: "Event Type",
            cell: HtmlCell,
            formatter: _.extend({}, Backgrid.Cell.prototype, {
              fromRaw: function (rawValue, model) {

                //place holder right now for triggered events
                if(rawValue =='alarm'){
                  //fa fa-bullhorn
                  return "<i id='condition_met' style='font-size:20px;float:right;padding-right: 20px;color:#a94442' class='fa fa-exclamation-circle'> Alarm</i>";
                }
                else if(rawValue =='alert'){
                  return "<i id='condition_met' style='font-size:20px;float:right;padding-right: 20px;color:#E3A615' class='fa fa-flag'> Alert</i>";
                }
              }
            })
        }];

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
            //Todo Open widow with triggered alerts metadata
            /*if(e.target.id=='condition_met'){
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
            }*/
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
          collection: pageabletriggers,
          row: ClickableRow
        });

        // Render the grid and attach the root to your HTML document
        $("#triggerlist").append(pageableGrid.render().el);

        // Initialize the paginator
        var paginator = new Backgrid.Extension.Paginator({
          collection: pageabletriggers
        });

        // Render the paginator
        $("#triggerlist").after(paginator.render().el);
        var AssetFilter = Backgrid.Extension.ClientSideFilter.extend({
          placeholder: "Search Triggered Events",
          makeMatcher: function(query){
               var q = '';
               if(query!=""){
                 q = String(query).toUpperCase();
               }
               return function (model) {
                var queryhit= false;
                if(model.attributes['event_response']){
                  if(String(model.attributes['event_response']).toUpperCase().search(q)>-1){
                      queryhit= true;
                  }
                }
                if(model.attributes['event_type']){
                  if(String(model.attributes['event_type']).toUpperCase().search(q)>-1){
                      queryhit= true;
                  }
                }
                return queryhit;
              };
          }
        });

        var filter = new AssetFilter({
          collection: pageabletriggers
        });
        self.filter = filter;

        // Render the filter
        $("#triggerlist").before(filter.render().el);
        // Add some space to the filter and move it to the right
        $(filter.el).css({float: "right", margin: "20px"});
        $(filter.el).find("input").attr('id', 'trigger_search_box');

        pageabletriggers.fetch({reset: true,
            error: (function (e) {
                alert(' Service request failure: ' + e);
            }),
            complete: (function (e) {
                $('#loading_triggers').html('');
            })
        });

        //move clicked row to edit panel
        Backbone.on("deployrowclicked", function (model) {
            //self.addConditions(model);
        });
        
        $('#resetTriggers').click(function(row) {
            $('#loading_triggers').html('<i style="color:#337ab7" class="fa fa-spinner fa-spin"></i>  Loading Triggered Alerts and Alarms');
            self.collection.url = "/api/aa/triggered";

            self.collection.fetch({reset: false,
                error: (function (e) {
                    self.modalDialog.show({
                      message: "Error Requesting Alerts for this Asset.",
                      type: "danger",
                    });
                }),
                complete: (function (e) {
                    $('#loading_triggers').html('');                
                })
            });
        });
    },    

    /*click on the left hand side of the TOC */
    triggerTOCClickP:function(tocitem){
        $('#listTitle').html('Showing Alerts for Mooring: <b>'+ tocitem.attributes['mooring_display_name']);
        //tocitem.attributes.reference_designator
        $('#loading_triggers').html('<i style="color:#337ab7" class="fa fa-spinner fa-spin"></i>  Loading Triggered Alerts and Alarms');
        this.triggernewAlertList('platform_name='+tocitem.attributes.reference_designator,false);
    },
    triggerTOCClickI:function(tocitem){

        $('#listTitle').html('Showing Alerts for Platform: <b>'+ tocitem.attributes['platform_display_name']);
        $('#loading_triggers').html('<i style="color:#337ab7" class="fa fa-spinner fa-spin"></i>  Loading Triggered Alerts and Alarms');
        this.triggernewAlertList('instrument_name='+tocitem.attributes.reference_designator,true);
    },
    triggerTOCClickA:function(tocitem){
        $('#listTitle').html('Showing Alerts for Array: <b>'+ tocitem.attributes.display_name);
        $('#loading_triggers').html('<i style="color:#337ab7" class="fa fa-spinner fa-spin"></i>  Loading Triggered Alerts and Alarms');
        this.triggernewAlertList('array_name='+tocitem.attributes.reference_designator,false)
    },
    triggernewAlertList:function(id_val,instr){
      //this is for later for filtering alerts on certain platforms, arrays, instruments
      var self = this;
      self.instru = instr;
      self.name = id_val;
      this.collection.url = '/api/aa/triggered/'+id_val;

      this.collection.fetch({reset: false,
          error: (function (e) {
              self.modalDialog.show({
                message: "Error Requesting Alerts for this Asset.",
                type: "danger",
              });
          }),
          complete: (function (e) {
              if(self.instru == true){
                $('#loading_triggers').html(''+ self.name);
              }
              else{
                $('#loading_triggers').html('');
              }                
          })
      });
    }
});
