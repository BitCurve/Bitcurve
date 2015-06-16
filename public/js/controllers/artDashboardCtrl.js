(function() {

	angular.module('bitcurve')
		.controller('artDashboardCtrl', ['$scope','artDashboardService', function($scope, artDashboardService){
			var dataObj = {};
			var averageNumberOfTransactionsPerBlock = [];
			var dailyMinersRevenue = [];
			var date = [];
			var day = [];
			var difficulty = [];
			var month = [];
			var numberofUniqueBitcoinAddresses = [];
			var price = [];
			var totalCirculation = [];
			var totalOutputVolumeValue = [];
			var totalTransactionFees = [];
			var year = [];
			var id = [];

			// $scope.$on('dataChange', function(event, data){
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
					console.log("ctrl response", response);
					dataObj = {
						
					}
					response.map(function(res){
						averageNumberOfTransactionsPerBlock.push(res.averageNumberOfTransactionsPerBlock);
						dailyMinersRevenue.push(res.dailyMinersRevenue);
						date.push(res.date);
						day.push(res.day);
						difficulty.push(res.difficulty);
						month.push(res.month);
						numberofUniqueBitcoinAddresses.push(res.numberofUniqueBitcoinAddresses);
						price.push(res.price);
						totalCirculation.push(res.totalCirculation);
						totalOutputVolumeValue.push(res.totalOutputVolumeValue);
						totalTransactionFees.push(res.totalTransactionFees);
						year.push(res.year);
						id.push(res.id);
					});
					console.log('averageNumberOfTransactionsPerBlock', averageNumberOfTransactionsPerBlock);
					// console.log('dailyMinersRevenue', dailyMinersRevenue);
					// console.log('date', date);
					// console.log('day', day);
					// console.log('difficulty', difficulty);
					// console.log('month', month);
					// console.log('numberofUniqueBitcoinAddresses', numberofUniqueBitcoinAddresses);
					// console.log('price', price);
					// console.log('totalCirculation', totalCirculation);
					// console.log('totalOutputVolumeValue', totalOutputVolumeValue);
					// console.log('totalTransactionFees', totalTransactionFees);
					// console.log('year', year);
					// console.log('id', id);
				});
				
				//based on the radio selection, the corresponding data type will populate $scope.finalData
			};
			$scope.getData();

			$scope.finalData = function(dataSelection){
				// console.log("dataSelection", dataSelection);
				var userSelect = undefined;
				for (var key in dataSelection) {
					userSelect = dataSelection[key];
				}
				console.log("userSelect", userSelect);
				switch(userSelect) {
					case "averageNumberOfTransactionsPerBlock" :
						console.log("hey averageNumberOfTransactionsPerBlock");
						artDashboardService.userDataSelection(averageNumberOfTransactionsPerBlock);
						// Send/return averageNumberOfTransactionsPerBlock (array) to d3ArtDashboardDirective.js
						// return averageNumberOfTransactionsPerBlock
						break;
					case "dailyMinersRevenue" :
						console.log("hey dailyMinersRevenue");
						artDashboardService.userDataSelection(dailyMinersRevenue);
						break;
					case "difficulty" :
						console.log("hey difficulty");
						artDashboardService.userDataSelection(difficulty);
						break;
					case "numberofUniqueBitcoinAddresses" :
						console.log("hey numberofUniqueBitcoinAddresses");
						artDashboardService.userDataSelection(numberofUniqueBitcoinAddresses);
						break;
					case "price" :
						console.log("hey price");
						artDashboardService.userDataSelection(price);
						break;
					case "totalCirculation" :
						console.log("hey totalCirculation");
						artDashboardService.userDataSelection(totalCirculation);
						break;
					case "totalOutputVolumeValue" :
						console.log("hey totalOutputVolumeValue");
						artDashboardService.userDataSelection(totalOutputVolumeValue);
						break;
					case "totalTransactionFees" :
						console.log("hey totalTransactionFees");
						artDashboardService.userDataSelection(totalTransactionFees);
						break;
					default :
						console.log("shoot me now");
				}

			}	// End $scope.finalData

		}])//end controller

})();
