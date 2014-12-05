function enablePlotting(){
    $('.bottom-div').show();
}


function disablePlotting(){
    $('.bottom-div').hide();
    //$( "#plotting" ).empty();     
}

function updateData(array,platform,instrument){
    //console.log("updateData");
    enablePlotting();
    $( '#plotting' ).hide();
    $( "#plotting" ).empty();  
    //get list of selected getSelectedVariables

    vars = getSelectedVariables();  
    if (vars.length > 0){       
        $('#processing-icon').show();
        getData(array,platform,instrument,$('#stream-select option:selected').text(), vars);
    }else{
        $('#plotting').show();
        $('#processing-icon').hide();
    }

}

function getTimeCoverage(array,platform,instrument) {    
    var instrument = $( "#currentInstrument" ).text();      
    var stream = $('#stream-select option:selected').text();

    instrument = instrument.replace(/-/g, '_');
    var url = "/get_time_coverage/" + instrument + "/" + stream;
    console.log("Attempting", url);


    $.getJSON(url, function( data ) {  
        var end_date = new Date(data['time_coverage_end']);
        var start_date = new Date(data['time_coverage_end']);
        start_date = start_date.setDate(start_date.getDate() - 14);

        $('#datetimepicker_from').data("DateTimePicker").setDate(new Date(start_date))
        $('#datetimepicker_to').data("DateTimePicker").setDate(new Date(end_date))
    });

}

var getDataXHR = null;

function getData(array,platform,instrument,stream,variables){
    //get the from date
    from_dt = ($('#datetimepicker_from').data("DateTimePicker").getDate().toISOString());
    to_dt   = ($('#datetimepicker_to').data("DateTimePicker").getDate().toISOString()); 

    variables = variables.join()

    url  = "/getdata/?"
    url += "dataset_id="+instrument + '_' + stream
    url += "&startdate="+from_dt
    url += "&enddate="+to_dt
    url += "&variables="+variables

    console.log(url)
    if(getDataXHR != null) {
        console.log("Aborting other XHR request");
        getDataXHR.abort();
        getDataXHR = null;
    }

    getDataXHR = $.ajax({       
        type: 'GET',
        url: url,  
        dataType: 'json',
        contentType: "application/json; charset=utf-8"
    })
    .success(function(data){
        $('#plotting').show();
        $('#processing-icon').hide();
        makePlot(array,platform,instrument,variables,data);
    })
    .error(function(xhr, status, error) {
        //var err = eval("(" + xhr.responseText + ")");
        console.log( "error:",error );
        $('#plotting').show();
        $('#processing-icon').hide();
    });
}

function getRowData(rows){

}

function makePlot(array,platform,instrument,variable,dataObj){
    console.log("DATA:",dataObj)
    var_list = dataObj['fields']
    data = dataObj['data']
    units = dataObj['units']

    spacing = 65

    var margin = {top: 20, right: 20, bottom: 30, left: (var_list.length*spacing)},
    width = 800 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%d-%b-%y").parse;

    yScaleList = []
    yAxisList = []
    for (var i = 0; i < var_list.length; i++) {
        var y = d3.scale.linear().range([height, 0]);
        y.domain(d3.extent(data, function(d) { return d[var_list[i]][2]; }));
        var yAxis = d3.svg.axis().scale(y).orient("left");

        yScaleList.push(y)
        yAxisList.push(yAxis)
    };
    
    var x = d3.time.scale().range([0, width]);
    x.domain(d3.extent(data, function(d) { 
        d = d['time']
        return new Date(d);
    }));

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");      

    var svg = d3.select("#plotting").append("svg")
        .attr("id","plotview")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    baseY = 3
    var p=d3.scale.category10();
    var colorVals=p.range();
    for (var i = 0; i < var_list.length; i++) {
        svg.append("g")
        .attr("class", "y axis")        
        .attr("transform", "translate("+(baseY-(i*spacing))+",0)")   //move the axis along a bit....
        .style("fill", function (d) { return colorVals[i];})         
        .style("stroke", function (d) { return colorVals[i];})     
        .attr("data-legend",function() { return var_list[i]})
        .call(yAxisList[i])       
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", baseY)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(units[i]);
    }
    

    dataLines = svg.selectAll("line").data(data).enter()
    dataCircles = svg.selectAll("circle").data(data).enter()    
    
    for (var i = 0; i < var_list.length; i++) {
       
        /*
        dataLines.append("line")
            .attr("y1", function(d, i) { return y(d[1]) })
            .attr("x1", function(d, i) { return x(new Date(d[0])); })
            .attr("y2", function(d, i) { return y(d[3]) })
            .attr("x2", function(d, i) { return x(new Date(d[0])); })               
            .attr("class","dataline");
        */

        dataCircles.append("circle")
            .attr("cy", function(d) {   
                d = d[var_list[i]]             
                return yScaleList[i](d[1])
            })
            .attr("cx", function(d) {                
                d = (d['time']).toString();                
                return x(new Date(d)); 
            })
            .attr("r", function(d) { return 3 })   
            .attr("class", "datacircle")   
            .style("fill",function (d) { 
                return colorVals[i]; 
            });     
            
    };   

    legend = svg.append("g")
        .attr("class","legend")
        .attr("transform","translate(50,30)")
        .style("font-size","12px")
        .call(d3.legend) 

}
