var app = angular.module('bitcurve');

app.controller('createAccountCtrl', function($scope, $http, $location, $window, ngToast){

	$scope.addUser = function(){
		$http({
			method: 'POST',
			url: '/api/createAccount',
			data: {
				email: $scope.register.email,
				password: $scope.register.password,
			}
		}).success(function(data){
			$location.path('/login')
			$window.sessionStorage.token = data.token;
			ngToast.create({
				className: 'success',
				content: '<strong>Account Created! </strong>Please sign in'
			})
		}).error(function(data){
			console.log("Error: "+ angular.toJson(data));
			ngToast.create({
				className: 'danger',
				content: '<strong>Error! </strong>Problem creating account.'
			})
		});
	}
});