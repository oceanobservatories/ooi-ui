"use strict";
/*
 * ooiui/static/js/views/aa/StatusAlertTableView.js
 */

 var StatusAlertTableView = Backbone.View.extend({
  bindings: {
  },
  events: {    
  },
  initialize: function() {
    _.bindAll(this, "render");    
    this.initialRender();
  },
  initialRender:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  template: JST['ooiui/static/js/partials/StatusAlert.html'],
  render:function(options){
    var self = this;

    this.$el.html(this.template());

    var PageableModels = Backbone.PageableCollection.extend({
      model: StatusAlertModel,     
      state: {
        pageSize: 20
      },
      mode: "client" // page entirely on the client side
    });

    var pageableCollection = new PageableModels();

    self.collection.each(function(model,i){       
      pageableCollection.add(model)
    });    


    var ClickableRow = Backgrid.Row.extend({
      events: {
        "click": "onClick"
      },
      onClick: function () {
        ooi.trigger('statusTable:rowSelected',this.model);
      }
    });

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

    var columns = [
      {
        name: "reference_designator",
        label: "Reference Designator",        
        cell: "string",
        editable: false,
      },
      {
        name: "asset_type",
        label: "Asset Type",
        cell: "string",
        editable: false,
      }, 
      {
        name: "count",
        label: "Message Count",
        cell: "integer",
        editable: false,
      },       
      {
        name: "event_type",
        editable: false,
        label: "Event Type",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            //console.log(rawValue);
            //place holder right now for triggered events
            if(rawValue == "alert"){
              //return "Active";
              return "<i id='event_type_def' style='font-size:20px;padding-right: 0px;color:#004773;' class='fa fa-circle'> Alert</i>";
            }
            else if(rawValue == "alarm"){
              //return "Disabled";
              return "<i id='event_type_def' style='font-size:20px;padding-right: 0px;color:#004773;' class='fa fa-circle'> Alarm</i>";
            }
            else if(rawValue == "inactive"){
              //return "Disabled";
              return "<i id='event_type_def' style='font-size:20px;padding-right: 0px;color:steelblue;' class='fa fa-circle'> Healthy</i>";
            }
            else if(rawValue == "unknown"){
              //return "Disabled";
              return "<i id='event_type_def' style='font-size:20px;padding-right: 0px;color:gray;' class='fa fa-circle'> Unknown</i>";
            }
          }
        })
      },
      ];

    // Initialize a new Grid instance
    /*
    var grid = new Backgrid.Grid({
      row: FocusableRow,
      columns: columns,
      collection: self.collection
    });
    */

    // Set up a grid to use the pageable collection
    var pageableGrid = new Backgrid.Grid({
      row: ClickableRow,
      columns: columns,
      collection: pageableCollection
    });

    // Initialize the paginator
    var paginator = new Backgrid.Extension.Paginator({
      collection: pageableCollection
    });

    

    // Render the grid and attach the root to your HTML document
    this.$el.find("#sampleTable").append(pageableGrid.render().el);    
    // Render the paginator    
    this.$el.find("#sampleTable").append(paginator.render().el);

    }     
});

