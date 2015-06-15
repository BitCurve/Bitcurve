(function() {

	angular.module('bitcurve.directives', [])

	.directive('bitcoinData', ['artDashboardService', function (artDashboardService){
		return {
			scope: {
				//data types being passed through from controller to directive
				finalData: '='
			},
			restrict: "EA",
			link: function(scope, element, attrs) {
				//create watcher to call updating function with different data type
					// $scope.$watch("", function() {

					// });

				//one data object

			/////////DEFINITION for CHART - start/////////
			//to instantiate D3
			var custom_bubble_chart = (function(d3, CustomTooltip) {
			  "use strict";

				//defining the variables 
				var width = 1400, //width
			      height = 400, //height
			      tooltip = CustomTooltip("gates_tooltip", 240), //tooltip
			      layout_gravity = -0.01, //gravity
			      damper = 0.1, 
			      nodes = [], //empty nodes
			      vis, force, circles, radius_scale, min_price, max_price, priceRange,lowPriceRange, avePriceRange; 

				//defining the center based on width and height
  				var center = {x: width / 2, y: height / 2}; 

				//defining the area for all the years when split
				var year_centers = {
			      "2009": {x: width / 8, y: height / 2},
			      "2010": {x: (width / 8) * 2, y: height / 2},
			      "2011": {x: (width / 8) * 3, y: height / 2},
			      "2012": {x: (width / 8) * 4, y: height / 2},
			      "2013": {x: (width / 8) * 5, y: height / 2},
			      "2014": {x: (width / 8) * 6, y: height / 2},
			      "2015": {x: (width / 8) * 7, y: height / 2}
			    };

			    //color definition 
				var fill_color = d3.scale.ordinal()
			      .domain(["low", "median", "high"])
			      .range(["#ea7070", "#ad9d9d", "#6de09d"]);

			    //custom chart that takes in data 
				var custom_chart = function(data) {
				  	// console.log('data', data);
				    max_price = d3.max(data, function(d) { return parseFloat(d.price, 10); } );
				    // console.log("max_price", max_price);
				    min_price = d3.min(data, function(d) { return parseFloat(d.price, 10); } );
				    // console.log("min_price", min_price);
				    radius_scale = d3.scale.pow().exponent(0.5) //pow.exponent takes in an exponent value
				    .domain([0, max_price])
				    .range([2, 10]);

				var groupLevel = function(){
			      // console.log("the low is 0");
			      priceRange = parseFloat(max_price - min_price).toFixed(5);
			      // console.log("priceRange", priceRange);
			      lowPriceRange = parseFloat(min_price + (priceRange / 3)).toFixed(5);
			      // console.log("lowPriceRange", lowPriceRange);
			      avePriceRange = parseFloat(min_price + ((priceRange / 3) * 2)).toFixed(5);
			      // console.log("avePriceRange", avePriceRange);
			      // console.log("the high", max_price);
			    };
			    groupLevel();

				data.forEach(function(d){ 

				// ***PRICE RANGE CONDITIONALS***
		      	if (d.price >= min_price && d.price <= lowPriceRange) {
			        // console.log("low price range", d.price);
			        d.group = "low";
			      }
		      	else if (d.price > lowPriceRange && d.price <= avePriceRange) {
			        // console.log("median price range", d.price)
			        d.group = "median";
			      }
		      	else if (d.price > avePriceRange && d.price <= max_price) {
			        // console.log("high price range", d.price);
			        d.group = "high";
			      }

			    var node = {
			     	month: parseInt(d.month),
			        day: parseInt(d.day),
			        year: parseInt(d.year),
			        id: parseInt(d.month + d.day + d.year),
			        price: parseFloat(d.price),
			        volume: parseInt(d.totalCirculation),
			        group: d.group, 
			        radius: radius_scale(parseFloat(d.price, 10)),
			        x: Math.random() * 900, //defining x & y for the node to be placed anywhere on the canvas
			        y: Math.random() * 800
			    };
			    nodes.push(node); //push node into nodes
    			});

				nodes.sort(function(a, b) {return b.value- a.value; }); 

			    /////////DRAW CHART/////////

			    //appending svg
			    vis = d3.select("#vis").append("svg") //this "#vis" is in index
	                .attr("width", width)
	                .attr("height", height)
	                .append("g")
	                .attr("id", "svg_vis"); 

	            //creating circles and binding data
    			circles = vis.selectAll("circle")
                 	.data(nodes, function(d) { return d.id ;});

                //appending circle with attributes
			    circles.enter().append("circle")
			      .attr("r", 0)
			      .attr("fill", function(d) { return fill_color(d.group) ;})
			      .attr("stroke-width", 2)
			      .attr("stroke", function(d) {return d3.rgb(fill_color(d.group)).darker();})
			      .attr("id", function(d) { return  "bubble_" + d.id; })
			      .on("mouseover", function(d, i) {show_details(d, i, this);} )
			      .on("mouseout", function(d, i) {hide_details(d, i, this);} );
 		
 				//d3 transition
			    circles.transition().duration(2000).attr("r", function(d) { return d.radius; });
			  	};

				/////////UPDATE CHART- GROUPING THE DATA/////////

				 //I. grouping all the data points
				  function display_group_all() {
				    force.gravity(layout_gravity)
				         .charge(charge)
				         .friction(0.9)
				         .on("tick", function(e) {
				            circles.each(move_towards_center(e.alpha))
				                   .attr("cx", function(d) {return d.x;})
				                   .attr("cy", function(d) {return d.y;});
				         });
				    force.start();
				    hide_years();
				    hide_months();
				  }
				 
				  //moving the data to the center
				  function move_towards_center(alpha) {
				    return function(d) {
				      d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
				      d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
				    };
				  }

				//II. grouping all the data by PRICE (by year)
				  function displayPriceByYear() {
				    force.gravity(layout_gravity)
				         .charge(charge)
				         .friction(0.9)
				        .on("tick", function(e) {
				          circles.each(move_towards_year(e.alpha))
				                 .attr("cx", function(d) {return d.x;})
				                 .attr("cy", function(d) {return d.y;});
				        });
				    force.start();
				    display_years();
				    hide_months();
				  }
				 
				  //moving the PRICE data to its respective year
				  function move_towards_year(alpha) {
				    return function(d) {
				      var target = year_centers[d.year];
				      d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
				      d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
				    };
				  }
				 
				  //setting up area for split years
				  function display_years() {
				      var years_x = {"2009": width / 8, "2010": (width / 8) * 2, "2011": (width / 8) * 3, "2012": (width / 8) * 4, "2013": (width / 8) * 5, "2014": (width / 8) * 6, "2015": (width / 8) * 7};
				      var years_data = d3.keys(years_x);
				      var years = vis.selectAll(".years")
				                 .data(years_data);
				 
				      years.enter().append("text")
				                   .attr("class", "years")
				                   .attr("x", function(d) { return years_x[d]; }  )
				                   .attr("y", 40)
				                   .attr("text-anchor", "middle")
				                   .text(function(d) { return d;});
				 
				  }
				  //hide till its clicked
				  function hide_years() {
				      var years = vis.selectAll(".years").remove();
				  }

				  //tooltip to show data details for each element
				  function show_details(data, i, element) {
				    d3.select(element).attr("stroke", "black");
				    var content = "<span class=\"name\">Price:</span><span class=\"value\"> $" + addCommas(data.price) + "</span><br/>";
				    content +="<span class=\"name\">Total Circulation:</span><span class=\"value\"> " + addCommas(data.volume) + "</span><br/>";
				    content +="<span class=\"name\">Date:</span><span class=\"value\"> " + data.month + "/" + data.day + "/" + data.year + "</span>";
				    tooltip.showTooltip(content, d3.event);
				  }
				 //tooltip to hide data details till executred
				  function hide_details(data, i, element) {
				    d3.select(element).attr("stroke", function(d) { return d3.rgb(fill_color(d.group)).darker();} );
				    tooltip.hideTooltip();
				  }

				  //collects display_all and display_year in an object and returns that object
				  var my_mod = {};
				  my_mod.init = function (_data) { //what is _data? .init is initializing 
				    custom_chart(_data);
				    start();
				    //console.log(my_mod);
				  };
				 
				  my_mod.display_all = display_group_all; //display all charts
				  my_mod.display_year = displayPriceByYear; //display year
				  my_mod.display_volume = displayCirculationByMonth; // display volume by year
				  my_mod.toggle_view = function(view_type) { 
				    console.log("view_type", view_type);
				    if (view_type == 'year') {
				      displayPriceByYear();
				    }
				    else if (view_type == 'circulation') {
				      displayCirculationByMonth();
				    } 
				    else {
				      display_group_all();
				      }
				    };
				 
				  return my_mod;
				})(d3, CustomTooltip); //pass d3 and customToolTip
				
				//*********CUSTOM TOOLTIP******** ?????????????????????
				function CustomTooltip(tooltipId, width){
				  var tooltipId = tooltipId;
				  $("body").append("<div class='tooltip' id='"+tooltipId+"'></div>");
				  
				  if(width){
				    $("#"+tooltipId).css("width", width);
				  }
				  
				  hideTooltip();
				  
				  function showTooltip(content, event){
				    $("#"+tooltipId).html(content);
				    $("#"+tooltipId).show();
				    
				    updatePosition(event);
				  }
				  
				  function hideTooltip(){
				    $("#"+tooltipId).hide();
				  }
				  
				  function updatePosition(event){
				    var ttid = "#"+tooltipId;
				    var xOffset = 20;
				    var yOffset = 10;
				    
				     var ttw = $(ttid).width();
				     var tth = $(ttid).height();
				     var wscrY = $(window).scrollTop();
				     var wscrX = $(window).scrollLeft();
				     var curX = (document.all) ? event.clientX + wscrX : event.pageX;
				     var curY = (document.all) ? event.clientY + wscrY : event.pageY;
				     var ttleft = ((curX - wscrX + xOffset*2 + ttw) > $(window).width()) ? curX - ttw - xOffset*2 : curX + xOffset;
				     if (ttleft < wscrX + xOffset){
				      ttleft = wscrX + xOffset;
				     } 
				     var tttop = ((curY - wscrY + yOffset*2 + tth) > $(window).height()) ? curY - tth - yOffset*2 : curY + yOffset;
				     if (tttop < wscrY + yOffset){
				      tttop = curY + yOffset;
				     } 
				     $(ttid).css('top', tttop + 'px').css('left', ttleft + 'px');
				  }
				  
				  return {
				    showTooltip: showTooltip,
				    hideTooltip: hideTooltip,
				    updatePosition: updatePosition
				  };
				}

				//part of tooltip
				function addCommas(nStr)
				{
				 nStr += '';
				 x = nStr.split('.');
				 x1 = x[0];
				 x2 = x.length > 1 ? '.' + x[1] : '';
				 var rgx = /(\d+)(\d{3})/;
				 while (rgx.test(x1)) {
				   x1 = x1.replace(rgx, '$1' + ',' + '$2');
				 }
				 return x1 + x2;
				}

				//*********DATA*********
				// d3.json("data/csvtojson2.json", function(data) {
				  d3.json("data/bitcurve.json", function(data) {
				    custom_bubble_chart.init(data);
				    custom_bubble_chart.toggle_view('all');
				});

				//jQuery stuff
				$(document).ready(function() {
				  $('#view_selection a').click(function() { //bind it to html element with class #view_selection
				    var view_type = $(this).attr('id');
				    $('#view_selection a').removeClass('active');
				    $(this).toggleClass('active');
				    custom_bubble_chart.toggle_view(view_type);
				    return false;
				  });
				});

			}
		};
	}]);
})();





