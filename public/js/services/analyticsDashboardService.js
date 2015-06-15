var app = angular.module('bitcurve');


app.service('analyticsDashboardService', function($http, $q){
 var bitCoinData = [];

	var deferred = $q.defer();
	
this.getBitcoinPricing = function(){
		// $http.get('https://api.bitcoinaverage.com/history/USD/per_day_all_time_history.csv')
		$http.get('data/bitcurve2.json')

 
	.success(function(data){
		// console.log(data)
	

		// var lines=data.split("\n");

		// var result = [];

		// var headers=lines[0].split(",");

		// for(var i = 1; i < lines.length; i++){

		// 	var obj = {};
		// 	var currentline=lines[i].split(",");

		// 	for(var j = 0; j < headers.length; j++){
		// 		obj[headers[j]] = currentline[j];
		// 	}
		// 	result.push(obj);
		// }
		// for(var i in result){
		// 	bitCoinData.push({
		// 		Date: result[i].datetime,
		// 		High: result[i].high,
		// 		Low: result[i].low,
		// 		// Close: result[i].Close,
		// 		Average: result[i].average,
		// 		Volume: result[i].volume
		// 	});
		// }
		// result = bitCoinData;
		// console.log("result", result)
		bitCoinData = data;
		deferred.resolve(bitCoinData);

	});
	return deferred.promise;	
};


});
	    
	    	
  