(function() {

	angular.module('bitcurve')
		.controller('artDashboardCtrl', ['$scope','artDashboardService', function($scope, artDashboardService){

			// $scope.$on('reportChange', function(event, data){
			// 	$scope.changeDisplay([data])
			// });
	//2
			$scope.getData = function() {
				artDashboardService.getData().then(function(response) {
					//map through response data and populate various arrays

						//price = []
						//minersRevenue = []
						//difficulties = []
						//volume = []
						//transactionFees = []
					// console.log("ctrl response", response);
					$scope.averageNumberOfTransactionsPerBlock = [];
					$scope.dailyMinersRevenue = [];
					$scope.date = [];
					$scope.day = [];
					$scope.difficulty = [];
					$scope.month = [];
					$scope.numberofUniqueBitcoinAddresses = [];
					$scope.price = [];
					$scope.totalCirculation = [];
					$scope.totalOutputVolumeValue = [];
					$scope.totalTransactionFees = [];
					$scope.year = [];
					$scope.id = [];

					response.map(function(res){
						$scope.averageNumberOfTransactionsPerBlock.push(res.averageNumberOfTransactionsPerBlock);
						$scope.dailyMinersRevenue.push(res.dailyMinersRevenue);
						$scope.date.push(res.date);
						$scope.day.push(res.day);
						$scope.difficulty.push(res.difficulty);
						$scope.month.push(res.month);
						$scope.numberofUniqueBitcoinAddresses.push(res.numberofUniqueBitcoinAddresses);
						$scope.price.push(res.price);
						$scope.totalCirculation.push(res.totalCirculation);
						$scope.totalOutputVolumeValue.push(res.totalOutputVolumeValue);
						$scope.totalTransactionFees.push(res.totalTransactionFees);
						$scope.year.push(res.year);
						$scope.id.push(res.id);
					});
					console.log('$scope.averageNumberOfTransactionsPerBlock', $scope.averageNumberOfTransactionsPerBlock);
					console.log('$scope.dailyMinersRevenue', $scope.dailyMinersRevenue);
					console.log('$scope.date', $scope.date);
					console.log('$scope.day', $scope.day);
					console.log('$scope.difficulty', $scope.difficulty);
					console.log('$scope.month', $scope.month);
					console.log('$scope.numberofUniqueBitcoinAddresses', $scope.numberofUniqueBitcoinAddresses);
					console.log('$scope.price', $scope.price);
					console.log('$scope.totalCirculation', $scope.totalCirculation);
					console.log('$scope.totalOutputVolumeValue', $scope.totalOutputVolumeValue);
					console.log('$scope.totalTransactionFees', $scope.totalTransactionFees);
					console.log('$scope.year', $scope.year);
					console.log('$scope.id', $scope.id);
				});
				
				//based on the radio selection, the corresponding data type will populate $scope.finalData
			};
			$scope.getData();

			//$scope.finalData = ....

		}])//end controller

})();
