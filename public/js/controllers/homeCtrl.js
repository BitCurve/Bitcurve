var app = angular.module('bitcurve');

app.controller('homeCtrl', function($scope, homeService) { 

// LANDING PAGE D3 CHART
//Defining the canvas parameters and an empty array nodes
var w = 1500, 
    h = 500,
    c = "d3Home",
    nodes = [],
    links = [];

//Creating canvas and appending svg
var canvas = d3.select(".artExample").append("svg")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("class", c);

//Color function
var fill = d3.scale.category20();

//Using force directed graph with its methods
var force = d3.layout.force() //initiate force
    .nodes(nodes)
    .links([]) 
    .size([w, h]);
	// console.log(force);

	//Registers the specified listener to receive events of the specified type from the force layout; pulls all the symbols together
	force.on("tick", function(d) {
	  canvas.selectAll("path")
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	});

//Interval between symbol type creation
setInterval(function(){

  // Create and Add a new random shape and push it to an empty array
  	nodes.push({
	    type: d3.svg.symbolTypes[~~(Math.random() * d3.svg.symbolTypes.length)], //pushing symbol types
	    size: Math.random() * 300 + 100 //size of the symbol

  });

  



  //Starts the simulation. Assigned only after nodes and links specified. 
  force.start();

  //SelectAll function
  canvas.selectAll("path")
    .data(nodes)
  	.enter().append("path")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("d", d3.svg.symbol()
        .size(function(d) { return d.size; })
        .type(function(d) { return d.type; }))
        .style("fill", function(d, i) { return fill(i); })
        .style("stroke", function(d, i) { return fill(i); })
        .style("stroke-width", "1.5px")
        .call(force.drag);

}, 500); //define interval time


force.stop();

	
});	// End app.controller