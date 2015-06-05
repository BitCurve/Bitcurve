var app = angular.module('bitcurve');

app.controller('dashBoardCtrl', function($scope, dashBoardService){

	
		dashBoardService.getBitcoinPricing($scope).then(function(data){
			console.log(data);
			$scope.bitCoinPricing = data;


		});


})