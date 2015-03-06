var AssetView = Backbone.View.extend({

	initialize: function() {
		_.bindAll(this,"render");
		this.render();
	},
	//renders a simple map view
	render: function() {
        
        var self = this;
        //add map
        var map = L.map('editdep_map').setView([1.505, 1.09], 2);
        L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }).addTo(map);
        // add an OpenStreetMap tile layer
        L.tileLayer('http://{s}.tile.stamen.com/toner-hybrid/{z}/{x}/{y}.png', {
        }).addTo(map);

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
            return response.assets[0];
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
            name: "@class",
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
               if(self.query_filter){
                
               }
               return function (model) {
                  if(q == ''){
                    return true;
                  }
                  else if(model.attributes['assetInfo']['description']){
                    if(String(model.attributes['assetInfo']['description']).toUpperCase().search(q)>-1){
                        return true;
                    }
                  }
                  else if(model.attributes['assetInfo']['type']){
                    if(String(model.attributes['assetInfo']['type']).toUpperCase().search(q)>-1){
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

        // Fetch some instruments from the url
        pageabledeploy.fetch({reset: true,
            error: (function (e) {
                $('#asset_top_panel').html('There was an error with the Asset list.');
                $('#editdep_panel').html('There was an error with the Asset list.');
                alert(' Service request failure: ' + e);
            }),
            complete: (function (e) {
                $('#number_of_assets').html(e.responseJSON['assets'][0].length+' total records');
                $('#asset_top_panel').html('Click on an Asset to Edit');
                $('#editdep_panel').html('Click on an Asset above to Edit');

                //need to add assets to the filtrify component
                for ( t = 0; t < e.responseJSON['assets'][0].length; t++ ) {
                    $('#container_of_data').append("<li data-Type='"+e.responseJSON['assets'][0][t].assetInfo['type']+"' data-Class='"+e.responseJSON['assets'][0][t]['@class']+"' data-Owner='"+e.responseJSON['assets'][0][t].assetInfo['owner']+"'><span>Type: <i>"+e.responseJSON['assets'][0][t].assetInfo['type']+"</i></span><span>Class: <i>"+e.responseJSON['assets'][0][t]['@class']+"</i></span><span>Owner: <i>"+e.responseJSON['assets'][0][t].assetInfo['owner']+"</span></li>");
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
            //$('#editdep_panel').hide();
            $('#editdep_form').show();
            $('#editdep_map').show();
            map.invalidateSize();
            selectedInstrument = model.attributes;

            $('#depth_d').val(model.attributes.depth);
            $('#name_d').val(model.attributes.display_name);
            //$('#startdate_d').val(model.attributes.start_date);
            //$('#enddate_d').val(model.attributes.end_date);
            $( "#startdate_d" ).datepicker( "setDate", "10/12/2013" );
            $( "#enddate_d" ).datepicker( "setDate", "10/12/2014" );
            $('#platform_d').val(model.attributes.platform_deployment_id);

            if(model.attributes.geo_location != null){
                if(model.attributes.geo_location.type == "Point"){
                    //[x,y]
                    $('#geo_d_lat').val(model.attributes.geo_location.coordinates[1]);
                    $('#geo_d_long').val(model.attributes.geo_location.coordinates[0]);

                    // add a marker in the given location, attach some popup content to it and open the popup
                    L.marker([model.attributes.geo_location.coordinates[1], model.attributes.geo_location.coordinates[0]]).addTo(map)
                        .bindPopup(String(model.attributes))
                        .openPopup();
                }
            }
        });

        //on button bar click
        $('#deploy_edit').click(function(t) {
            var deploy_obj_ = {};

            if(t.target.innerText == 'NEW'){
                self.clearform();
                selectedInstrument = [];
                $('#editdep_form').show();
                $('#editdep_panel').html('Click Save to create new Record.');
            }
            else if(t.target.innerText == 'SAVE'){
                //save to db 
                if (self.model.isValid()) {
                    $('#editdep_panel').html('<i class="fa fa-spinner fa-spin"></i>  Saving.');
                   // that.model.attributes = selectedInstrument;
                    self.model.set('start_date',$( "#startdate_d" ).datepicker('getDate' ));
                    self.model.set('end_date',$( "#enddate_d" ).datepicker('getDate' ));
                    self.model.set('display_name', $('#name_d').val());
                    self.model.set('depth',Number($('#depth_d').val()));
                    self.model.set('platform_deployment_id',Number($('#platform_d').val()));
                    var geoObj = {};
                    var coord = [Number($('#geo_d_long').val()),Number($('#geo_d_lat').val())];
                    geoObj['coordinates']=coord;
                    geoObj['type'] = "Point";
                    self.model.set('geo_location',wellknown.stringify(geoObj));

                    //existing?
                    if(selectedInstrument['id']){
                        self.model.set('id',selectedInstrument['id']);                    
                    }
                    if($('#platform_d').val() != '' && $('#name_d').val() != ''){
                        self.model.save(null, {
                          success: function(model, response) {
                            self.modalDialog.show({
                              message: "Asset successfully saved.",
                              type: "success",
                              ack: function() { 
                                window.location = "/assets/list/"
                              }
                            });
                            $('#editdep_panel').html('Saved Successfully.');
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
                        $('#editdep_panel').html('Platform ID and Display Name are Required.');
                    }
                }
            }
            else if(t.target.innerText == 'DELETE'){
                //delete from db 
                //selectedInstrument
                if(selectedInstrument['id']){

                    $('#editdep_panel').html('<i class="fa fa-spinner fa-spin"></i>  Deleting.');
                    self.model.set('id',selectedInstrument['id']);                    

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
        
        //change lat/long inputs
        $("#coordinate_switcher li a").click(function(){
          $(".btn:first-child").html($(this).text()+'  <span class="caret"> </span>');
          $(".btn:first-child").val($(this).text());
       });
    },

    clearform: function(){
        $('#depth_d').val('');
        $('#name_d').val('');
        $('#startdate_d').val('');
        $('#enddate_d').val('');
        $('#platform_d').val('');
        $('#geo_d_lat').val('');
        $('#geo_d_long').val('');
    },

    ConvertDDToDMS: function (dd)
    {
        var deg = dd | 0; // truncate dd to get degrees
        var frac = Math.abs(dd - deg); // get fractional part
        var min = (frac * 60) | 0; // multiply fraction by 60 and truncate
        var sec = frac * 3600 - min * 60;
        return deg + "d " + min + "' " + sec + "\"";
    }
});