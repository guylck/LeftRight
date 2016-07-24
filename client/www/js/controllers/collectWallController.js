app.controller('collectWallController', ['$scope', '$http', 'SERVER', '$location',
	function($scope, $http, SERVER, $location) {


		$scope.loadWall = function () {
			$http({
				method: 'GET',
				url: SERVER.adress + '/wall',
				params: {}
			}).success(function (response) {
                
                // Checking thechnical error
                if (response.wasError) {
                    // TODO: Handle techincal error 
                } else if (response.result) {
                    $scope.wall = response.result;   
                } else {
                    // Youre fucked
                }
                
                
            }).error(function (response) {
                
            });
		};
        
        $scope.loadWall();
	}
]);