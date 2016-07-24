app.controller('deliveryDetailsController', [
    '$scope',
	'$http', 
	'$state', 
	'SERVER', 
	'$ionicPopup',
	'$location',
    'uploadPostFactory',
	'ionicDatePicker',
	'ionicTimePicker',
	'generalServices',
	'activatorsService',
    function ($scope, 
			  $http, 
			  $state, 
			  SERVER, 
			  $ionicPopup, 
			  $location, 
			  uploadPostFactory, 
			  ionicDatePicker, 
			  ionicTimePicker, 
			  generalServices, 
			  activatorsService) {
				          
		// Initializing						  
        $scope.post = uploadPostFactory.getPost();
        $scope.deliveryDateString = "";
		activatorsService.getCurrentActivator(function (activator) {
			$scope.post.activatorId = activator._id;
			$scope.post.deliveryAdress = activator.adress;
		});
		
		$scope.goBack = function () {
			uploadPostFactory.setPost($scope.post);
			//$location.path('/uploadPost');
			$state.go('upload_post');
		};
        
    	$scope.showAlert = function(titleText, templateText) {
			var alertPopup = $ionicPopup.alert({
				title: titleText,
				template: templateText
			});

			alertPopup.then(function(res) {
				//$location.path('/welcome');
				$state.go('my_posts');
			});
		};

		$scope.uploadPost = function() {
			
			// Setting time formats
			$scope.post.deliveryDate = new Date($scope.post.deliveryDate).getTime();
			$scope.post.deliveryTimes.startTime = new Date($scope.post.deliveryTimes.startTime).getTime();
			$scope.post.deliveryTimes.endTime = new Date($scope.post.deliveryTimes.endTime).getTime();

			$http({
				method: 'POST',
				url: SERVER.adress + '/uploadPost',
				params: {
					post : $scope.post
				}
			}).then(function (response) {

				// Checking if sign in approved
				if (response.data.result) {
					
					// Alerting that the post was successfully uploaded
					$scope.showAlert('הפוסט הועלה בהצלחה!', 'הוספת קצת צדק לעולם.');
				} else {

					// Alerting that the post was not successfully uploaded
					$scope.showAlert('לא ניתן להעלות את הפוסט', 'אנא נסה שוב מאוחר יותר');
				}

			});
		};
}]);