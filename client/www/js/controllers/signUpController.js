//var app = angular.module('FoodKeeperApp', ['ionic']);

app.controller('signUpController', ['$scope', '$http', '$location', '$state', 'SERVER', '$ionicPlatform', '$ionicHistory',
	function ($scope, $http, $location, $state, SERVER, $ionicPlatform, $ionicHistory) {

		$scope.user = {};
		$scope.wasError = false;
		$scope.errMessage = "";

		$scope.goBack = function () {
			$location.path($location.search().cameFrom);
			// var c = $ionicHistory;
			// $state.go('sign_in');
			
			
		};

		$scope.signUp = function() {

			$http({
				method: 'POST',
				url: SERVER.adress + '/signUp',
				params: {user : $scope.user}
			}).then(function (response) {

				// Checking TECH error
				if (response.data.wasError) {
					scope.wasError = true;
					$scope.errMessage = "אירעב תקלה טכנית";
				}

				// Checking if there was an error - False value will indicate
				$scope.wasError = !response.data.result;

				if ($scope.wasError) {
					
					// Handle error
					$scope.errMessage = "כתובת אימייל זו כבר קיימת במערכת, אנא השתמש באחרת";
				} else {

					// Going back to login page
					$state.go('sign_in');
					//$location.path('/signIn');
					// TODO: broadcast that user was sign up - So i can show message in login page
				}
			});
		};
	}
]);