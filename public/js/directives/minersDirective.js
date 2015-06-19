(function() {

	angular.module('miners.directives', [])

	.directive('minersData', [function ($location){  
		return {
			scope: {
				selectedData: '='
			}, 	// end scope
			restrict: "A",
			// templateUrl: "../templates/dif.html",
			link: function(scope, element, attrs) {


				scope.$watch('selectedData', function(){
					var data = scope.selectedData;
				});	// end scope.$watch

// *********** BEGIN D3 ***********

//http://bl.ocks.org/timelyportfolio/5c136de85de1c2abb6fc


      } // end link

    }; // end return

  }]); // end .directive

})(); // end iffy