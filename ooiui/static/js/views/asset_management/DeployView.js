var DeployView = Backbone.View.extend({

	initialize: function() {
		_.bindAll(this,"render");
		this.render();
	},
	//renders a simple map view
	render: function() {
    this.arrays = new ArrayCollection();

    var columns = [{
        name: "id", // The key of the model attribute
        label: "ID", // The name to display in the header
        editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
        // Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
        cell: Backgrid.IntegerCell.extend({
            orderSeparator: ''
        })
    }, {
        name: "array_name",
        label: "Name",
        // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
        cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
    }, {
        name: "array_code",
        label: "Code",
        cell: "string" // An integer cell is a number cell that displays humanized integers
    }, {
        name: "description",
        label: "Description",
        cell: "string" // A cell type for floating point value, defaults to have a precision 2 decimal numbers
    }, {
        name: "display_name",
        label: "Display Name",
        cell: "string"
    }];

    // Initialize a new Grid instance
    var grid = new Backgrid.Grid({
        columns: columns,
        collection: this.arrays
    });

    // Render the grid and attach the root to your HTML document
    $("#datatable").append(grid.render().el);

    // Fetch some countries from the url
    this.arrays.fetch({reset: true});
		}
	
	//end
});