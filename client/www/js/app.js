// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('FoodKeeperApp', ['ionic', 'ui.router', 'underscore', 'ionic-timepicker', 'ionic-datepicker']);

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

/*

myApp.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(5);

  // note that you can also chain configs
  $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
});
 */

// Configuration
app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
    
    $ionicConfigProvider.views.forwardCache(true);
    
    $ionicConfigProvider.views.transition('none');

    // note that you can also chain configs
    $ionicConfigProvider.backButton.text('חזור').icon('ion-chevron-right');
    
    //$ionicConfigProvider.views.swipeBackEnabled(false);
    
    $ionicConfigProvider.navBar.alignTitle('center');
    
    // Sign in - Initial display
    $stateProvider.state('sign_in', {
        url: '/',
        templateUrl: 'html/signIn.html',
        controller: 'signInController'
    })
    .state('upload_post', {
        url: '/uploadPost',
        templateUrl: 'html/postProducts.html',
        controller: 'uploadPostController'
    })
    .state('delivery_details', {
        url: '/deliveryDetails',
        templateUrl: 'html/deliveryDetails.html',
        controller: 'deliveryDetailsController'
    })
    .state('collect', {
        url: '/collect',
        templateUrl: 'html/collectWall.html',
        controller: 'collectWallController'
    })
    .state('welcome', {
        url: '/welcome',
        templateUrl: 'html/welcomeScreen.html',
        controller: 'welcomeController'
    })
    .state('sign_up', {
        url: '/signUp',
        templateUrl: 'html/signUp.html',
        controller: 'signUpController'
    })
    .state('my_posts', {
        url:'/myPosts',
        templateUrl: 'html/myPosts.html',
        controller: 'myPostsController',
        cache: false
    });

    $urlRouterProvider.otherwise('/');
    
    //$ionicConfigProvider.views.maxCache(0);
    
    
    

    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                var authText = "";
                if (window.localStorage.userToken) {
                     authText = 'Bearer ' + window.localStorage.userToken;
                     
                     if (window.localStorage.activatorToken) {
                         authText += ' ' + window.localStorage.activatorToken;
                     }
                }
                
                if (authText !== "") {
                    config.headers.Authorization = authText;
                }
                return config;
          },
          'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/');
                }
                return $q.reject(response);
            }
        };
    }]);
});
