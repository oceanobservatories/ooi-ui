"use strict";
/*
 *
 * ooiui/static/js/models/asset_management/EventsView.js
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
 
var EventsView = Backbone.View.extend({

	initialize: function() {
		_.bindAll(this,"render");
		this.render();
	},
	//renders a simple map view
	render: function() {
        
        var self = this;
        var filtertypelist = {'Type':{'val':1,'label':'eventType'},'Class':{'val':2,'label':'class'},'Cruise':{'val':3,'label':'cruiseNumber'}};

        //bind
        self.model = new EventsModel();
        self.modalDialog = new ModalDialogView();

        var PageableDeployments = Backbone.PageableCollection.extend({
          model: EventsModel,
          url: '/api/asset_events',
          state: {
            pageSize: 18
          },
          mode: "client",
          parse: function(response, options) {
            this.trigger("pageabledeploy:updated", { count : response.count, total : response.total, startAt : response.startAt } );
            return response.events;
          } // page entirely on the client side  options: infinite, server
        });

        var pageabledeploy = new PageableDeployments();
        self.collection = pageabledeploy;
        
        var columns = [{
            name: "eventId", // The key of the model attribute
            label: "ID", // The name to display in the header
            editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
            // Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
            cell: Backgrid.IntegerCell.extend({
                orderSeparator: ''
            })
        }, {
            name: "cruiseNumber",
            editable: false,
            label: "Cruise Name",
            cell: "string"
        },
        /*{
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
        },*/{
            name: "eventType",
            label: "Type",
            editable: false,
            cell: "string"
        }, {
            name: "class",
            label: "Class",
            editable: false,
            cell: "string"
        }, {
            name: "startDate",
            label: "Start Date",
            editable: false,
            cell: "string",
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
              fromRaw: function (rawValue, model) {
                if(rawValue !=null){
                  var sd = new Date(rawValue);
                  return sd.toDateString();
                }
                else{
                  return 'No Date';
                }
              }
            })
        },{
            name: "endDate",
            label: "End Date",
            editable: false,
            cell: "string",
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
              fromRaw: function (rawValue, model) {
                if(rawValue !=null){
                  var sd = new Date(rawValue);
                  return sd.toDateString();
                }
                else{
                  return 'No Date';
                }
              }
            })
        }, {
            name: "deploymentDepth",
            editable: false,
            label: "Depth",
            cell: "string"
        },{
            name: "eventDescription",
            label: "Description",
            editable: false,
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
            var $table = $('#table-transform');
            $table.bootstrapTable();
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
                  var queryhit = false;
                  
                  if(self.query_filter){
                    //iterate through the filtering to see if it matches any of the attributes
                    queryhit = true;
                    for(var obj in self.query_filter){
                      for (var j = 0; j < self.query_filter[obj].length; j++ ) {
                        if(self.query_filter[obj][j] == model.attributes[filtertypelist[obj].label]){queryhit= true;}
                        //else if(self.query_filter[obj][j] == model.attributes[String(obj).toLowerCase()]){queryhit= true;}
                        //this is so that it refreshes if there is no drop down queries
                        else{queryhit = false;}
                      }
                    }
                    if(q==''){
                     return queryhit;
                    }
                  }
                  //still allow upper right hand search to occur
                  if(q==''){
                     queryhit= true;
                  }
                  else{
                    if(model.attributes['class']){
                      if(String(model.attributes['class']).toUpperCase().search(q)>-1){
                          queryhit= true;
                      }else{queryhit= false};
                    }
                    if(model.attributes['eventDescription']){
                      if(String(model.attributes['eventDescription']).toUpperCase().search(q)>-1){
                          queryhit= true;
                      }else{queryhit= false};
                    }
                    if(model.attributes['eventType']){
                      if(String(model.attributes['eventType']).toUpperCase().search(q)>-1){
                          queryhit= true;
                      }else{queryhit= false};
                    }
                    if(model.attributes['cruiseNumber']){
                      if(String(model.attributes['cruiseNumber']).toUpperCase().search(q)>-1){
                          queryhit= true;
                      }else{queryhit= false};
                    }
                  }
                  
                  return queryhit;
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

        
        // Fetch some Events from the url
        pageabledeploy.fetch({reset: true,
            error: (function (e) {
                $('#asset_top_panel').html('There was an error with the Event list.');
                alert(' Service request failure: ' + e);
            }),
            complete: (function (e) {
                $('#number_of_assets').html(e.responseJSON['events'].length+' total records');
                $('#asset_top_panel').html('Click on an Event to View/Edit');

                //need to add assets to the filtrify component
                for ( var t = 0; t < e.responseJSON['events'].length; t++ ) {
                    $('#container_of_data').append("<li data-Type='"+e.responseJSON['events'][t]['eventType']+"' data-Class='"+e.responseJSON['events'][t]['class']+"' data-Cruise='"+e.responseJSON['events'][t]['cruiseNumber']+"'><span>Type: <i>"+e.responseJSON['events'][t]['eventType']+"</i></span><span>Class: <i>"+e.responseJSON['events'][t]['class']+"</i></span><span>Cruise: <i>"+e.responseJSON['events'][t]['cruiseNumber']+"</span></li>");
                }

                //query drop downs filters based on data
                $.filtrify( 'container_of_data', 'asset_search_pan', {
                  callback : function( query, match, mismatch ) {
                      self.query_filter = query;
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
            //got to event page for that event
            if(model.attributes.eventId){
                window.open('/event/'+model.attributes.eventId,'_blank');
            }
        });
      }  
});