"use strict";
/*
* ooiui/static/js/views/c2/ArraySideBarView.js
* View definitions for charts
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
* Models
*
* Usage
*/
var PlatformPortsView = Backbone.View.extend({
  tagName: 'div',
  className: '',
  events: {
  },
  /*
   * When one of the links are clicked we trigger this method which gets the
   * data-id attribute in the tag and publishes a new event org:click with the
   * model_id as the parameter.
   */
  onClick: function(event) {
  },
  /*
   * During initialization of this view we fetch the collection and render when
   * it's complete.
   */
 initialize: function(options) {
    _.bindAll(this, "render");
    this.render();
  },

  /*
  Clicking the table of contents of Arrays
  */
  selectInstrument: function(array_id) {
  },

  render: function() {
    var self = this;

    var $ss = $("#datatablePports");

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
            name: "class", // The key of the model attribute
            label: "Class Name", // The name to display in the header
            editable: false,
            cell: "string"
        }, {
            name: "port_status",
            label: "Port Status",
            editable: false,
            cell: HtmlCell,
            formatter: _.extend({}, Backgrid.Cell.prototype, {
              fromRaw: function (rawValue, model) {
                if(rawValue =='Online'){
                    return "<i style='pointer-events: none; font-size:20px;float:right;padding-right: 20px;' class='fa fa-thumbs-up c2-online'></i>";
                }
                else if(rawValue =='Offline'){
                    return "<i style='pointer-events: none; font-size:20px;float:right;padding-right: 20px;' class='ffa fa-thumbs-down c2-offline'></i>";
                }
                else{
                    return "<i style='pointer-events: none; font-size:20px;float:right;padding-right: 20px;' class='fa fa-question-circle c2-unknown'></i>";
                }
              }
            }),
      },{
            name: "port_available", // The key of the model attribute
            label: "Available", // The name to display in the header
            editable: false,
            cell: "boolean"
        },{
            name: "series", // The key of the model attribute
            label: "Series", // The name to display in the header
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
        onClick: function (e) {
          this.$el.parent().find('.selected').removeClass('selected');
          this.$el.toggleClass('selected');
          
          e.stopPropagation();
          Backbone.trigger("deployrowclicked", this.model);
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
        collection: self.collection,
        row: ClickableRow
      });

      // Render the grid and attach the root to your HTML document
      $ss.append(pageableGrid.render().el);

      // Initialize the paginator
      var paginator = new Backgrid.Extension.Paginator({
        collection: self.collection
      });

      // Render the paginator
      $ss.after(paginator.render().el);

      // Initialize a client-side filter to filter on the client
      // mode pageable collection's cache.
      //extend to match the nested object parameters 
      var AssetFilter = Backgrid.Extension.ClientSideFilter.extend({
        //collection: pageabledeploy,
        //fields: ["assetId",'@class'],
        placeholder: "Search",
        makeMatcher: function(query){
           return function (model) {
              if(model.attributes['class']){
                if(String(model.attributes['class']).toUpperCase().search(this.value.toUpperCase())>-1){
                    return true;
                }
                else{
                  return false;
                }
              }
              else{
                return false;
              }
          }; 
        }
      });

      var filter = new AssetFilter({
        collection: self.collection
      });
      self.filter = filter;

       // total
      $ss.append( "<p>Total: "+this.collection.fullCollection.length+"</p>" );
      
      $ss.before(filter.render().el);
      // Add some space to the filter and move it to the right
      //$(filter.el).css({float: "right", margin: "20px"});
      $(filter.el).find("input").attr('id', 'plat_ports_search_box');
  }
});
