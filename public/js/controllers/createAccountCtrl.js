var app = angular.module('bitcurve');

app.controller('createAccountCtrl', function($scope, $http, $q, $location, $window){

	$scope.addUser = function(){
		$http({
			method: 'POST',
			url: '/api/createAccount',
			data: {
				email: $scope.email,
				password: $scope.password,
			}
		}).success(function(data){
			$location.path('#/login')
			$window.sessionStorage.token = data.token;
		}).error(function(data){
			
		});
	}
});