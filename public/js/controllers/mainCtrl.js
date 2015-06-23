var app = angular.module('bitcurve');


app.controller('mainCtrl', function($scope, $window){
	$scope.loggedIn = !!$window.sessionStorage.token;
	$scope.logout = function(){
		delete $window.sessionStorage.token;
		$scope.loggedIn = false;
	};
});