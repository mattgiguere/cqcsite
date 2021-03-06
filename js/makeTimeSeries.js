
//Get the object name from the 'Object...' form input field:
var objectNm = '10700';
var param = 'mnvel';

function changeObject() {
    var objectNmElement = document.getElementById("objectNameInput");
    objectNm = objectNmElement.value;
    console.log('objectNm changed. The new objectNm is: ');
    console.log(objectNm);
    updateTimePlot('mnvel');
}

console.log(objectNm);

d3.select(window).on('resize', resize);

function resize() {
    var width = parseInt(d3.select(".d3").style('width'), 10) - margin.left - margin.right;
    makeInitTimeSeriesPlot()
}//end of resize()

/*     ***Begin D3 Global Variables***
These are used for both makeInitTimeSeriesPlot()
and updateTimePlot()
*/

// Set the dimensions of the canvas / graph
var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top:430, right: 10, bottom: 20, left:40},
    padding = {top:5, right:5, bottom:20, left: 20},
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

//make a responsize width:
var width = parseInt(d3.select(".d3").style('width'), 10) - margin.left - margin.right;


//calculate fractional padding:
var fpad = padding/100.

// Parse the date / time
//This is the line for the CSV
//var parseDate = d3.time.format("%d-%b-%y").parse;
//This is the line for data from the DB
var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%L").parse;

// Set the ranges
var xScale = d3.time.scale().range([0, width]);
var xScale2 = d3.time.scale().range([0, width]);
var yScale = d3.scale.linear().range([height, 0]);
var yScale2 = d3.scale.linear().range([height2, 0]);

//add tool-tip:
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<p><strong>Object:</strong> <span style='color:#428BCA'>" + d.objectnm + "</span></p>" +
            "<p><strong>Obnm:</strong> <span style='color:#428BCA'>" + d.obnm + "</span></p>" + 
            "<p><strong>RV:</strong> <span style='color:#428BCA'>" + d.ydata + "</span></p>" +
            "<p><strong>SNR:</strong> <span style='color:#428BCA'>" + Math.round(d.snr*10)/10 + "</span></p>";
  })

// Define the axes
var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(5);

var xAxis2 = d3.svg.axis()
                .scale(xScale2)
                .orient("bottom")
                .ticks(5);

var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(5);


var brush = d3.svg.brush()
    .x(xScale2)
    .on("brush", brushed);

var area = d3.svg.area()
    .interpolate("linear")
    .x(function(d) { return xScale(d.date); })
    .y0(height)
    .y1(function(d) { return yScale(d.ydata); })

var area2 = d3.svg.area()
    .interpolate("linear")
    .x(function(d) { return xScale2(d.date); })
    .y0(height2)
    .y1(function(d) { return yScale2(d.ydata); })

/*Add the svg canvas to the "d3" class div on the page.
The "d3" div is just a marker location so that I could
put the plot where I wanted it within the HTML.*/
var svg = d3.select(".d3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

svg.call(tip);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height)

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

//These groups are needed for update purposes:
var focuspathgrp = focus.append("g");
var focuscircgrp = focus.append("g");
var contextpathgrp = context.append("g");
var contextcircgrp = context.append("g");

//add observations to table:
var table = d3.select("#table-of-observations")
    .append('table')
    .attr("class", "table table-striped");

var thead = table.append("thead");
thead.append("th").text("Observation Name");
thead.append("th").text("Object Name");
thead.append("th").text("Date");
var newcolhead = thead.append("th").text('mnvel');

var tbody = table.append('tbody');

/* ***End D3 Global Variables*** */
function makeInitTimeSeriesPlot() {
    d3.json("php/getNewData.php?param=mnvel&tablenm=velocities&objectnm="+objectNm, function(error, data) {
        if (error) {
            console.log("There was an error loading the JSON blob.");
            console.log("The parameter passed to getNewData.php was:");
            console.log(param);
            console.log(error);
        } else {

            
            data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.ydata = +d.ydata;
            });
            
            //console.log("Now in d3.json...");

            // Scale the range of the data
            xScale.domain(d3.extent(data, function(d) { return d.date; }));
            yScale.domain([d3.min(data, function(d) { return d.ydata; }), 
                d3.max(data, function(d) { return d.ydata; })]);
            xScale2.domain(xScale.domain());
            yScale2.domain(yScale.domain());

            /*
            focuspathgrp.append("path")
                .datum(data)
                .attr("class", "area")
                .attr("d", area);
            */
            
            
            focuscircgrp.selectAll(".dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr('r', 3.5)
                .attr('cx', function(d) { return xScale(d.date); })
                .attr('cy', function(d) { return yScale(d.ydata); })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            var xAxisSVG = focus.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            //Add x-label:
            xAxisSVG.append("text")
                .attr("class", "x label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")            
                .text('Observation Date');

            var yAxisSVG = focus.append("g")
                .attr("class", "y axis")
                .call(yAxis);
            
            //Add y-label:
            yAxisSVG.append("text")
                .attr("class", "y label")
                .attr("transform", "rotate(-90)")
                .attr("x", -15)
                .attr("y", 6)
                .attr("dy", ".71em")
                //.attr("x", width)
                .style("text-anchor", "end")
                .text('mnvel');

            contextpathgrp.append("path")
                .datum(data)
                .attr("class", "area")
                .attr("d", area2);
            
            contextcircgrp.selectAll(".dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr('r', 3.5)
                .attr('cx', function(d) { return xScale2(d.date); })
                .attr('cy', function(d) { return yScale2(d.ydata); });

            context.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height2 + ")")
                .call(xAxis2);

            context.append("g")
                .attr("class", "x brush")
                .call(brush)
                .selectAll('rect')
                .attr("y", -6)
                .attr("height", height2 + 7);

            //create the rows that have all the 
            //data in __data__:
            var trs = tbody.selectAll('tr')
                .data(data)
                .enter()
                .append('tr');

            //Insert the columns:
            var tds = trs.selectAll('td')
                        .data(function(d) { return [d.obnm, d.objectnm, d.date, d3.round(d.ydata,2)];})
                        .enter()
                        .append('td')
                        .text(function(d) {return d;});


        }
    });

}

