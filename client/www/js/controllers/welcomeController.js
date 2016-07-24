app.controller('welcomeController', [
	'$scope',
	'$http',
	'$location', 
	'$state', 
	'ROLE_TYPES', 
	'$ionicPopup',
	'SERVER',
	function ($scope, $http, $location, $state, ROLE_TYPES, $ionicPopup, SERVER) {

		$scope.authData = {};

		$scope.authBusiness = function() {

			// Authenticating
			auth(ROLE_TYPES.BUSINESS);
		};

		$scope.authVolunteer = function() {

			// Authenticating
			auth(ROLE_TYPES.VOLUNTEER);
		};

		// Function to authenticate as a role (usage type: business, volunteer..)
		var auth = function (roleType) {

			// Showing popup
			// An elaborate, custom popup
		    var authPopup = $ionicPopup.show({
		    	template:  '<div class="list list-inset">' +
						    	   	'<label class="item item-input">' +
					    	    	'<input type="text" placeholder="' + roleType.displayName + '" ng-model="authData.name">' +
					    	  	'</label>' +
					    	  	'<label class="item item-input">' +
					    	    	'<input type="text" placeholder="קוד" ng-model="authData.code">' + 
					    	  	'</label>' + 
					    	'</div>',
		        title: 'הזדהה כ' + roleType.displayName,
		    	scope: $scope,
		    	buttons: [
		    	  	{ text: 'ביטול' },
		    	  	{
		        		text: '<b>הזדהה</b>',
		        		type: 'button-positive',
		        		onTap: function(e) {
		          			if (!($scope.authData.name && $scope.authData.code )) {

		            			//don't allow the user to close unless he enters wifi password
		            			e.preventDefault();
		          			} else {
				            	return roleType;
				          	}
		        		}
		      		}
		    	]
		  	});

		  	authPopup.then(function(roleType) {
			    
			    if (roleType) {
					
					$scope.authData.type = roleType.id;

			    	$http({
						method: 'POST',
						url: SERVER.adress + '/authActivator',
						params: {
							activator: $scope.authData
						}
					}).then(function(response) {
						
						var message = "";

						if (response.data.result) {

							// Putting activator in localstorage
							window.localStorage.activatorToken = response.data.result._id;

							// Going to upload post
							//$location.path(roleType.url).search({cameFrom: '/welcome'});
							$state.go(roleType.state);

						} else {

							// Checking for technical error
							if (response.data.wasError) {
								message = "אירעה תקלה טכנית";
							} else if (!response.data.result) {
								message = "פרטי בית עסק שגויים";
							}

						    var alertPopup = $ionicPopup.confirm({
						     	title: 'שגיאה!',
						     	template: message,
						     	cancelText: 'ביטול',
						     	okText: 'נסה שנית'
						   	});

						   	alertPopup.then(function(res) {
						   		if (res) {
							     	auth(roleType);
							    }
						    });
						}
					});
			    }
		 	});
		}
	}
]);