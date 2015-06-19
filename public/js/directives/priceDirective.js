(function() {

	angular.module('price.directives', [])

	.directive('priceData', [function ($location){  
		return {
			scope: {
				selectedData: '='
			}, 	// end scope
			restrict: "A",
			// templateUrl: "../templates/price.html",
			link: function(scope, element, attrs) {


				scope.$watch('selectedData', function(){
					var data = scope.selectedData;
				});	// end scope.$watch


// *********** BEGIN D3 ***********
var custom_bubble_chart = (function(d3, CustomTooltip) {
  "use strict";
 
 //defining the parameters for custom_bubble_chart
  var width = 1600, //width
      height = 600, //height
      tooltip = new CustomTooltip("bitcurve_tooltip", 240), //tooltip
      layout_gravity = -0.01, //gravity
      damper = 0.1, //moving around nodes
      nodes = [], //empty nodes
      vis, 
      force, 
      circles, 
      radius_scale,
      min_price, 
      max_price,
      priceRange,
      lowPriceRange,
      avePriceRange,
      highPriceRange;
 //defining the center based on width and height
  var center = {x: width / 2, y: height / 2}; 
 
 //defining the area for all the years when split
  var year_centers = {
      "2009": {x: (width / 8), y: height / 2},
      "2010": {x: (width / 8) * 2, y: height / 2},
      "2011": {x: (width / 8) * 3, y: height / 2},
      "2012": {x: (width / 8) * 4, y: height / 2},
      "2013": {x: (width / 8) * 5, y: height / 2},
      "2014": {x: (width / 8) * 6, y: height / 2},
      "2015": {x: (width / 8) * 7, y: height / 2}
    };

  var month_centers = {
    "1": {x: width / 13, y: height / 2},
    "2": {x: (width / 13) * 2, y: height / 2},
    "3": {x: (width / 13) * 3, y: height / 2},
    "4": {x: (width / 13) * 4, y: height / 2},
    "5": {x: (width / 13) * 5, y: height / 2},
    "6": {x: (width / 13) * 6, y: height / 2},
    "7": {x: (width / 13) * 7, y: height / 2},
    "8": {x: (width / 13) * 8, y: height / 2},
    "9": {x: (width / 13) * 9, y: height / 2},
    "10": {x: (width / 13) * 10, y: height / 2},
    "11": {x: (width / 13) * 11, y: height / 2},
    "12": {x: (width / 13) * 12, y: height / 2}
  };
 
 //color definition 
  var fill_color = d3.scale.ordinal()
    .domain(["low", "median", "high"])
    .range(["#ea7070", "#ad9d9d", "#6de09d"]);

 
 //custom chart that takes in data 
 var custom_chart = function(data) {
  // console.log("data", data);
    //use the max total_amount in the data as the max in the scale's domain
    max_price = d3.max(data, function(d) { return parseFloat(d.price, 10); }); //function for the max data and parsing it into #
    // console.log("max_price", max_price);
    min_price = d3.min(data, function(d) { return parseFloat(d.price, 10); }); //function for the max data and parsing it into #
    // console.log("min_price", min_price);
    radius_scale = d3.scale.pow().exponent(0.5) //pow.exponent takes in an exponent value
    .domain([0, max_price])
    .range([2, 12]);


 var groupLevel = function(){
    // console.log("the low is 0");
    priceRange = parseFloat(max_price - min_price).toFixed(5);
    // console.log("priceRange", priceRange);
    lowPriceRange = parseFloat(min_price + (priceRange / 3)).toFixed(5);
    // console.log("lowPriceRange", lowPriceRange);
    avePriceRange = parseFloat(min_price + ((priceRange / 3) * 2)).toFixed(5);
    // console.log("avePriceRange", avePriceRange);
    // // highPriceRange = lowPriceRange * 3;
    // // console.log("highPriceRange", highRange);
    // console.log("the high", priceRange);
  };
  groupLevel();

      // console.log("data", data);
    //create node objects from original data that will serve as the data behind each bubble in the vis, then add each node to nodes to be used later
    data.forEach(function(d){//The forEach() method executes a provided function once per array element.

      // ***PRICE RANGE CONDITIONALS***
      if (d.price >= min_price && d.price <= lowPriceRange) {
        // console.log("low price range", d.price);
        d.group = "low";
      }
      else if (d.price > lowPriceRange && d.price <= avePriceRange) {
        // console.log("median price range", d.price);
        d.group = "median";
      }
      else if (d.price > avePriceRange && d.price <= max_price) {
        // console.log("high price range", d.price);
        d.group = "high";
      }
      else if (!d.data || !d.id || !d.year) {
      	d.data = 0;
      	d.id = 0;
      	d.year = 0;
      }

  var node = { //refer data json
    month: +(d.month),
    day: +(d.day),
    year: +(d.year),
    id: +(d.month + d.day + d.year),
    price: parseFloat(d.price),
    volume: +(d.totalCirculation),
    group: d.group, 
    radius: radius_scale(parseFloat(d.price, 10)),
    // value: d.price,
    x: Math.random() * 900, //defining x & y for the node to be placed anywhere on the canvas
    y: Math.random() * 800
  };
  // console.log("node", node);
  // if (!d.data) {
  // 	return d.
  // }
  	nodes.push(node); //push node into nodes	
});
    
    //https://github.com/mbostock/d3/wiki/Selections#sort
    nodes.sort(function(a, b) {return b.value - a.value; }); 
    
    //create svg at #vis and then create circle representation for each node
    vis = d3.select("#priceVis").append("svg") //this "#vis" is in index
                .attr("width", width)
                .attr("height", height)
                .attr("id", "svg_vis"); 

    //creating circles and binding data
    circles = vis.selectAll("circle")
                 .data(nodes, function(d) { return +(d.id) ;});
 

    //appending circle with attributes
    circles.enter().append("circle")
      .attr("r", 0)
      .attr("fill", function(d) { return fill_color(d.group) ;})
      .attr("stroke-width", 2)
      .attr("stroke", function(d) {return d3.rgb(fill_color(d.group)).darker();})
      .attr("id", function(d) { return  "bubble_" + +(d.id); })
      .on("mouseover", function(d, i) {show_details(d, i, this);} ) //used because we need 'this' in the mouse callbacks
      .on("mouseout", function(d, i) {hide_details(d, i, this);} );
 
    //d3 transition; Fancy transition to make bubbles appear, ending with the correct radius
    circles.transition().duration(2000).attr("r", function(d) { return d.radius; });
    circles.exit().remove();
 
  };
 
//charge strength to the specified value. 
  function charge(d) { 
    return -Math.pow(d.radius, 2.0) / 8; //
  }
 
//start the simulation; Starts up the force layout with the default values
  function start() {
    force = d3.layout.force()
            .nodes(nodes)
            .size([width, height]);
  }
 
//GROUPING THE DATA 

  //I. Sets up force layout to display all nodes in one circle; used to configure and startup the force directed simulation:
  function display_group_all() {
    force.gravity(layout_gravity) //force is an instance variable of BubbleChart holding the force layout for the visualization.
         .charge(charge)
         .friction(0.9)
         .on("tick", function(e) {
            circles.each(move_towards_center(e.alpha)) //The circles instance variable holds the svg circles that represent each node.
                   .attr("cx", function(d) {return d.x;})
                   .attr("cy", function(d) {return d.y;});
         });
    force.start();
    hide_years();
  }

  //The alpha dampening allows the push towards the center to be reduced over the course of the simulation, giving other forces like gravity and charge the opportunity to push back. Moves all circles towards the @center of the visualization
  function move_towards_center(alpha) { 
    return function(d) {
      d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
      d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
    };
  }

 //II. grouping all the data by year
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
 
  //moving the data to its respective year; move_towards_year is almost the same as move_towards_center. The difference being that first the correct year point is extracted from @year_centers. Here’s what that variable looks like:
  function move_towards_year(alpha) {
    return function(d) {
      var target = year_centers[d.year];
      d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1; //move_towards_year also multiplies by 1.1 to speed up the transition a bit.
      d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
    };
  }

  //Method to display year titles, setting up area for split years; this is just an associative array where each year has its own location to move towards.
  function display_years() {
      // var years_x = {"2013": 160, "2014": width / 2, "2015": width - 160};
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
 //Method to hide year titiles
  function hide_years() {
      var years = vis.selectAll(".years").remove();
  }
 
 //tooltip to show data details for each element
  function show_details(data, i, element) {
    d3.select(element).attr("stroke", "#fff");
    var content = "<span class=\"name\">Price:</span><span class=\"value\"> $ " + addCommas(data.price) + "</span><br/>";
    content +="<span class=\"name\">Year:</span><span class=\"value\"> " + data.year + "</span>";
    content +="<span class=\"name\">Date:</span><span class=\"value\"> " + data.month + "/" + data.day + "/" + data.year + "</span>";
    tooltip.showTooltip(content, d3.event);
  }
 //tooltip to hide data details till executred
  function hide_details(data, i, element) {
    d3.select(element).attr("stroke", function(d) { return d3.rgb(fill_color(d.group)).darker();} );
    tooltip.hideTooltip();
  }

  //collects display_all and display_year in an object and returns that object, initializing D3
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
    if (view_type === 'price') {
      displayPriceByYear();
    } 
    else if (view_type === 'priceYear') {
      displayPriceByYear();
    } 
    else if (view_type === 'transactions') {
      $location.path('/transactions')
    }
    else if (view_type === 'miners') {
      $location.path('/miners')
    }
    else if (view_type === 'addresses') {
      $location.path('/addresses')
    }
    else if (view_type === 'difficulty') {
      $location.path('/difficulty')
    }
    else if (view_type === 'circulation') {
      $location.path('/circulation')
    }
    else if (view_type === 'outputValue') {
      $location.path('/outputValue')
    }
    else if (view_type === 'fees') {
      $location.path('/fees')
    }
    else {
      display_group_all();
      }
    };
 
  return my_mod;
})(d3, CustomTooltip); //pass d3 and customToolTip

//*********CUSTOM TOOLTIP******** 
function CustomTooltip(tooltipId, width){
  var tooltipId = tooltipId;
  $("#priceVis").append("<div class='tooltip' id='"+tooltipId+"'></div>");
  
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

      } // end link

    }; // end return

  }]);  // end .directive

})(); // end iffy
