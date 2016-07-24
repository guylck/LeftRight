app.factory("activatorsService", ['$http', 'SERVER', function ($http, SERVER) {
    
    var getCurrentActivator = function (callback) {
        
        if (!this.currentActivator) {
            
            $http({
				method: 'GET',
				url: SERVER.adress + '/getActivatorById',
				params: {
					activatorId : window.localStorage.activatorToken
				}
            }).then(function (response) {
                this.currentActivator = response.data.result;
                callback(this.currentActivator);
            });
        } else {
            callback(this.currentActivator);
        }
    };
    
    var logoutActivator = function () {
        
        // Emptying activator token
		window.localStorage.activatorToken = "";
    };
    
    return {
        getCurrentActivator: getCurrentActivator,
        logoutActivator: logoutActivator
    };
    
}]);