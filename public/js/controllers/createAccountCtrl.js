var app = angular.module('bitcurve');

app.controller('createAccountCtrl', function($scope, $http, $location, $window, toaster){

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
			toaster.success({title: "Account Created!", body:"Please sign in."});
		}).error(function(data){
			console.log("Error: "+ angular.toJson(data));
			toaster.error({title: "Error!", body:"There was a problem creating your account."});
		});
	}
});