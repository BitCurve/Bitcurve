var app = angular.module('bitcurve');

app.controller('whitneyCtrl', function($scope, whitneyService){
	$scope.test = whitneyService.test();
});	// End app.controller