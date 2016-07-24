app.controller('signInController', ['$scope', '$http', '$state', 'SERVER', '$location', 'loginService',
	function ($scope, $http, $state, SERVER, $location, loginService) {
		
		if (window.localStorage.userToken) {
			$state.go('welcome');
		}

		$scope.loginUser = {};

		// Validating username and password
		$scope.signIn = function() {

			loginService.loginUser($scope.loginUser.email, $scope.loginUser.password, function (wasError) {
				
				if (!wasError.login && !wasError.tech) {
					
					// Enterring application
					$state.go('welcome');
				} else {
					
					// Displaying error
					$scope.wasError = true;
					$scope.showFooter = true;
					$scope.footerMessage = wasError.tech ? 
											"תקלה טכנית" : 
											"שם משתמש או ססמה אינם נכונים";
				}
			});
		};

		$scope.goToSignup = function () {
			$state.go('sign_up');
			// $location.path('/signUp').search({cameFrom: '/signIn'});
		};	
	}]);