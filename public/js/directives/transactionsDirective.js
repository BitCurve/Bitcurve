(function() {

	angular.module('transactions.directives', [])

	.directive('transactionsData', [function ($location){  
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


      } // end link

    } // end return

  }]);  // end .directive

})(); // end iffy