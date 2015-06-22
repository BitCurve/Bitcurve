(function() {

	angular.module('circulation.directives', [])

	.directive('circulationData', [function ($location){  
		return {
			scope: {
				selectedData: '='
			}, 
			restrict: "A",
			link: function(scope, element, attrs) {

        scope.$watch('selectedData', function(){
          var data = scope.selectedData;
        });	// end scope.$watch

        // *********** BEGIN D3 ***********
        var custom_bubble_chart = (function(d3, CustomTooltip) {
          "use strict";

          var width = 1400, 
              height = 600, 
              tooltip = new CustomTooltip("bitcurve_tooltip", 240), 
              layout_gravity = -0.01, 
              damper = 0.1, 
              nodes = [],
              vis, 
              force, 
              circles, 
              radius_scale,
              min_circulation, 
              max_circulation,
              circulationRange,
              lowcirculationRange,
              avecirculationRange,
              highcirculationRange;

          var center = {x: width / 2, y: height / 2}; 

          var year_centers = {
            "2009": {x: (width / 8), y: height / 2},
            "2010": {x: (width / 8) * 2, y: height / 2},
            "2011": {x: (width / 8) * 3, y: height / 2},
            "2012": {x: (width / 8) * 4, y: height / 2},
            "2013": {x: (width / 8) * 5, y: height / 2},
            "2014": {x: (width / 8) * 6, y: height / 2},
            "2015": {x: (width / 8) * 7, y: height / 2}
          };

          var fill_color = d3.scale.ordinal()
            .domain(["low", "median", "high"])
            .range(["#99906F", "#30ECFF", "#FF9000"]);


          //custom chart 
          var custom_chart = function(data) {
            // console.log("data", data);
            max_circulation = d3.max(data, function(d) { return parseFloat(d.totalCirculation, 10); }); 
            // console.log("max_circulation", max_circulation);
            min_circulation = d3.min(data, function(d) { return parseFloat(d.totalCirculation, 10); }); 
            // console.log("min_circulation", min_circulation);
            radius_scale = d3.scale.pow().exponent(0.5)
              .domain([0, max_circulation])
              .range([2, 4]);

            var groupLevel = function(){
              // console.log("the low is 0");
              circulationRange = parseFloat(max_circulation - min_circulation).toFixed(5);
              // console.log("circulationRange", circulationRange);
              lowcirculationRange = parseFloat(min_circulation + (circulationRange / 3)).toFixed(5);
              // console.log("lowcirculationRange", lowcirculationRange);
              avecirculationRange = parseFloat(min_circulation + ((circulationRange / 3) * 2)).toFixed(5);
              // console.log("avecirculationRange", avecirculationRange);
            };
            groupLevel();

            // console.log("data", data);
            data.forEach(function(d){
            // ***CIRCULATION RANGE CONDITIONALS***
              if (d.totalCirculation >= min_circulation && d.totalCirculation <= lowcirculationRange) {
                // console.log("low circulation range", d.totalCirculation);
                d.group = "low";
              }
              else if (d.totalCirculation > lowcirculationRange && d.totalCirculation <= avecirculationRange) {
                // console.log("median circulation range", d.totalCirculation);
                d.group = "median";
              }
              else if (d.totalCirculation > avecirculationRange && d.totalCirculation <= max_circulation) {
                // console.log("high circulation range", d.totalCirculation);
                d.group = "high";
              }
              else if (!d.data || !d.id || !d.year) {
                d.data = 0;
                d.id = 0;
                d.year = 0;
              }

              var node = { 
                month: +(d.month),
                day: +(d.day),
                year: +(d.year),
                id: +(d.month + d.day + d.year),
                circulation: parseFloat(d.totalCirculation),
                group: d.group, 
                radius: radius_scale(parseFloat(d.totalCirculation, 10)),
                x: Math.random() * 900, 
                y: Math.random() * 800
              };
              nodes.push(node); 	
            });

            nodes.sort(function(a, b) {return b.value - a.value; }); 

            vis = d3.select("#circVis").append("svg") 
              .attr("width", width)
              .attr("height", height)
              .attr("id", "svg_vis"); 

            circles = vis.selectAll("circle")
              .data(nodes, function(d) { return +(d.id) ;});

            circles.enter().append("circle")
              .attr("r", 0)
              .attr("fill", function(d) { return fill_color(d.group) ;})
              .attr("stroke-width", 2)
              .attr("stroke", function(d) {return d3.rgb(fill_color(d.group)).darker();})
              .attr("id", function(d) { return  "bubble_" + +(d.id); })
              .on("mouseover", function(d, i) {show_details(d, i, this);} )
              .on("mouseout", function(d, i) {hide_details(d, i, this);} );

            circles.transition().duration(2000).attr("r", function(d) { return d.radius; });
          };

          function charge(d) { 
            return -Math.pow(d.radius, 2.0) / 8; //
          }

          function start() {
            force = d3.layout.force()
              .nodes(nodes)
              .size([width, height]);
          }

          //GROUPING THE DATA 

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

          function move_towards_center(alpha) { 
            return function(d) {
              d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha * 0.5;
              d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha * 0.5;
            };
          }

          function displaycirculationByYear() {
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

          function move_towards_year(alpha) {
            return function(d) {
              var target = year_centers[d.year];
              d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha; 
              d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha;
            };
          }

          function display_years() {
            var years_x = {"2009": width / 8, "2010": (width / 8) * 2, "2011": (width / 8) * 3,"2012": (width / 8) * 4,"2013": (width / 8) * 5,"2014": (width / 8) * 6,"2015": (width / 8) * 7};
            var years_data = d3.keys(years_x);
            var years = vis.selectAll(".years")
              .data(years_data);
              // console.log("YEARS", years);

            years.enter().append("text")
              .attr("class", "years")
              .attr("x", function(d) { return years_x[d]; }  )
              .attr("y", 40)
              .attr("text-anchor", "middle")
              .text(function(d) { return d;});
          }

          function hide_years() {
            var years = vis.selectAll(".years").remove();
          }

          function show_details(data, i, element) {
            d3.select(element).attr("stroke", "#fff");
            var content = "<span class=\"name\">circulation:</span><span class=\"value\"> " + addCommas(data.circulation) + "</span><br/>";
            content +="<span class=\"name\">Date:</span><span class=\"value\"> " + data.month + "/" + data.day + "/" + data.year + "</span>";
            tooltip.showTooltip(content, d3.event);
          }

          function hide_details(data, i, element) {
            d3.select(element).attr("stroke", function(d) { return d3.rgb(fill_color(d.group)).darker();} );
            tooltip.hideTooltip();
          }

          var my_mod = {};
          my_mod.init = function (_data) {  
            custom_chart(_data);
            start();
            //console.log(my_mod);
          };

          my_mod.display_all = display_group_all;
          my_mod.display_year = displaycirculationByYear; 
          my_mod.toggle_view = function(view_type) { 
            if (view_type === 'circulation') {
              displaycirculationByYear();
            } 
            else if (view_type === 'circYear') {
              displaycirculationByYear();
            } 
            else if (view_type === 'outputValue') {
              $location.path('/outputValue')
            }
            else if (view_type === 'fees') {
              $location.path('/fees')
            }
            else if (view_type === 'addresses') {
              $location.path('/addresses')
            }
            else if (view_type === 'difficulty') {
              $location.path('/difficulty')
            }
            else if (view_type === 'transactions') {
              $location.path('/transactions')
            }
            else if (view_type === 'miners') {
              $location.path('/miners')
            }
            else if (view_type === 'price') {
              $location.path('/price')
            }
            else {
              display_group_all();
            }
          };

          return my_mod;
        })(d3, CustomTooltip);

        //*********CUSTOM TOOLTIP******** 
        function CustomTooltip(tooltipId, width){
          var tooltipId = tooltipId;
          $("#circVis").append("<div class='tooltip' id='"+tooltipId+"'></div>");
          if(width){
            $("#"+tooltipId).css("w-th", width);
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

        //part of tooltip, adding commas
        function addCommas(nStr){
          nStr += '';
          x = nStr.split('.');
          x1 = x[0];
          x2 = x.length > 1 ? '.' + x[1] : '';
          var rgx = /(\d+)(\d{3})/;
          while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
          }
<<<<<<< HEAD
        };
       

        return my_mod;
      })(d3, CustomTooltip); //pass d3 and customToolTip

      //*********CUSTOM TOOLTIP******** 
      function CustomTooltip(tooltipId, width){
      var tooltipId = tooltipId;
      $("#circVis").append("<div class='tooltip' id='"+tooltipId+"'></div>");

      if(width){
      $("#"+tooltipId).css("w-th", width);
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

      //part of tooltip, adding commas
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
      var bitcurveData = d3.json("../../data/artDashboardData.json", function(data) {
        // console.log("listening to data", data);
        custom_bubble_chart.init(data);
        custom_bubble_chart.toggle_view('all');
      });

      //jQuery 
      $(document).ready(function() {
        $('#view_selection a').click(function() { //bind it to html element with class #view_selection
          var view_type = $(this).attr('id');
          $('#view_selection a').removeClass('active');
          $(this).toggleClass('active');
          custom_bubble_chart.toggle_view(view_type);
          return false;
        });
      });

      //   return my_mod;
      // })(d3, CustomTooltip); //pass d3 and customToolTip

      // //*********CUSTOM TOOLTIP******** 
      // function CustomTooltip(tooltipId, width){
      // var tooltipId = tooltipId;
      // $("#circVis").append("<div class='tooltip' id='"+tooltipId+"'></div>");

      // if(width){
      // $("#"+tooltipId).css("w-th", width);
      // }

      // hideTooltip();

      // function showTooltip(content, event){
      // $("#"+tooltipId).html(content);
      // $("#"+tooltipId).show();

      // updatePosition(event);
      // }

      // function hideTooltip(){
      // $("#"+tooltipId).hide();
      // }

      // function updatePosition(event){
      // var ttid = "#"+tooltipId;
      // var xOffset = 20;
      // var yOffset = 10;

      // var ttw = $(ttid).width();
      // var tth = $(ttid).height();
      // var wscrY = $(window).scrollTop();
      // var wscrX = $(window).scrollLeft();
      // var curX = (document.all) ? event.clientX + wscrX : event.pageX;
      // var curY = (document.all) ? event.clientY + wscrY : event.pageY;
      // var ttleft = ((curX - wscrX + xOffset*2 + ttw) > $(window).width()) ? curX - ttw - xOffset*2 : curX + xOffset;
      // if (ttleft < wscrX + xOffset){
      // ttleft = wscrX + xOffset;
      // } 
      // var tttop = ((curY - wscrY + yOffset*2 + tth) > $(window).height()) ? curY - tth - yOffset*2 : curY + yOffset;
      // if (tttop < wscrY + yOffset){
      // tttop = curY + yOffset;
      // } 
      // $(ttid).css('top', tttop + 'px').css('left', ttleft + 'px');
      // }

      // return {
      // showTooltip: showTooltip,
      // hideTooltip: hideTooltip,
      // updatePosition: updatePosition
      // };
      // }

      // //part of tooltip, adding commas
      // function addCommas(nStr)
      // {
      // nStr += '';
      // x = nStr.split('.');
      // x1 = x[0];
      // x2 = x.length > 1 ? '.' + x[1] : '';
      // var rgx = /(\d+)(\d{3})/;
      // while (rgx.test(x1)) {
      // x1 = x1.replace(rgx, '$1' + ',' + '$2');
      // }
      // return x1 + x2;
      // }

      // //*********DATA*********
      // var bitcurveData = d3.json("../../data/artDashboardData.json", function(data) {
      //   // console.log("listening to data", data);
      //   custom_bubble_chart.init(data);
      //   custom_bubble_chart.toggle_view('all');
      // });

      // //jQuery 
      // $(document).ready(function() {
      //   $('#view_selection a').click(function() { //bind it to html element with class #view_selection
      //     var view_type = $(this).attr('id');
      //     $('#view_selection a').removeClass('active');
      //     $(this).toggleClass('active');
      //     custom_bubble_chart.toggle_view(view_type);
      //     return false;
      //   });
      // });

// II.
// var margin = {top: 20, right: 20, bottom: 30, left: 50},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;

// // var parseDate = d3.time.format("%d-%b-%y").parse;

// var x = d3.time.scale()
//     .range([0, width]);

// var y = d3.scale.linear()
//     .range([height, 0]);

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left");

// var area = d3.svg.area()
//     .x(function(d) { return x(d.date); })
//     .y0(height)
//     .y1(function(d) { return y(d.totalCirculation); });

// var svg = d3.select("circVis").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.json("../../data/artDashboardData.json", function(error, data) {
//   console.log("data", data);
//   if (error) throw error;

//   data.forEach(function(d) {
//     d.date = d.date;
//     d.totalCirculation = +d.totalCirculation;
//   });

//   x.domain(d3.extent(data, function(d) { return d.date; }));
//   y.domain([0, d3.max(data, function(d) { return d.totalCirculation; })]);

//   svg.append("path")
//       .datum(data)
//       .attr("class", "area")
//       .attr("d", area);

//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis);

//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("Price ($)");
// });

// III.
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


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
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.totalCirculation); });

var svg = d3.select("circYear").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("../../data/artDashboardData.json", function(error, data) {
  console.log("data", data);
  if (error) throw error;

  data.forEach(function(d) {
    d.year = +d.year;
    d.totalCirculation = +d.totalCirculation;
  });

  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain(d3.extent(data, function(d) { return d.totalCirculation; }));

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
      .text("Price ($)");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
});
=======
          return x1 + x2;
        }

        //*********DATA*********
        var bitcurveData = d3.json("../../data/artDashboardData.json", function(data) {
          // console.log("listening to data", data);
          custom_bubble_chart.init(data);
          custom_bubble_chart.toggle_view('all');
        });

        //jQuery 
        $(document).ready(function() {
          $('#view_selection a').click(function() {
            var view_type = $(this).attr('id');
            $('#view_selection a').removeClass('active');
            $(this).toggleClass('active');
            custom_bubble_chart.toggle_view(view_type);
            return false;
          });
        });
>>>>>>> 92e6d02c76e18e1888d3fffc6e0765b03f476297

      } // end link

    }; // end return

  }]);  // end .directive

})(); // end iffy
