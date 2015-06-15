
var gainOrLossChart = dc.pieChart('#gain-loss-chart');
var fluctuationChart = dc.barChart('#fluctuation-chart');
var quarterChart = dc.pieChart('#quarter-chart');
var dayOfWeekChart = dc.rowChart('#day-of-week-chart');
var moveChart = dc.lineChart('#monthly-move-chart');
var volumeChart = dc.barChart('#monthly-volume-chart');
var yearlyBubbleChart = dc.bubbleChart('#yearly-bubble-chart');


d3.json('bitcurve2.json', function (data) {
    var dateFormat = d3.time.format('%m/%d/%Y');
    var numberFormat = d3.format('.2f');

    data.forEach(function (d) {
        d.dd = dateFormat.parse(d.date);
        d.month = d3.time.month(d.dd);
        d.high = +d.high; 
        d.low = +d.low;

        d.volume = d.totalOutputVolumeValue;
        d.MinersRevenue = d.dailyMinersRevenue;
        d.transactionsPerBlock = d.averageNumberOfTransactionsPerBlock;
        d.totalCirculation = d.totalCirculation;
    });

    var bitcurve2 = crossfilter(data);
    var all = bitcurve2.groupAll();


    var yearlyDimension = bitcurve2.dimension(function (d) {
        return d3.time.year(d.dd).getFullYear();
    });
  
    var yearlyPerformanceGroup = yearlyDimension.group().reduce(
        function (p, v) {
            ++p.count;
            p.absGain += v.high - v.low;
            p.fluctuation += Math.abs(v.high - v.low);
            p.sumIndex += (v.low + v.high) / 2;
            p.avgIndex = p.sumIndex / p.count;
            p.percentageGain = (p.absGain / p.avgIndex) * 100;
            p.fluctuationPercentage = (p.fluctuation / p.avgIndex) * 100;
            return p;
        },
        function (p, v) {
            --p.count;
            p.absGain -= v.high - v.low;
            p.fluctuation -= Math.abs(v.high - v.low);
            p.sumIndex -= (v.low + v.high) / 2;
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

   
    var dateDimension = bitcurve2.dimension(function (d) {
        return d.dd;
    });


    var moveMonths = bitcurve2.dimension(function (d) {
        return d.month;
    });
   
    var monthlyMoveGroup = moveMonths.group().reduceSum(function (d) {
        return Math.abs(d.high - d.low);
    });
   
    var volumeByMonthGroup = moveMonths.group().reduceSum(function (d) {
        return d.volume / 500000;
    });
    var indexAvgByMonthGroup = moveMonths.group().reduce(
        function (p, v) {
            ++p.days;
            p.total += (v.low + v.high) / 2;
            p.avg = Math.round(p.total / p.days);
            return p;
        },
        function (p, v) {
            --p.days;
            p.total -= (v.low + v.high) / 2;
            p.avg = p.days ? Math.round(p.total / p.days) : 0;
            return p;
        },
        function () {
            return {days: 0, total: 0, avg: 0};
        }
    );

 
    var gainOrLoss = bitcurve2.dimension(function (d) {
        return d.low > d.high ? 'Loss' : 'Gain';
    });
  
    var gainOrLossGroup = gainOrLoss.group();

    
    var fluctuation = bitcurve2.dimension(function (d) {
        return Math.round((d.high - d.low) / d.low * 100);
    });
    var fluctuationGroup = fluctuation.group();

  
    var quarter = bitcurve2.dimension(function (d) {
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
    });
    var quarterGroup = quarter.group().reduceSum(function (d) {
        return d.volume;
    });

   
    var dayOfWeek = bitcurve2.dimension(function (d) {
        var day = d.dd.getDay();
        var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return day + '.' + name[day];
    });
    var dayOfWeekGroup = dayOfWeek.group();

    
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
        .x(d3.time.scale().domain([new Date(2009, 1, 3), new Date(2015, 12, 6)]))
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
        .x(d3.time.scale().domain([new Date(2009, 1, 3), new Date(2015, 12, 6)]))
        .round(d3.time.month.round)
        .alwaysUseRounding(true)
        .xUnits(d3.time.months);

  
    dc.dataCount('.dc-data-count')
        .dimension(bitcurve2)
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
            'low',   
            'high',   
            {
                label: 'Change', 
                format: function (d) {
                    return numberFormat(d.high - d.low);
                }
            },

            'volume',
            'MinersRevenue',
            'transactionsPerBlock',
            'totalCirculation'
        ])

      
        .sortBy(function (d) {
            return d.dd;
        })
      
        .order(d3.ascending)
        .on('renderlet', function (table) {
            table.selectAll('.dc-table-group').classed('info', true);
        });

   
    dc.renderAll();
  

});


d3.selectAll('#version').text(dc.version);