function brushed() {
    xScale.domain(brush.empty() ? xScale2.domain() : brush.extent());
    focus.select(".area").attr("d", area);
    focus.select(".x.axis").call(xAxis);
    focuscircgrp.selectAll(".dot")
        .attr("cx", function(d) { return xScale(d.date); })
        .attr("cy", function(d) { return yScale(d.ydata); });
}

function type(d) {
    d.date = parseDate(d.date);
    d.ydata = +d.ydata;
    return d;
}

function updateTimePlot(param) {
    var tblnm = determineTable(param);
    d3.json("php/getNewData.php?param="+param+"&tablenm="+tblnm+"&objectnm="+objectNm, function(error, data) {
        if (error) {
            console.log("There was an error loading the JSON blob.");
            console.log("The parameter passed to getNewData.php was:");
            console.log(param);
            console.log(error);
        } else {


            data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.ydata = +d.ydata;
            });

            // Scale the range of the data
            xScale.domain(d3.extent(data, function(d) { return d.date; }));
            yScale.domain([d3.min(data, function(d) { return d.ydata; }), 
                d3.max(data, function(d) { return d.ydata; })]);
            xScale2.domain(xScale.domain());
            yScale2.domain(yScale.domain());

            /*
            focuspathgrp.select('path')
                .remove()

            focuspathgrp.append("path")
                .datum(data)
                .attr("class", "area")
                .attr("d", area);
            */

            /*
            focuspathgrp.append("path")
                .datum(data)
                .attr("class", "area")
                .attr("d", area);
            */
            //focus.select(".area").attr("d", area);

            //Update all focus data points:
            focuscircgrp.selectAll(".dot")
                .data(data)
                .transition()
                .duration(1000)
                .attr('cx', function(d) { return xScale(d.date); })
                .attr('cy', function(d) { return yScale(d.ydata); })

            focuscircgrp.selectAll(".dot")
                .data(data)
                .exit()
                .remove();

            focuscircgrp.selectAll(".dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr('r', 3.5)
                .attr('cx', function(d) { return xScale(d.date); })
                .attr('cy', function(d) { return yScale(d.ydata); })
                .transition()
                .duration(1000);

            contextpathgrp.select("path")
                .remove()
            
            contextpathgrp
                .append('path')
                .datum(data)
                .attr("class", "area")
                .attr("d", area2);

            //Update all focus data points:
            contextcircgrp.selectAll(".dot")
                .data(data)
                .transition()
                .duration(1000)
                .attr('cx', function(d) { return xScale2(d.date); })
                .attr('cy', function(d) { return yScale2(d.ydata); })

            contextcircgrp.selectAll(".dot")
                .data(data)
                .exit()
                .remove();

            contextcircgrp.selectAll(".dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr('r', 3.5)
                .attr('cx', function(d) { return xScale2(d.date); })
                .attr('cy', function(d) { return yScale2(d.ydata); })
                .transition()
                .duration(1000);


            /*Now update the axes. */
            // Update the X Axis
            svg.select(".x.axis")
                .transition()
                .duration(1000)
                .call(xAxis);

            // Update the Y Axis
            svg.select(".y.axis")
                .transition()
                .duration(1000)
                .call(yAxis);

            //Update X Axis Label:
            svg.select(".y.label")
                .transition()
                .duration(1000)
                .text(param);

            //Add y-label:
            focus.select(".y.label")
                .attr("class", "y label")
                .attr("transform", "rotate(-90)")
                .attr("x", -15)
                .attr("y", 6)
                .attr("dy", ".71em")
                //.attr("x", width)
                .style("text-anchor", "end")
                .text('mnvel');

            /**************************************/
            /* ***** UPDATE TABLE AT BOTTOM ***** */
            /**************************************/

            //update the column header in the table:
            newcolhead
                .transition()
                .duration(1000)
                .text(param)

            //create the rows that have all the 
            //data in __data__:
            var trs = tbody.selectAll('tr')
                .data(data);

            trs.exit().remove();

            trs.enter().append('tr');

            //Update the columns:
            var tds = trs.selectAll('td')
                        .data(function(d) { return [d.obnm, d.objectnm, d.date, d3.round(d.ydata,2)];});

            //remove old columns:
            tds.exit().remove();

            //add new columns:
            tds.enter().append('td');

            tds.text(function(d) { return d;})

        }

    });
}

function addAxes() {
    /*Now add the axes. Adding them last makes them 
    on top of everything else. */
    // Add the X Axis
    var xAxisSVG = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - fpad*height) + ")")
        .call(xAxis);

    //Add x-label:
    xAxisSVG.append("text")
        .attr("class", "x label")
        .attr("x", (width - fpad*width))
        .attr("y", -6)
        .style("text-anchor", "end")            
        .text('Observation Date');


    // Add the Y Axis
    var yAxisSVG = svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + fpad*width + ",0)")
        .call(yAxis);

    //Add y-label:
    yAxisSVG.append("text")
        .attr("class", "y label")
        .attr("transform", "rotate(-90)")
        .attr("x", -15)
        .attr("y", 6)
        .attr("dy", ".71em")
        //.attr("x", width)
        .style("text-anchor", "end")
        .text('mnvel');

}
window.onload = makeInitTimeSeriesPlot();
