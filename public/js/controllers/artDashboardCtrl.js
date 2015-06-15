(function() {

	angular.module('bitcurve')

	.controller('artDashboardControl', ['$scope','artDashboardService', function($scope, artDashboardService){

		// $scope.$on('reportChange', function(event, data){
		// 	$scope.changeDisplay([data])
		// });
//2
		$scope.getData = function() {
			artDashboardService.getData().then(function(response) {
				response.map()
				//map through response data and populate various arrays

					//price = []
					//minersRevenue = []
					//difficulties = []
					//volume = []
					//transactionFees = []
			});
			//based on the radio selection, the corresponding data type will populate $scope.finalData
		};

		$scope.finalData = ....



	}])//end

	.service('artDashboardService', ['$http', '$q', function($http, $q) {
//1

			this.getData: function() {
				console.log("getting data");
				var deferred = $q.defer();
				//api call 
				//manipulate data object to set up for further manipulation in controller


					deferred.resolve(data)
				return deferred.promise
			};
		};
	}]);

;

})();
