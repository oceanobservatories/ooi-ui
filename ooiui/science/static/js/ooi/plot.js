function enablePlotting(){
	$('.bottom-div').show();
}


function disablePlotting(){
	$('.bottom-div').hide();
	//$( "#plotting" ).empty();     
}

function updateData(array,platform,instrument){
	enablePlotting();

	$( "#plotting" ).empty();                        
    //$( "#plotting" ).append( '<div id="axis0"></div> <div id="chart"></div>' );
    getData(array,platform,instrument,$( "#variable-select option:selected").attr("value"));
}

function getData(array,platform,instrument,variable){
	//get the from date
	from_dt = ($('#datetimepicker_from').data("DateTimePicker").getDate().toISOString());
	to_dt   = ($('#datetimepicker_to').data("DateTimePicker").getDate().toISOString());	

	url  = "http://localhost:5000/getdata/?"
	url += "dataset_id="+instrument
	url += "&startdate="+from_dt
	url += "&enddate="+to_dt
	url += "&variables="+variable

	console.log(url)

	/*
	data = [
			['2001-03-14T01:03:14Z', 4],
			['2001-04-14T02:05:14Z', 1],
			['2001-05-14T03:06:14Z', 2],
			['2001-06-14T04:08:14Z', 6],
			['2001-07-14T05:09:14Z', 1]
			]
	*/

	$.ajax({
		type: 'GET',
        url: url,  
        dataType: 'json',
        contentType: "application/json; charset=utf-8"
    })
    .success(function(data){
    	makePlot(array,platform,instrument,variable,data);
    })
	.error(function(xhr, status, error) {
		//var err = eval("(" + xhr.responseText + ")");
    	console.log( "error:",error );
    });
}

function getRowData(rows){

}

function makePlot(array,platform,instrument,variable,data){

	rowdata = data["rows"]

	var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%d-%b-%y").parse;

	var x = d3.time.scale()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var line = d3.svg.line()
	    .x(function(d) { return x(new Date(d[0])); })
	    .y(function(d) { return y(d[1]); });

	var svg = d3.select("#plotting").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	x.domain(d3.extent(rowdata, function(d) { return new Date(d[0]);}));
	y.domain(d3.extent(rowdata, function(d) { return d[1]; }));

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)	      
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Data");

	  svg.append("path")
	      .datum(rowdata)
	      .attr("class", "line")
	      .attr("d", line);

}