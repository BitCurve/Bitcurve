// (function() {

<<<<<<< HEAD
// 	angular.module('bitcurve')

// 	.controller('artDashboardControl', ['$scope','artDashboardService', function($scope, artDashboardService){

// 		// $scope.$on('reportChange', function(event, data){
// 		// 	$scope.changeDisplay([data])
// 		// });
// //2
// 		$scope.getData = function() {
// 			artDashboardService.getData().then(function(response) {
// 				response.map()
// 				//map through response data and populate various arrays

// 					//price = []
// 					//minersRevenue = []
// 					//difficulties = []
// 					//volume = []
// 					//transactionFees = []
// 			});
// 			//based on the radio selection, the corresponding data type will populate $scope.finalData
// 		};

// 		$scope.finalData = ....
=======
	angular.module('bitcurve')
		.controller('artDashboardCtrl', ['$scope','artDashboardService', '$rootScope', function($scope, artDashboardService, $rootScope){

			$scope.$on('dataChange', function(event, data){
				$scope.getData([data]);
			});

			var averageNumberOfTransactionsPerBlock = [];
			var transactionsObj = {};
			var dailyMinersRevenue = [];
			var minersObj = {};
			var date = [];
			var day = [];
			var difficulty = [];
			var difficultyObj = {};
			var month = [];
			var numberofUniqueBitcoinAddresses = [];
			var addressesObj = {};
			var price = [];
			var priceObj = {};
			var totalCirculation = [];
			var circulationObj = {};
			var totalOutputVolumeValue = [];
			var outputObj = {};
			var totalTransactionFees = [];
			var feesObj = {};
			var year = [];
			var id = [];
>>>>>>> 731f64c0c4a384a825b3d09a64ee2ca2e770157e

			// $scope.$on('dataChange', function(event, data){
			// 	$scope.changeDisplay([data])
			// });
			$scope.getData = function() {
				artDashboardService.getData().then(function(response) {
					transactionsObj = {};
					response.map(function(res){
						transactionsObj = {
							data: res.averageNumberOfTransactionsPerBlock,
							year: res.year,
							id: res.id
						};
						averageNumberOfTransactionsPerBlock.push(transactionsObj);

						minersObj = {
							data: res.dailyMinersRevenue,
							year: res.year,
							id: res.id
						};
						dailyMinersRevenue.push(minersObj);

<<<<<<< HEAD
// 	}])//end

// 	.service('artDashboardService', ['$http', '$q', function($http, $q) {
// //1

// 			this.getData: function() {
// 				console.log("getting data");
// 				var deferred = $q.defer();
// 				//api call 
// 				//manipulate data object to set up for further manipulation in controller
=======
						difficultyObj = {
							data: res.difficulty,
							year: res.year,
							id: res.id
						};
						difficulty.push(difficultyObj);

						addressesObj = {
							data: res.numberofUniqueBitcoinAddresses,
							year: res.year,
							id: res.id
						};
						numberofUniqueBitcoinAddresses.push(addressesObj);

						priceObj = {
							data: res.price,
							year: res.year,
							id: res.id
						};
						price.push(priceObj);
>>>>>>> 731f64c0c4a384a825b3d09a64ee2ca2e770157e

						circulationObj = {
							data: res.totalCirculation,
							year: res.year,
							id: res.id
						};
						totalCirculation.push(circulationObj);

<<<<<<< HEAD
// 					deferred.resolve(data)
// 				return deferred.promise
// 			};
// 		};
// 	}]);

// ;
=======
						outputObj = {
							data: res.totalOutputVolumeValue,
							year: res.year,
							id: res.id
						};
						totalOutputVolumeValue.push(outputObj);

						feesObj = {
							data: res.totalTransactionFees,
							year: res.year,
							id: res.id
						};
						totalTransactionFees.push(feesObj);
					});
					// console.log('averageNumberOfTransactionsPerBlock', averageNumberOfTransactionsPerBlock);
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
				// console.log("userSelect", userSelect);
				if (userSelect === "averageNumberOfTransactionsPerBlock") {
					// console.log('averageNumberOfTransactionsPerBlock', averageNumberOfTransactionsPerBlock)
					$scope.selectedData = averageNumberOfTransactionsPerBlock;
				}
				else if (userSelect === "dailyMinersRevenue") {
					// console.log('dailyMinersRevenue', dailyMinersRevenue)
					$scope.selectedData = dailyMinersRevenue;
				}
				else if (userSelect === "difficulty") {
					// console.log('difficulty', difficulty)
					$scope.selectedData = difficulty;
				}
				else if (userSelect === "numberofUniqueBitcoinAddresses") {
					// console.log('numberofUniqueBitcoinAddresses', numberofUniqueBitcoinAddresses)
					$scope.selectedData = numberofUniqueBitcoinAddresses;
				}
				else if (userSelect === "price") {
					// console.log('price', price)
					$scope.selectedData = price;
				}
				else if (userSelect === "totalCirculation") {
					// console.log('totalCirculation', totalCirculation)
					$scope.selectedData = totalCirculation;
				}
				else if (userSelect === "totalOutputVolumeValue") {
					// console.log('totalOutputVolumeValue', totalOutputVolumeValue)
					$scope.selectedData = totalOutputVolumeValue;
				}
				else if (userSelect === "totalTransactionFees") {
					// console.log('totalTransactionFees', totalTransactionFees)
					$scope.selectedData = totalTransactionFees;
				}
				// console.log("selData", $scope.selectedData);
				$rootScope.$broadcast('dataChange');
			}	// End $scope.finalData

		}])//end controller
>>>>>>> 731f64c0c4a384a825b3d09a64ee2ca2e770157e

// })();
