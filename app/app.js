'use strict';

// Initialize the Firebase SDK
var config = {
    apiKey: "AIzaSyBTePOq6_uTH6tq6DUeMdAVpqExtmlac_o",
    authDomain: "mosaicon-ffefe.firebaseapp.com",
    databaseURL: "https://mosaicon-ffefe.firebaseio.com",
    projectId: "mosaicon-ffefe",
    storageBucket: "mosaicon-ffefe.appspot.com"
};
firebase.initializeApp(config);

// Declare app level module which depends on views, and components
angular.module('myApp', [
    "firebase",
    'ngRoute',
    'ngMap',
    'myApp.loginView',
    'myApp.authentication',
    'myApp.users',
    'myApp.calendarView',
    'myApp.notifView',
    'myApp.chatView',
    'myApp.passportView',
    'myApp.userRegistrationView',
    'myApp.fileUpload',
    'myApp.homeView',
    'myApp.searchView',
    'myApp.editPassportView',
    'myApp.calendar',
    'myApp.eventView'

])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/homeView'});
}])
    .run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            $location.path("/loginView");
        }
    });
}])
    .controller('MainCtrl', ['$scope', '$rootScope', '$firebaseAuth', function($scope, $rootScope, $firebaseAuth) {
        //this controller only declares a function to get information about the user status (logged in / out)
        //it is used to show menu buttons only when the user is logged

        //set the variable that is used in the main template to show the active button
        $rootScope.dati = {};
        $rootScope.dati.currentView = 'home';
    $scope.isLogged = function()
    {
        if ($firebaseAuth().$getAuth())
            return true;
        else
            return false;
    }
}]);
