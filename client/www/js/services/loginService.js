app.factory("loginService", ['$http', 'SERVER', function ($http, SERVER) {
    
    var loginUser = function (username, password, callback) {
        $http({
            method: 'POST',
            url: SERVER.adress + '/signIn',
            params: {
                email : username,
                password : password
            }
        }).then(function (response) {
            
            var wasError = {
                tech: false,
                login: false
            };
            
            // Checking if sign in approved
            if (response.data.result) {
                
                // Storing token in localstorage
                window.localStorage.userToken = response.data.result.token;
            } else {
                
                // Checking if technical error or login error
                if (response.data.wasError) {
                    wasError.tech = true;
                } else {
                    wasError.login = true;
                }
            }
            
            callback(wasError);
        });    
    };
    
    var logoutCurrentUser = function () {
        
        // Emptying token in localstorage
        window.localStorage.userToken = "";
    };
    
    return {
        loginUser: loginUser,
        logoutCurrentUser: logoutCurrentUser
    };
    
}]);