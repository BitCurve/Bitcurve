(function() {

	angular.module('circulation.directives', [])

	.directive('circulationData', [function ($location){  
		return {
			scope: {
				selectedData: '='
			}, 	// end scope
			restrict: "A",
			// templateUrl: "../templates/dif.html",
			link: function(scope, element, attrs) {
				// scope.$watch('selectedData', function(){
				// 	var data = scope.selectedData;
				// 	console.log('data', data);
				// });	// end scope.$watch

// *********** BEGIN D3 ***********
				var custom_stacked_chart = (function(d3) {
					'use strict';
					
					console.log('first09arr', first09arr);

					var n = 2, // number of layers
					    m = 14,
					    first09arr,
						sec09arr,
						first10arr,
						sec10arr,
						first11arr,
						sec11arr,
						first12arr,
						sec12arr,
						first13arr,
						sec13arr,
						first14arr,
						sec14arr,
						first15arr,
						sec15arr, // number of samples per layer
					    stack = d3.layout.stack(),
					    layers = stack(d3.range(n).map(function() { return bumpLayer(m, .1); })),
					    // yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
					    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });
					    

					var margin = {top: 40, right: 10, bottom: 20, left: 10},
					    width = 960 - margin.left - margin.right,
					    height = 500 - margin.top - margin.bottom;

					var x = d3.scale.ordinal()
					    .domain(d3.range(m))
					    .rangeRoundBands([0, width], .08);

					var y = d3.scale.linear()
					    .domain([0, yStackMax])
					    .range([height, 0]);

					var color = d3.scale.linear()
					    .domain([0, n - 1])
					    .range(["#aad", "#556"]);

					var xAxis = d3.svg.axis()
					    .scale(x)
					    .tickSize(0)
					    .tickPadding(6)
					    .orient("bottom");

					var svg = d3.select("body").append("svg")
					    .attr("width", width + margin.left + margin.right)
					    .attr("height", height + margin.top + margin.bottom)
					    .append("g")
					    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					var layer = svg.selectAll(".layer")
					    .data(layers)
					    .enter().append("g")
					    .attr("class", "layer")
					    .style("fill", function(d, i) { return color(i); });

					var rect = layer.selectAll("rect")
					    .data(function(d) { return d; })
					    .enter().append("rect")
					    .attr("x", function(d) { return x(d.x); })
					    .attr("y", height)
					    .attr("width", x.rangeBand())
					    .attr("height", 0);

					rect.transition()
					    .delay(function(d, i) { return i * 10; })
					    .attr("y", function(d) { return y(d.y0 + d.y); })
					    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

					svg.append("g")
					    .attr("class", "x axis")
					    .attr("transform", "translate(0," + height + ")")
					    .call(xAxis);

					var transitionStacked = function(data) {
						console.log("hei", data);
						y.domain([0, yStackMax]);

						rect.transition()
							.duration(500)
							.delay(function(d, i) { return i * 10; })
							.attr("y", function(d) { return y(d.y0 + d.y); })
							.attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
							.transition()
							.attr("x", function(d) { return x(d.x); })
							.attr("width", x.rangeBand());

					};

					// Inspired by Lee Byron's test data generator.
					function bumpLayer(n, o) {

					  function bump(a) {
					    var x = 1 / (.1 + Math.random()),
					        y = 2 * Math.random() - .5,
					        z = 10 / (.1 + Math.random());
					    for (var i = 0; i < n; i++) {
					      var w = (i / n - y) * z;
					      a[i] += x * Math.exp(-w * w);
					    }
					  }

					  var a = [], i;
					  for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
					  for (i = 0; i < 5; ++i) bump(a);
					  return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
					}

					var my_mod = {};
					my_mod.init = function (_data) { //what is _data? .init is initializing 
						transitionStacked(_data);
						// start();
						//console.log(my_mod);
					};

					my_mod.display_all = transitionStacked; //display all charts
					// my_mod.display_year = displayDifficultyByYear; //display year
					// my_mod.display_volume = displayCirculationByMonth; // display volume by year
					my_mod.toggle_view = function(view_type) { 
						if (view_type == 'circulation') {
							transitionStacked();
						} 
						else if (view_type == 'circYear') {
							transitionStacked();
						} 
						else if (view_type == 'transactions') {
							$location.path('/transactions')
						}
						else if (view_type == 'miners') {
							$location.path('/miners')
						}
						else if (view_type == 'addresses') {
							$location.path('/addresses')
						}
						else if (view_type == 'price') {
							$location.path('/price')
						}
						else if (view_type == 'circulation') {
							$location.path('/circulation')
						}
						else if (view_type == 'outputValue') {
							$location.path('/outputValue')
						}
						else if (view_type == 'fees') {
							$location.path('/fees')
						}
						// else {
						// 	display_group_all();
						// }
					};

					return my_mod;

				})(d3); // end custom_stacked_chart

				//*********DATA*********
				var bitcurveData = d3.json("../../data/artDashboardData.json", function(data) {
					// console.log("listening to data", data);
					first09arr = [];
					sec09arr = [];
					first10arr = [];
					sec10arr = [];
					first11arr = [];
					sec11arr = [];
					first12arr = [];
					sec12arr = [];
					first13arr = [];
					sec13arr = [];
					first14arr = [];
					sec14arr = [];
					first15arr = [];
					sec15arr = [];

					data.forEach(function(d){	
						if ((d.month === '1' && d.year === '2009') || (d.month === '2' && d.year === '2009') || (d.month === '3' && d.year === '2009') || (d.month === '4' && d.year === '2009') || (d.month === '5' && d.year === '2009') || (d.month === '6' && d.year === '2009')) {
							first09arr.push(d)
						}
						else if ((d.month === '7' && d.year === '2009') || (d.month === '8' && d.year === '2009') || (d.month === '9' && d.year === '2009') || (d.month === '10' && d.year === '2009') || (d.month === '11' && d.year === '2009') || (d.month === '12' && d.year === '2009')) {
							sec09arr.push(d)
						}
						else if ((d.month === '1' && d.year === '2010') || (d.month === '2' && d.year === '2010') || (d.month === '3' && d.year === '2010') || (d.month === '4' && d.year === '2010') || (d.month === '5' && d.year === '2010') || (d.month === '6' && d.year === '2010')) {
							first10arr.push(d)
						}
						else if ((d.month === '7' && d.year === '2010') || (d.month === '8' && d.year === '2010') || (d.month === '9' && d.year === '2010') || (d.month === '10' && d.year === '2010') || (d.month === '11' && d.year === '2010') || (d.month === '12' && d.year === '2010')) {
							sec10arr.push(d)
						}
						else if ((d.month === '1' && d.year === '2011') || (d.month === '2' && d.year === '2011') || (d.month === '3' && d.year === '2011') || (d.month === '4' && d.year === '2011') || (d.month === '5' && d.year === '2011') || (d.month === '6' && d.year === '2011')) {
							first11arr.push(d)
						}
						else if ((d.month === '7' && d.year === '2011') || (d.month === '8' && d.year === '2011') || (d.month === '9' && d.year === '2011') || (d.month === '10' && d.year === '2011') || (d.month === '11' && d.year === '2011') || (d.month === '12' && d.year === '2011')) {
							sec11arr.push(d)
						}
						else if ((d.month === '1' && d.year === '2012') || (d.month === '2' && d.year === '2012') || (d.month === '3' && d.year === '2012') || (d.month === '4' && d.year === '2012') || (d.month === '5' && d.year === '2012') || (d.month === '6' && d.year === '2012')) {
							first12arr.push(d)
						}
						else if ((d.month === '7' && d.year === '2012') || (d.month === '8' && d.year === '2012') || (d.month === '9' && d.year === '2012') || (d.month === '10' && d.year === '2012') || (d.month === '11' && d.year === '2012') || (d.month === '12' && d.year === '2012')) {
							sec12arr.push(d)
						}
						else if ((d.month === '1' && d.year === '2013') || (d.month === '2' && d.year === '2013') || (d.month === '3' && d.year === '2013') || (d.month === '4' && d.year === '2013') || (d.month === '5' && d.year === '2013') || (d.month === '6' && d.year === '2013')) {
							first13arr.push(d)
						}
						else if ((d.month === '7' && d.year === '2013') || (d.month === '8' && d.year === '2013') || (d.month === '9' && d.year === '2013') || (d.month === '10' && d.year === '2013') || (d.month === '11' && d.year === '2013') || (d.month === '12' && d.year === '2013')) {
							sec13arr.push(d)
						}
						else if ((d.month === '1' && d.year === '2014') || (d.month === '2' && d.year === '2014') || (d.month === '3' && d.year === '2014') || (d.month === '4' && d.year === '2014') || (d.month === '5' && d.year === '2014') || (d.month === '6' && d.year === '2014')) {
							first14arr.push(d)
						}
						else if ((d.month === '7' && d.year === '2014') || (d.month === '8' && d.year === '2014') || (d.month === '9' && d.year === '2014') || (d.month === '10' && d.year === '2014') || (d.month === '11' && d.year === '2014') || (d.month === '12' && d.year === '2014')) {
							sec14arr.push(d)
						}
						else if ((d.month === '1' && d.year === '2015') || (d.month === '2' && d.year === '2015') || (d.month === '3' && d.year === '2015') || (d.month === '4' && d.year === '2015') || (d.month === '5' && d.year === '2015') || (d.month === '6' && d.year === '2015')) {
							first15arr.push(d)
						}
						else if ((d.month === '7' && d.year === '2015') || (d.month === '8' && d.year === '2015') || (d.month === '9' && d.year === '2015') || (d.month === '10' && d.year === '2015') || (d.month === '11' && d.year === '2015') || (d.month === '12' && d.year === '2015')) {
							sec15arr.push(d)
						}
					})
					// console.log('first09arr', first09arr);
					// console.log('sec09arr', sec09arr);
					// console.log('first10arr', first10arr);
					// console.log('sec10arr', sec10arr);
					// console.log('first11arr', first11arr);
					// console.log('sec11arr', sec11arr);
					// console.log('first12arr', first12arr);
					// console.log('sec12arr', sec12arr);
					// console.log('first13arr', first13arr);
					// console.log('sec13arr', sec13arr);
					// console.log('first14arr', first14arr);
					// console.log('sec14arr', sec14arr);
					// console.log('first15arr', first15arr);
					// console.log('sec15arr', sec15arr);

					custom_stacked_chart.init(data);
					custom_stacked_chart.toggle_view('all');
				});

				//jQuery 
				$(document).ready(function() {
					$('#view_selection a').click(function() { //bind it to html element with class #view_selection
						var view_type = $(this).attr('id');
						$('#view_selection a').removeClass('active');
						$(this).toggleClass('active');
						custom_stacked_chart.toggle_view(view_type);
						return false;
					});
				});


      } // end link

    }; // end return

  }]);  // end .directive

})(); // end iffy