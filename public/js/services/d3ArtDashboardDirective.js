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
//3
				//one data object

				//chart definitions
				var width = 
				var height = 



				//draw chart
				var svg = d3.select(element[0]).append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");






				//update chart function

					//update any axes


					//update main components


			});
		}};
	}]);