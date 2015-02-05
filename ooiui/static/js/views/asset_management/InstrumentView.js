var InstrumentView = Backbone.View.extend({

	initialize: function() {
		_.bindAll(this,"render");
		this.render();
	},
	//renders a simple map view
	render: function() {
        
        var that = this;
        var selectedInstrument = [];

        var PageableDeployments = Backbone.PageableCollection.extend({
          model: InstrumentDeploymentModel,
          url: '/api/instrument_deployment',
          state: {
            pageSize: 7
          },
          mode: "client",
          parse: function(response, options) {
            return response.instrument_deployments;
          } // page entirely on the client side  options: infinite, server
        });

        var pageabledeploy = new PageableDeployments();

        var columns = [{
            name: "id", // The key of the model attribute
            label: "ID", // The name to display in the header
            editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
            // Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
            cell: Backgrid.IntegerCell.extend({
                orderSeparator: ''
            })
        }, {
            name: "platform_deployment_id",
            label: "Platform ID",
            editable: false,
            cell: "string" // An integer cell is a number cell that displays humanized integers
        }, {
            name: "display_name",
            label: "Name",
            editable: false,
            // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
            cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
        }, {
            name: "depth",
            label: "Depth",
            editable: false,
            cell: "string" 
        }, {
            name: "start_date",
            label: "Start Date",
            editable: false,
            cell: "string"// DatetimeCell
        }, {
            name: "end_date",
            editable: false,
            label: "End Date",
            cell: "string"// DatetimeCell
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
        $("#datatable").append(pageableGrid.render().el);
        // Initialize the paginator
        var paginator = new Backgrid.Extension.Paginator({
          collection: pageabledeploy
        });

        // Render the paginator
        $("#datatable").after(paginator.render().el);

        // Initialize a client-side filter to filter on the client
        // mode pageable collection's cache.
        var filter = new Backgrid.Extension.ClientSideFilter({
          collection: pageabledeploy,
          fields: ['display_name','platform_deployment_id']
        });

        // Render the filter
        $("#datatable").before(filter.render().el);
        // Add some space to the filter and move it to the right
        $(filter.el).css({float: "right", margin: "20px"});


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
        Backbone.on("deployrowclicked", function (model) {
            //$('#editdep_panel').hide();
            $('#editdep_form').show();

            selectedInstrument = model.attributes;

            $('#depth_d').val(model.attributes.depth);
            $('#name_d').val(model.attributes.display_name);
            $('#startdate_d').val(model.attributes.start_date);
            $('#enddate_d').val(model.attributes.end_date);
            $('#platform_d').val(model.attributes.platform_deployment_id);
            $('#geo_d').val(model.attributes.geo_location);
        });

        $('#deploy_edit').click(function(t) {
            if(t.target.innerText == 'NEW'){
                that.clearform();
                $('#editdep_panel').html('Click Save to create new Record.');
            }
            else if(t.target.innerText == 'SAVE'){
                //save to db 
                //selectedInstrument
                //$('#editdep_panel').html('<i class="fa fa-spinner fa-spin"></i>  Saving.');
                $('#editdep_panel').html('Saved Successfully.');
            }
            else if(t.target.innerText == 'DELETE'){
                //delete from db 
                //selectedInstrument
                that.clearform();
                $('#editdep_panel').html('Click on an Instrument to Edit');
            }
        });
    },

    clearform: function(){
        $('#depth_d').val('');
        $('#name_d').val('');
        $('#startdate_d').val('');
        $('#enddate_d').val('');
        $('#platform_d').val('');
        $('#geo_d').val('');
    }
});