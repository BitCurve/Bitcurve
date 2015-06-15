var app = angular.module('bitcurve');


app.service('homeService', function($http, $q){

var bitCoinData = [];

//GET PRICE
this.getPrice = function(price) {

	var deferred = $q.defer();

	$http({
		method: "GET",
		url: "",
		data: price
	}).then(function(response) {
		deferred.resolve(response.config.data);
	});

	return deferred.promise;

	};	
});