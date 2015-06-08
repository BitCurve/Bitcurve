var app = angular.module('bitcurve');

app.controller('dashBoardCtrl', function($scope, dashBoardService){

	
		dashBoardService.getBitcoinPricing($scope).then(function(data){
			console.log("data from ctrl", data);
			$scope.bitCoinPricing = data;






		var gainOrLossChart = dc.pieChart('#gain-loss-chart');
		var fluctuationChart = dc.barChart('#fluctuation-chart');
		var quarterChart = dc.pieChart('#quarter-chart');
		var dayOfWeekChart = dc.rowChart('#day-of-week-chart');
		var moveChart = dc.lineChart('#monthly-move-chart');
		var volumeChart = dc.barChart('#monthly-volume-chart');
		var yearlyBubbleChart = dc.bubbleChart('#yearly-bubble-chart');

		// d3.csv('../dataset.csv', function (data) {
		    // console.log('data', data);
		    var dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
		    var numberFormat = d3.format('.2f');

		    data.forEach(function (d) {
		    	if (d.Date) {
			    	// console.log('d.Date', d.Date);
			        d.dd = dateFormat.parse(d.Date);
			        // console.log('d.dd', d.dd);
			        d.month = d3.time.month(d.dd);	// WW: Still returns the entire date sequence, but it's always as such: 'Fri May 01 2015 00:00:00' -- indicating that the month in question is May. Can we use 'd3.time.year(d.dd).getMonth()' to get the month? 
			        // console.log('d.month', d.month); 	
			        d.High = +d.High;
			        // console.log('d.High', d.High);
			        d.Low = +d.Low;
			        // console.log('d.Low', d.Low);
			    }
		    });

		    var ndx = crossfilter(data);
		    // console.log('ndx', ndx);
		    var all = ndx.groupAll();
		    // console.log('all', all);

		    var yearlyDimension = ndx.dimension(function (d) {
		    	// console.log('d1', d);
		    	// console.log('Year:', d3.time.year(d.dd).getFullYear());
	    		if (d.Date) {	// WW: If d.Date is NOT empty
	        		return d3.time.year(d.dd).getFullYear();
	        	}
		    });

		    var yearlyPerformanceGroup = yearlyDimension.group().reduce(
		        function (p, v) {
		            ++p.count;
		            p.absGain += v.High - v.Low;
		            p.fluctuation += Math.abs(v.High - v.Low);
		            p.sumIndex += (v.Low + v.High) / 2;
		            p.avgIndex = p.sumIndex / p.count;
		            p.percentageGain = (p.absGain / p.avgIndex) * 100;
		            p.fluctuationPercentage = (p.fluctuation / p.avgIndex) * 100;
		            return p;
		        },
		        function (p, v) {
		            --p.count;
		            p.absGain -= v.High - v.Low;
		            p.fluctuation -= Math.abs(v.High - v.Low);
		            p.sumIndex -= (v.Low + v.High) / 2;
		            p.avgIndex = p.sumIndex / p.count;
		            p.percentageGain = (p.absGain / p.avgIndex) * 100;
		            p.fluctuationPercentage = (p.fluctuation / p.avgIndex) * 100;
		            return p;
		        },
		        function () {
		            return {
		                count: 0,
		                absGain: 0,
		                fluctuation: 0,
		                fluctuationPercentage: 0,
		                sumIndex: 0,
		                avgIndex: 0,
		                percentageGain: 0
		            };
		        }
		    );
			// console.log('yearlyPerformanceGroup', yearlyPerformanceGroup);

		    var dateDimension = ndx.dimension(function (d) {
		    	// console.log('d2', d.dd);
		        return d.dd;
		    });
		    // console.log('dateDimension', dateDimension);

		    var moveMonths = ndx.dimension(function (d) {
		    	// console.log('d3', d.month);
		        return d.month;
		    });
		    // console.log('moveMonths', moveMonths);

		    var monthlyMoveGroup = moveMonths.group().reduceSum(function (d) {
		        return Math.abs(d.High - d.Low);
		    });
		    // console.log('monthlyMoveGroup', monthlyMoveGroup);
		    
		    var volumeByMonthGroup = moveMonths.group().reduceSum(function (d) {
		        return d.volume / 500000;	// WW: Should we be dividing by 500,000?
		    });
			// console.log('volumeByMonthGroup', volumeByMonthGroup);

		    var indexAvgByMonthGroup = moveMonths.group().reduce(
		        function (p, v) {
		            ++p.days;
		            p.total += (v.Low + v.High) / 2;	// WW: Should we be dividing by 2?
		            p.avg = Math.round(p.total / p.days);
		            return p;
		        },
		        function (p, v) {
		            --p.days;
		            p.total -= (v.Low + v.High) / 2;	// WW: Should we be dividing by 2?
		            p.avg = p.days ? Math.round(p.total / p.days) : 0;
		            return p;
		        },
		        function () {
		            return {days: 0, total: 0, avg: 0};
		        }
		    );
		    // console.log('indexAvgByMonthGroup', indexAvgByMonthGroup);

		    var gainOrLoss = ndx.dimension(function (d) {
		        return d.Low > d.High ? 'Loss' : 'Gain';
		    });
		    // console.log('gainOrLoss', gainOrLoss);

		    var gainOrLossGroup = gainOrLoss.group();
		    // console.log('gainOrLossGroup', gainOrLossGroup);

		    var fluctuation = ndx.dimension(function (d) {
		        return Math.round((d.High - d.Low) / d.Low * 100);
		    });
		    // console.log('fluctuation', fluctuation);

		    var fluctuationGroup = fluctuation.group();
		    // console.log('fluctuationGroup', fluctuationGroup);

		    var quarter = ndx.dimension(function (d) {
		    	if (d.Date) {
			        var month = d.dd.getMonth();
			        if (month <= 2) {
			            return 'Q1';
			        } else if (month > 2 && month <= 5) {
			            return 'Q2';
			        } else if (month > 5 && month <= 8) {
			            return 'Q3';
			        } else {
			            return 'Q4';
			        }
			    }
		    });
		    // console.log('quarter', quarter);

		    var quarterGroup = quarter.group().reduceSum(function (d) {
		        return d.volume;
		    });
		    // console.log('quarterGroup', quarterGroup);

		    var dayOfWeek = ndx.dimension(function (d) {
		    	if (d.Date) {
			        var day = d.dd.getDay();
			        var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			        return day + '.' + name[day];
			    }
		    });
		    // console.log('dayOfWeek', dayOfWeek);

		    var dayOfWeekGroup = dayOfWeek.group();
		    // console.log('dayOfWeekGroup', dayOfWeekGroup);

		    yearlyBubbleChart
		        .width(990) 
		        .height(250) 
		        .transitionDuration(1500) 
		        .margins({top: 10, right: 50, bottom: 30, left: 40})
		        .dimension(yearlyDimension)
		        .group(yearlyPerformanceGroup)
		        .colors(colorbrewer.RdYlGn[9]) 
		        .colorDomain([-500, 500])
		        .colorAccessor(function (d) {
		            return d.value.absGain;
		        })
		        .keyAccessor(function (p) {
		            return p.value.absGain;
		        })
		        .valueAccessor(function (p) {
		            return p.value.percentageGain;
		        })
		        .radiusValueAccessor(function (p) {
		            return p.value.fluctuationPercentage;
		        })
		        .maxBubbleRelativeSize(0.3)
		        .x(d3.scale.linear().domain([-2500, 2500]))
		        .y(d3.scale.linear().domain([-100, 100]))
		        .r(d3.scale.linear().domain([0, 4000]))
		        .elasticY(true)
		        .elasticX(true)
		        .yAxisPadding(100)
		        .xAxisPadding(500)
		        .renderHorizontalGridLines(true) 
		        .renderVerticalGridLines(true) 
		        .xAxisLabel('Index Gain') 
		        .yAxisLabel('Index Gain %') 
		        .renderLabel(true) 
		        .label(function (p) {
		            return p.key;
		        })
		        .renderTitle(true) 
		        .title(function (p) {
		            return [
		                p.key,
		                'Index Gain: ' + numberFormat(p.value.absGain),
		                'Index Gain in Percentage: ' + numberFormat(p.value.percentageGain) + '%',
		                'Fluctuation / Index Ratio: ' + numberFormat(p.value.fluctuationPercentage) + '%'
		            ].join('\n');
		        })		        
		        .yAxis().tickFormat(function (v) {
		            return v + '%';
		        });

		    gainOrLossChart
		        .width(180) 
		        .height(180) 
		        .radius(80) 
		        .dimension(gainOrLoss)
		        .group(gainOrLossGroup)
		        .label(function (d) {
		            if (gainOrLossChart.hasFilter() && !gainOrLossChart.hasFilter(d.key)) {
		                return d.key + '(0%)';
		            }
		            var label = d.key;
		            if (all.value()) {
		                label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
		            }
		            return label;
		        });

		    quarterChart.width(180)
		        .height(180)
		        .radius(80)
		        .innerRadius(30)
		        .dimension(quarter)
		        .group(quarterGroup);

		    dayOfWeekChart.width(180)
		        .height(180)
		        .margins({top: 20, left: 10, right: 10, bottom: 20})
		        .group(dayOfWeekGroup)
		        .dimension(dayOfWeek)
		        .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
		        .label(function (d) {
		            return d.key.split('.')[1];
		        })
		        .title(function (d) {
		            return d.value;
		        })
		        .elasticX(true)
		        .xAxis().ticks(4);

		    fluctuationChart.width(420)
		        .height(180)
		        .margins({top: 10, right: 50, bottom: 30, left: 40})
		        .dimension(fluctuation)
		        .group(fluctuationGroup)
		        .elasticY(true)
		        .centerBar(true)
		        .gap(1)
		        .round(dc.round.floor)
		        .alwaysUseRounding(true)
		        .x(d3.scale.linear().domain([-25, 25]))
		        .renderHorizontalGridLines(true)
		        .filterPrinter(function (filters) {
		            var filter = filters[0], s = '';
		            s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
		            return s;
		        });

		    fluctuationChart.xAxis().tickFormat(
		        function (v) { return v + '%'; });
		    fluctuationChart.yAxis().ticks(5);

		    moveChart
		        .renderArea(true)
		        .width(990)
		        .height(200)
		        .transitionDuration(1000)
		        .margins({top: 30, right: 50, bottom: 25, left: 40})
		        .dimension(moveMonths)
		        .mouseZoomable(true)
		        .rangeChart(volumeChart)
		        .x(d3.time.scale().domain([new Date(2010, 0, 1), Date.now()]))
		        .round(d3.time.month.round)
		        .xUnits(d3.time.months)
		        .elasticY(true)
		        .renderHorizontalGridLines(true)
		        .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
		        .brushOn(false)
		        .group(indexAvgByMonthGroup, 'Monthly Index Average')
		        .valueAccessor(function (d) {
		            return d.value.avg;
		        })
		        .stack(monthlyMoveGroup, 'Monthly Index Move', function (d) {
		            return d.value;
		        })
		        .title(function (d) {
		            var value = d.value.avg ? d.value.avg : d.value;
		            if (isNaN(value)) {
		                value = 0;
		            }
		            return dateFormat(d.key) + '\n' + numberFormat(value);
		        });

		    volumeChart.width(990)
		        .height(40)
		        .margins({top: 0, right: 50, bottom: 20, left: 40})
		        .dimension(moveMonths)
		        .group(volumeByMonthGroup)
		        .centerBar(true)
		        .gap(1)
		        .x(d3.time.scale().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
		        .round(d3.time.month.round)
		        .alwaysUseRounding(true)
		        .xUnits(d3.time.months);

		    dc.dataCount('.dc-data-count')
		        .dimension(ndx)
		        .group(all)
		        .html({
		            some:'<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
		                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'\'>Reset All</a>',
		            all:'All records selected. Please click on the graph to apply filters.'
		        });

		    dc.dataTable('.dc-data-table')
		        .dimension(dateDimension)
		        .group(function (d) {
		            var format = d3.format('02d');
		            return d.dd.getFullYear() + '/' + format((d.dd.getMonth() + 1));
		        })
		        .size(10)
		        .columns([
		            'date', 
		            'Low', 
		            'High',
		            {
		                label: 'Change',
		                format: function (d) {
		                    return numberFormat(d.High - d.Low);
		                }
		            },
		            'volume' 
		        ])
		        .sortBy(function (d) {
		            return d.dd;
		        })
		        .order(d3.ascending)
		        .on('renderlet', function (table) {
		            table.selectAll('.dc-table-group').classed('info', true);
		        });

		    dc.renderAll();  // WW: Comment back in to show all charts

		});

		d3.selectAll('#version').text(dc.version);

});