var app = angular.module('bitcurve');


app.service('whitneyService', function($http, $q){
	this.test = function(){
		console.log("TESTING 123");
	}
});	// End app.service