function enablePlotting(){
    $('.bottom-div').show();
}


function disablePlotting(){
    $('.bottom-div').hide();
    //$( "#plotting" ).empty();     
}

/*
sets if the app is processing, bool input
*/
function setProcessing(state){    
    if (state){
        //if its processind something show icons
        $('#refresh-plot-icon').show();
        $('#processing-icon').show();
    }else{
        $('#plotting').show();
        $('#refresh-plot-icon').hide();
        $('#processing-icon').hide();        
    }

}

function updateData(array,platform,instrument){
    //console.log("updateData");
    enablePlotting();
    $( '#plotting' ).hide();
    $( "#plotting" ).empty();  
    //get list of selected getSelectedVariables

    vars = getSelectedVariables();  
    if (vars.length > 0){       
        setProcessing(true);
        getData(array,platform,instrument,$('#stream-select option:selected').text(), vars);
    }else{
        setProcessing(false);
    }

}

function getTimeCoverage(array,platform_id,instrument_id) {    
    var instrument = $( "#currentInstrument" ).text();      
    var instrument_id = $( "#currentInstrument" ).attr("value")
    var stream = $('#stream-select option:selected').text();

    instrument_id = instrument_id.replace(/-/g, '_');
    var url = "/get_time_coverage/" + instrument_id + "/" + stream;
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
    //time average checked
    timeAverage = String($('#switch-time-average-check').is(':checked'));
    //time average value selected
    timeperiod = "1"

    variables = variables.join()

    url  = "/getdata/?"
    url += "dataset_id="+instrument + '_' + stream
    url += "&startdate="+from_dt
    url += "&enddate="+to_dt
    url += "&variables="+variables
    url += "&timeaverage=" + timeAverage
    url += "&timeperiod=" + timeperiod

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
        setProcessing(false)
        makePlot(array,platform,instrument,variables,data);
    })
    .error(function(xhr, status, error) {
        //var err = eval("(" + xhr.responseText + ")");
        console.log( "error:",error );
        setProcessing(false)
    });
}

function getRowData(rows){

}

function makePlot(array,platform,instrument,variable,dataObj){
    //console.log("DATA:",dataObj)
    var_list = dataObj['fields']
    data = dataObj['data']
    units = dataObj['units']

    spacing = 65

    var margin = {top: 20, right: 20, bottom: 30, left: (var_list.length*spacing)},
    width = 800 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%d-%b-%y").parse;

    timeAverageBool = $('#switch-time-average-check').is(':checked')

    if (timeAverageBool){
        /*

        IF THE PLOT IS TIME AVERAGED

        */
        yScaleList = []
        yAxisList = []
        for (var i = 0; i < var_list.length; i++) {
            var y = d3.scale.linear().range([height, 0]);
            extent = d3.extent(data, function(d) { return d[var_list[i]][2]; })                        
            y.domain(extent);
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

    }else{
        /*

        IF THE PLOT IS A NORMAL TIMESERIES

        */
        yScaleList = []
        yAxisList = []
        yVarName = []
        yUnitsName = []
        t_index = dataObj['timeidx']
        data_extents = dataObj['data_extents']
        for (var i = 0; i < var_list.length; i++) {
            //only if NOT time
            if (i!=t_index){
                variable_extents = data_extents[var_list[i]]
                var y = d3.scale.linear().range([height, 0]);
                //no need to do below as we have it from the server      
                d_extent = d3.extent(data, function(d) { return d[i]; })                                   
                y.domain(d_extent);
                var yAxis = d3.svg.axis().scale(y).orient("left");

                yScaleList.push(y)
                yAxisList.push(yAxis)

                yVarName.push(var_list[i])
                yUnitsName.push(units[i])
            }
        };
            
        //use the start date to create the x bounds
        st = new Date(dataObj['data_start_date']);
        ed = new Date(dataObj['data_end_date']);

        
        var x = d3.time.scale().range([0, width]);
        d_extent = []
        d_extent.push(st)
        d_extent.push(ed)
        x.domain(d_extent);

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
        for (var i = 0; i < yAxisList.length; i++) { 
            //only if NOT time                        
            svg.append("g")
            .attr("class", "y axis")        
            .attr("transform", "translate("+(baseY-(i*spacing))+",0)")   //move the axis along a bit....
            .style("fill", function (d) { return colorVals[i];})         
            .style("stroke", function (d) { return colorVals[i];})     
            .attr("data-legend",function() { return yVarName[i]})
            .call(yAxisList[i])       
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", baseY)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text(units[i]);
          
        };
        
        

        dataLines = svg.selectAll("line").data(data).enter()
        dataCircles = svg.selectAll("circle").data(data).enter()    

        var idx_count = 0;
        for (var i = 0; i < var_list.length; i++) {            
            if (i!=t_index){   

                              
                dataCircles.append("circle")
                    .attr("cy", function(d) {                               
                        return yScaleList[idx_count](d[i])
                    })
                    .attr("cx", function(d) {                            
                        return x(new Date(d[t_index])); 
                    })
                    .attr("r", function(d) { return 3 })   
                    .attr("class", "datacircle")   
                    .style("fill",function (d) { 
                        return colorVals[idx_count]; 
                    }); 
                
                /*
                var line = d3.svg.line()
                .x(function(d) { return x(new Date(d[t_index])); })
                .y(function(d) { return yScaleList[idx_count](d[i]); })

                dataLines.append("path")
                  .datum(data)
                  .attr("class", "line")
                  .attr("d", line)
                  .style("stroke",function (d) { 
                        return colorVals[idx_count]; 
                  }); 
                */
                idx_count+=1;
            };                               
        };  
        
    } 

    legend = svg.append("g")
        .attr("class","legend")
        .attr("transform","translate(50,30)")
        .style("font-size","12px")
        .call(d3.legend) 
}
