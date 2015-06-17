(function() {

	angular.module('bitcurve.directives', [])

	.directive('bitcoinData', [function (){  
		return {
			scope: {
				selectedData: '='
			}, 	// end scope
			restrict: "A",
			template: "<div id='artData'></div>",
			link: function(scope, element, attrs) {


				scope.$watch('selectedData', function(){
					// console.log("I'm changing", scope.selectedData);
					custom_chart(scope.selectedData);
				});	// end scope.$watch

// *********** BEGIN D3 ***********

				var custom_chart;
				var CustomTooltip;

				var custom_bubble_chart = (function(d3) {

				//DATA 
				var dataSelection = scope.selectedData;

				//DEFINGING the VARIABLES
				var width = 1400,
					height = 800,
					tooltip = CustomTooltip("bitcurve_tooltip", 240),
					layout_gravity = -0.01,
					damper = 0.1,
					nodes = [],
					chart, 
					force, 
					circles, 
					radius_scale, 
					min_data, 
					max_data, 
					dataRange, 
					lowdataRange, 
					avedataRange;

				//DEFINING the CENTER for the CANVAS
				var center = {x: width / 2, y: height / 2}; 

				//DEFINING the AREA for YEARS DISPLAY
				var year_centers = {
					"2009": {x: width / 8, y: height / 2},
					"2010": {x: (width / 8) * 2, y: height / 2},
					"2011": {x: (width / 8) * 3, y: height / 2},
					"2012": {x: (width / 8) * 4, y: height / 2},
					"2013": {x: (width / 8) * 5, y: height / 2},
					"2014": {x: (width / 8) * 6, y: height / 2},
					"2015": {x: (width / 8) * 7, y: height / 2}
				};

				//DEIFINING THE COLORS
				var fill_color = d3.scale.ordinal()
					.domain(["low", "median", "high"])
					.range(["#ea7070", "#ad9d9d", "#6de09d"]);
				 
				//CUSTOM CHART THAT TAKES in all DATA
				//DEFINE MAX & MIN for DATA 
				custom_chart = function(dataSelection) { //start function custom_chart
					console.log('check data', dataSelection);

					max_data = d3.max(dataSelection, function(d) { return parseFloat(d.data, 10); } ); //function for the max data and parsing it into #
					console.log("max_data", max_data);
					min_data = d3.min(dataSelection, function(d) { return parseFloat(d.data, 10); } );
					console.log("min_data", min_data);
					radius_scale = d3.scale.pow().exponent(0.5) //pow.exponent takes in an exponent value
						.domain([0, max_data])
						.range([2, 50]);

				//DEFINING the RANGES for DATA
				var groupLevel = function(){
					// console.log("the low is 0");
					dataRange = parseFloat(max_data - min_data).toFixed(5);
					console.log("dataRange", dataRange);
					lowdataRange = parseFloat(min_data + (dataRange / 3)).toFixed(5);
					console.log("lowdataRange", lowdataRange);
					avedataRange = parseFloat(min_data + ((dataRange / 3) * 2)).toFixed(5);
					console.log("avePriceRange", avedataRange);
					// console.log("the high", max_price);
				};
				groupLevel();
				 
				//create node objects from original data that will serve as the data behind each bubble in the vis, then add each node to nodes to be used later
				dataSelection.forEach(function(d){ //The forEach() method executes a provided function once per array element.
					// console.log("d", d);

					//RANGE CONDITIONALS for GROUPING the DATA
					if (d.data >= min_data && d.data <= lowdataRange) {
						d.group = "low";
					}
					else if (d.data > lowdataRange && d.data <= avedataRange) {
						d.group = "median";
					}
					else if (d.data > avedataRange && d.data <= max_data) {
						d.group = "high";
					}

					//DEFINING NODE
					var node = { //referring to data
						year: parseInt(d.year),
						id: parseInt(d.id),
						group: d.group, 
						value: d.data,
						radius: radius_scale(parseFloat(d.data, 10)),
						x: Math.random() * 900, //defining x & y for the node to be placed anywhere on the canvas
						y: Math.random() * 800
					};
					if (d.id) {
						nodes.push(node); //push node into nodes
					}

				});	// end dataSelection.forEach

				console.log("nodes", nodes);

				// nodes.sort(function(a, b) { return b.value - a.value; }); 

				//DRAWING D3 CHART 
				//APPEND SVG
				chart = d3.select("#artData").append("svg") //this "#vis" is in index
		            .attr("width", width)
		            .attr("height", height)
		            // .attr("id", "svg_vis"); // Applies an id of 'svg_vis' to the actual svg div 

				//CREATE & APPEND CIRCLES
				circles = chart.selectAll("circle")
					.data(nodes, function(d) { return d.id ;});
						circles.enter().append("circle")
							.attr("r", 0)
							.attr("fill", function(d) { return fill_color(d.group) ;})
							.attr("stroke-width", 2)
							.attr("stroke", function(d) {return d3.rgb(fill_color(d.group)).darker();})
							.attr("id", function(d) { return  "bubble_" + d.id; })
							.on("mouseover", function(d, i) {show_details(d, i, this);} )
							.on("mouseout", function(d, i) {hide_details(d, i, this);} );

				//D3 TRANISITON
				circles.transition().duration(2000).attr("r", function(d) { return d.radius; });
		 
			};	// end function custom_chart
		 		
		 		//D3 ANIMATION FUNCTION
				//start the simulation 
				function start() {
					force = d3.layout.force()
				        .nodes(nodes)
				        .size([width, height]);
				}
				//charge strength to the specified value.
				function charge(d) {
					return -Math.pow(d.radius, 2.0) / 8;
				}

				//GROUPING THE DATA 
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
				//this cannot be moved to 
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
				// my_mod.display_volume = displayCirculationByMonth; // display volume by year
				my_mod.toggle_view = function(view_type) { 
				  // console.log("view_type", view_type);
				  if (view_type == 'year') {
				    displayPriceByYear();
				  }
				  // else if (view_type == 'circulation') {
				  //   displayCirculationByMonth();
				  // } 
				  else {
				    display_group_all();
				    }
				  };

				return my_mod;
			})(d3, CustomTooltip); // end custom_bubble_chart //pass d3 and CustomTooltip 	

				//*********CUSTOM TOOLTIP******** ?????????????????????
				function CustomTooltip (tooltipId, width){
					// console.log('tooltipId', tooltipId)
					var tooltipId = tooltipId;
					$("body").append("<div class='tooltip' id='" + tooltipId + "'></div>");
					if (width){
						$("#" + tooltipId).css("width", width);
					}
					hideTooltip();

					function showTooltip(content, event){
						$("#" + tooltipId).html(content);
						$("#" + tooltipId).show();
						updatePosition(event);
					}

					function hideTooltip(){
						$("#" + tooltipId).hide();
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
				};	// end CustomTooltip
				// CustomTooltip();

				// part of tooltip
				function addCommas(nStr) {
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
				  // d3.json("data/bitcurve.json", function(data) {
				    
			    custom_bubble_chart.init(dataSelection);

				    // custom_bubble_chart.toggle_view('all');
				// });

				//jQuery stuff
				// $(document).ready(function() {
				//   $('#view_selection a').click(function() { //bind it to html element with class #view_selection
				//     var view_type = $(this).attr('id');
				//     $('#view_selection a').removeClass('active');
				//     $(this).toggleClass('active');
				//     custom_bubble_chart.toggle_view(view_type);
				//     return false;
				//   });
				// });

			}	// end link

		}	// end return

	}]);	// end .directive

})();	// end iffy