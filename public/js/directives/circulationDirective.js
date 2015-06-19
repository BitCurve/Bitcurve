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


      } // end link

    }; // end return

  }]);  // end .directive

})(); // end iffy