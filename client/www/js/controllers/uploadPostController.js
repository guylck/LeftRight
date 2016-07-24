app.controller('uploadPostController', [
	'$scope',
	'$state', 
	'$location',
	'uploadPostFactory',
	function ($scope, $state, $location, uploadPostFactory) {

		$scope.post = uploadPostFactory.getPost();
		$scope.products = $scope.post && $scope.post.products? $scope.post.products : [];
		
		$scope.goToDeliveryDetails = function () {
			
			if ($scope.products.length > 0) {
				$scope.post.products = $scope.products;
				uploadPostFactory.setPost($scope.post);
				
				//$location.path('/deliveryDetails').search({cameFrom: '/uploadPost'});
				$state.go('delivery_details');
			} else {
				// TODO: Message that user cannot post without products
			}
		};
	}
]);