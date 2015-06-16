(function() {

	angular.module('bitcurve')
		.service('artDashboardService', ['$http', '$q', function($http, $q) {
//1		
		this.getData = function() {
			console.log("getting data");

			var dfd = $q.defer();
			//api call 
			$http({
				method: "GET",
				url: "./data/bitcurve.json" // Change to: '/api/bitcoinJson'
			}).then(function(response) {
				// console.log('service response', response);
				var parsedRes = response.data;
				// console.log('parsedRes', parsedRes);
				var resObj = {};
				var dataArr = [];
				for (var key in parsedRes) {
					resObj = {
						averageNumberOfTransactionsPerBlock: parseInt(parsedRes[key].averageNumberOfTransactionsPerBlock),
						dailyMinersRevenue: parseInt(parsedRes[key].dailyMinersRevenue),
						date: parsedRes[key].date,
						day: parseInt(parsedRes[key].day),
						difficulty: parseInt(parsedRes[key].difficulty),
						month: parseInt(parsedRes[key].month),
						numberofUniqueBitcoinAddresses: parseInt(parsedRes[key].numberofUniqueBitcoinAddresses),
						price: parseInt(parsedRes[key].price),
						totalCirculation: parseInt(parsedRes[key].totalCirculation),
						totalOutputVolumeValue: parseFloat(parsedRes[key].totalOutputVolumeValue),
						totalTransactionFees: parseFloat(parsedRes[key].totalTransactionFees),
						year: parseInt(parsedRes[key].year),
						id: parseInt(parsedRes[key].month + parsedRes[key].day + parsedRes[key].year)
					}
					dataArr.push(resObj);
				}
				// console.log("dataArr", dataArr);
				dfd.resolve(dataArr);
			});
			//manipulate data object to set up for further manipulation in controller

		this.userDataSelection = function(dataSelection) {
			// console.log("dataSelection", dataSelection);
		
		}

		return dfd.promise
		};
	}]);

})();




