app.controller('myPostsController', ['$scope', '$http', '$state', 'SERVER', '$ionicPlatform', '$ionicHistory',
	function ($scope, $http, $state, SERVER, $ionicPlatform, $ionicHistory) {
        
        $scope.myPosts = [];
        $scope.noPostsMessage = "";
        
        $scope.goToUploadPost = function () {
            $state.go('upload_post');
        };
        
        $scope.loadPosts = function () {
            
            $http({
                method: 'GET',
				url: SERVER.adress + '/getPostsOfActivator',
                params: {   
                    activatorId: window.localStorage.activatorToken
                }
            }).then(function (response) {
                
                // Checking thechnical error
                if (response.wasError) {
                    // TODO: Handle techincal error 
                } else if (response.data.result) {
                    $scope.myPosts = response.data.result;
                    $scope.noPostsMessage = "עוד לא העלית פוסטים";
                } else {
                    // Youre fucked
                }
            });
        };
        
        $scope.loadPosts();
        
    }]);