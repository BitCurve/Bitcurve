var app = angular.module('bitcurve');

app.controller('createAccountCtrl', function($scope, $http, $location, $window){

	$scope.addUser = function(){
		$http({
			method: 'POST',
			url: '/api/createAccount',
			data: {
				email: $scope.register.email,
				password: $scope.register.password,
			}
		}).success(function(data){
			$location.path('/#/login')
			$window.sessionStorage.token = data.token;
		}).error(function(data){
			
		});
	}
});