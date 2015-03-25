var ArrayAbstractView = Backbone.View.extend({

	initialize: function() {
		_.bindAll(this,"render");
		this.render();
	},
	//renders a simple map view
	render: function() {

        var self = this;
        var selectedInstrument = [];
        //bind
        self.model = new ArrayAbstractModel();
        self.modalDialog = new ModalDialogView();

        var PageableDeployments = Backbone.PageableCollection.extend({
          model: ArrayAbstractModel,
          url: '/api/c2/array/' + self.model.get('reference_designator') + '/abstract',
          state: {
            pageSize: 7
          },
          mode: "client",
          parse: function(response, options) {
            return response.abstract;
          } // page entirely on the client side  options: infinite, server
        });

        var pageabledeploy = new PageableDeployments();

        //    "display_name": "Coastal Pioneer Central Surface Mooring",
        //"operational_status": "Online",
        //"platform_deployment_id": 86,
        //"reference_designator": "CP01CNSM"

        var columns = [
          {
            name: "array_id", // The key of the model attribute
            label: "Array ID", // The name to display in the header
            editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
            // Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
            cell: Backgrid.IntegerCell.extend({
                orderSeparator: ''
            })
        },
        {
            name: "display_name",
            label: "Display Name",
            editable: false,
            // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
            cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
        },
        {
            name: "operational_status",
            label: "Operational Status",
            editable: false,
            // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
            cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
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
          columns: [{
            // enable the select-all extension
            name: "",
            cell: "select-row",
            headerCell: "select-all"
          }].concat(columns),
          collection: pageabledeploy,
          row: ClickableRow
        });

        // Render the grid and attach the root to your HTML document
        $("#abstract").append(pageableGrid.render().el);
        // Initialize the paginator
        var paginator = new Backgrid.Extension.Paginator({
          collection: pageabledeploy
        });

        // Render the paginator
        $("#abstract").after(paginator.render().el);

        // Initialize a client-side filter to filter on the client
        // mode pageable collection's cache.
        var filter = new Backgrid.Extension.ClientSideFilter({
          collection: pageabledeploy,
          fields: ['display_name_d','operational_status_d']
        });

        // Render the filter
        $("#abstract").before(filter.render().el);
        // Add some space to the filter and move it to the right
        $(filter.el).css({float: "right", margin: "20px"});

        //datepickers with min/max validation
        //$( "#startdate_d" ).datepicker({
        //  changeMonth: true,
        //  numberOfMonths: 2,
        //  maxDate: "+1m +1w",
        //  onClose: function( selectedDate ) {
        //    $( "#enddate_d" ).datepicker( "option", "minDate", selectedDate );
        //  }
        //});
        //$( "#enddate_d" ).datepicker({
        //  changeMonth: true,
        //  numberOfMonths: 2,
        //  maxDate: "+1m +1w",
        //  onClose: function( selectedDate ) {
        //    $( "#startdate_d" ).datepicker( "option", "maxDate", selectedDate );
        //  }
        //});

        // Fetch some instruments from the url
        pageabledeploy.fetch({reset: true,
            error: (function (e) {
                $('#editdep_panel').html('There was an error with the Deployment list.');
                alert(' Service request failure: ' + e);
            }),
            complete: (function (e) {
                $('#editdep_panel').html('Click on an Instrument to Edit');
            })
        });
        //probably for post responses submit data
        /*data: {
            name: 'Bob',
            userid: '1',
            usertype: 'new'
        }*/

        //move clicked row to edit panel
        //Backbone.on("deployrowclicked", function (model) {
        //    //$('#editdep_panel').hide();
        //    $('#editdep_form').show();
        //
        //    selectedInstrument = model.attributes;
        //
        //    //$('#depth_d').val(model.attributes.depth);
        //    //$('#name_d').val(model.attributes.display_name);
        //    //$('#startdate_d').val(model.attributes.start_date);
        //    //$('#enddate_d').val(model.attributes.end_date);
        //    //$( "#startdate_d" ).datepicker( "setDate", "10/12/2013" );
        //    //$( "#enddate_d" ).datepicker( "setDate", "10/12/2014" );
        //    $('#display_name_d').val(model.attributes.display_name);
        //  $('#operational_status_d').val(model.attributes.operational_status);
        //
        //    //if(model.attributes.geo_location != null){
        //    //    if(model.attributes.geo_location.type == "Point"){
        //    //        //[x,y]
        //    //        $('#geo_d_lat').val(model.attributes.geo_location.coordinates[1]);
        //    //        $('#geo_d_long').val(model.attributes.geo_location.coordinates[0]);
        //    //    }
        //    //}
        //});
        $('#array_list').click(function(t) {
          if(t.target.innerText == 'COASTAL ENDURANCE'){
            pageabledeploy.fetch({
              reset: true,
              url: '/api/c2/array/CE/abstract'
            });
            //self.modalDialog.show({
            //  message: pageabledeploy.url,
            //  type: "danger"
            //});
          }
          if(t.target.innerText == 'COASTAL PIONEER'){
            pageabledeploy.fetch({
              reset: true,
              url: '/api/c2/array/CP/abstract'
            });
            //self.modalDialog.show({
            //  message: pageabledeploy.url,
            //  type: "danger"
            //});
          }
        });
        //on button bar click
        //$('#deploy_edit').click(function(t) {
        //    var deploy_obj_ = {};
        //
        //    if(t.target.innerText == 'NEW'){
        //        self.clearform();
        //        selectedInstrument = [];
        //        $('#editdep_form').show();
        //        $('#editdep_panel').html('Click Save to create new Record.');
        //    }
        //    else if(t.target.innerText == 'SAVE'){
        //        //save to db
        //        if (self.model.isValid()) {
        //            $('#editdep_panel').html('<i class="fa fa-spinner fa-spin"></i>  Saving.');
        //           // that.model.attributes = selectedInstrument;
        //            self.model.set('start_date',$( "#startdate_d" ).datepicker('getDate' ));
        //            self.model.set('end_date',$( "#enddate_d" ).datepicker('getDate' ));
        //            self.model.set('display_name', $('#name_d').val());
        //            self.model.set('depth',Number($('#depth_d').val()));
        //            self.model.set('platform_deployment_id',Number($('#platform_d').val()));
        //            var geoObj = {};
        //            var coord = [Number($('#geo_d_long').val()),Number($('#geo_d_lat').val())];
        //            geoObj['coordinates']=coord;
        //            geoObj['type'] = "Point";
        //            self.model.set('geo_location',wellknown.stringify(geoObj));
        //
        //            //existing?
        //            if(selectedInstrument['id']){
        //                self.model.set('id',selectedInstrument['id']);
        //            }
        //            if($('#platform_d').val() != '' && $('#name_d').val() != ''){
        //                self.model.save(null, {
        //                  success: function(model, response) {
        //                    self.modalDialog.show({
        //                      message: "Deployment successfully saved.",
        //                      type: "success",
        //                      ack: function() {
        //                        window.location = "/assets/instruments/"
        //                      }
        //                    });
        //                    $('#editdep_panel').html('Saved Successfully.');
        //                  },
        //                  error: function(model, response) {
        //                    try {
        //                      var errMessage = JSON.parse(response.responseText).error;
        //                    } catch(err) {
        //                      console.log(err);
        //                      var errMessage = "Unable to Save Deployment";
        //                    }
        //                    self.modalDialog.show({
        //                      message: errMessage,
        //                      type: "danger",
        //                    });
        //                    console.log(model);
        //                    console.log(response.responseText);
        //                    $('#editdep_panel').html('Save Error.');
        //                  }
        //                });
        //
        //                //reset
        //                selectedInstrument = [];
        //                self.clearform();
        //            }
        //            else{
        //                $('#editdep_panel').html('Platform ID and Display Name are Required.');
        //            }
        //        }
        //    }
        //    else if(t.target.innerText == 'DELETE'){
        //        //delete from db
        //        //selectedInstrument
        //        if(selectedInstrument['id']){
        //
        //            $('#editdep_panel').html('<i class="fa fa-spinner fa-spin"></i>  Deleting.');
        //            self.model.set('id',selectedInstrument['id']);
        //
        //            self.model.destroy({
        //              success: function(model, response, options) {
        //                console.log("destroyed");
        //                self.modalDialog.show({
        //                  message: "Deployment successfully deleted.",
        //                  type: "success",
        //                  ack: function() {
        //                    window.location = "/assets/instruments/"
        //                  }
        //                });
        //                $('#editdep_panel').html('Deleted Successfully.');
        //              },
        //              error: function(model, response, options) {
        //                try {
        //                  var errMessage = JSON.parse(response.responseText).error;
        //                } catch(err) {
        //                  console.log(err);
        //                  var errMessage = "Unable to Delete Deployment";
        //                }
        //                self.modalDialog.show({
        //                  message: errMessage,
        //                  type: "danger",
        //                });
        //                console.log(model);
        //                console.log(response.responseText);
        //                $('#editdep_panel').html('Delete Error.');
        //              }
        //            });
        //
        //            //reset
        //            selectedInstrument = [];
        //            self.clearform();
        //        }
        //    }
        //});
    }
    //
    //clearform: function(){
    //    $('#depth_d').val('');
    //    $('#name_d').val('');
    //    $('#startdate_d').val('');
    //    $('#enddate_d').val('');
    //    $('#platform_d').val('');
    //    $('#geo_d_lat').val('');
    //    $('#geo_d_long').val('');
    //}
});
