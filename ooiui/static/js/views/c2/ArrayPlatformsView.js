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

var ArrayPlatformsView = Backbone.View.extend({
  // The el will be a <ul> tag
  tagName: 'div',
  // <ul class="nav sidebar-nav navbar-collapse">
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
  selectPlatform: function(array_id) {
  },

  //template: JST['ooiui/static/js/partials/ArraySideBar.html'],

  render: function() {
    var self = this;

    var $ss = $("#datatable");

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
            name: "display_name", // The key of the model attribute
            label: " Platform Name", // The name to display in the header
            editable: false,
            cell: "string"
        }, {
            name: "operational_status",
            label: "Status",
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
      },
      {
          name: "operational_status",
          label: "Commands",
          editable: false,
          cell: HtmlCell,
          formatter: _.extend({}, Backgrid.Cell.prototype, {
            fromRaw: function (rawValue, model) {
               return "<button type='button' style='float:right' id='plat_mission_icon' class='btn btn-default'><i style='font-size:19px;color:#A9A9A9;float:right;pointer-events: none;' class='fa fa-toggle-off'></i></button>";
            }
          }),
      }
      ];

      //add click event
      var ClickableRow = Backgrid.Row.extend({
        highlightColor: "#eee",
        events: {
          "click": "onClick",
          mouseover: "rowFocused",
          mouseout: "rowLostFocus"
        },
        onClick: function (e) {
          e.stopPropagation();
          Backbone.trigger("deployrowclicked", this.model);
          this.$el.parent().find('.selected').removeClass('selected');
          this.$el.toggleClass('selected');

          if(e.target.id == "plat_mission_icon"){
              //command trigger
              this.CommandView = new CommandDialogView();
              $('.container-fluid').first().append(this.CommandView.el);

              this.CommandView.show({
                message: "<i>None at this time</i>",
                parameter_options: "",
                command_options: "<i style='color:#337ab7;margin-left:20px' class='fa fa-spinner fa-spin fa-3x'></i>",
                variable: this.model.attributes.reference_designator,
                title: this.model.attributes.display_name,
                ctype: "platform",
                ack: function() { console.log("Closed"); }
              });
              $('.modal-title').html("<b>"+this.model.attributes.display_name);              
          }
          else{
              //clear other panels
              self.clearallc2panels();

              $('#current_platform_bc').remove();
              $('#current_instrument_bc').remove();
              $('#c2breakcrumb').append('<li id="current_platform_bc"><a><b>Platform:</b> '+this.model.attributes.display_name+'</a></li>');
              
              $('#accordionP').find('.panel-body').html('<i style="color:#337ab7;" class="fa fa-spinner fa-spin fa-5x"></i>');

              //load instruments
              ///api/c2/platform/'+this.model.attributes.reference_designator+'/current_status_display
              var PlatformInstrumentCollection = Backbone.PageableCollection.extend({
                url: '/api/c2/platform/'+this.model.attributes.reference_designator+'/current_status_display',
                state: {
                  pageSize: 10
                },
                mode: "client",
                parse: function(response, options) {
                  this.trigger("pageabledeploy:updated", { count : response.count, total : response.total, startAt : response.startAt } );
                  return response.current_status_display;
                }
              });

              var pageableInstrumentList = new PlatformInstrumentCollection();
              //Platform Panel
              pageableInstrumentList.fetch({reset: true,
                success: function(collection, response, options) {
                    $('#collapseOneP').find('.panel-body').html("<div id='datatableI'></div>");
                    self.platformInstrumentsView = new PlatformInstrumentsView({
                    collection: collection
                  });
                },
                error:function(collection, response, options) {
                    var m = new ModalDialogView();
                    m.show({
                      message: "Error Getting Data",
                      type: "danger",
                    });
                }
              });

              //load ports
              ///api/c2/platform/'+this.model.attributes.reference_designator+'/ports_display
              var PlatformPortsCollection = Backbone.PageableCollection.extend({
                url: '/api/c2/platform/'+this.model.attributes.reference_designator+'/ports_display',
                state: {
                  pageSize: 10
                },
                mode: "client",
                parse: function(response, options) {
                  this.trigger("pageabledeploy:updated", { count : response.count, total : response.total, startAt : response.startAt } );
                  return response.ports_display;
                }
              });

              var pageablePortsList = new PlatformPortsCollection();
              pageablePortsList.fetch({reset: true,
                success: function(collection, response, options) {
                    $('#collapseTwoP').find('.panel-body').html("<div id='datatablePports'></div>");
                    self.platformPortsView = new PlatformPortsView({
                    collection: collection
                  });
                },
                error:function(collection, response, options) {
                    var m = new ModalDialogView();
                    m.show({
                      message: "Error Getting Data",
                      type: "danger",
                    });
                }
              });

              //History Panel
              var Platformhistoryist = new ArrayDataModel();
              Platformhistoryist.url='/api/c2/platform/'+this.model.attributes.reference_designator+'/history';

              Platformhistoryist.fetch({
                success: function(collection, response, options) {
                  $('#collapseFourP').find('.panel-body').html("<div id='platform_history_tree' class='history_tree'></div>");
                  self.platformHistoryView = new PlatformHistoryView({
                    collection: response.history
                  });
                },
                error:function(collection, response, options) {
                  var m = new ModalDialogView();
                    m.show({
                      message: "Error Getting Data",
                      type: "danger",
                    });
                }
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
        placeholder: "Search",
        makeMatcher: function(query){
           return function (model) {
              if(model.attributes['display_name']){
                if(String(model.attributes['display_name']).toUpperCase().search(this.value.toUpperCase())>-1){
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

      //total count
      $ss.append( "<p>Total: "+this.collection.fullCollection.length+"</p>" );

      // Render the filter
      $ss.before(filter.render().el);
      // Add some space to the filter and move it to the right
      //$(filter.el).css({float: "right", margin: "20px"});
      $(filter.el).find("input").attr('id', 'plat_search_box');
  },

  clearallc2panels: function(){
    //Platform panels:
    $('#accordionP').find('.panel-body').empty();
    //Instrument panels:
    $('#accordionI').find('.panel-body').empty();
  }
});
