app.directive("postDirective", ["$http", 
	function ($http) {

		 return {
		 	restrict: 'E',
		 	scope: {
		 		post: '=',
		 		readOnly: '='
		 	},
		 	templateUrl: 'html/directives/postDirective.html',
		 	link: function (scope, element, attrs) {
				 
				 scope.dateString = new Date(scope.post.deliveryDate).toLocaleDateString();
				 scope.startTimeString = new Date(scope.post.deliveryTimes.startTime).toLocaleTimeString();
				 scope.endTimeString = new Date(scope.post.deliveryTimes.endTime).toLocaleTimeString();
		 	}
		 };
	}
]);