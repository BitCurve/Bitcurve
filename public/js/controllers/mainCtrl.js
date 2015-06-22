var app = angular.module('bitcurve');


app.controller('mainCtrl', function($scope, $window, ngToast){
	$scope.loggedIn = !!$window.sessionStorage.token;
	$scope.logout = function(){
		delete $window.sessionStorage.token;
		$scope.loggedIn = false;
		ngToast.create({
			className: 'success',
			content: '<strong>Success! </strong>You are now logged out.'
		})
	};
});