var app = angular.module('bitcurve');


app.controller('loginCtrl', function($scope, $http, $window, $rootScope){
	$scope.loggedIn = !!$window.sessionStorage.token;
	$scope.message = '';
	$scope.logout = function(){
		delete $window.sessionStorage.token;
		$scope.loggedIn = false;
	};
	$scope.login = function(){
		$http({
			method: 'POST',
			url: '/api/login',
			data: {
				email: $scope.login.email,
				password: $scope.login.password,
			}
		}).success(function(data, status, headers, config){
			$window.sessionStorage.token = data.token;
        	$scope.loggedIn = true;
        	$location.path('/analyticsDashboard')
        	console.log("success")
		}).error(function(data, status, headers, config){
			$scope.message = "Error: Invalid username or password";
			delete $window.sessionStorage.token;
			$scope.loggedIn = false;
			console.log("failure")
		})
	};
});


