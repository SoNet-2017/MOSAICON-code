/**
 * Created by Ronk1 on 14/06/17.
 */
'use strict';

angular.module('myApp.notifView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/notifView', {
            templateUrl: 'notifView/notifView.html',
            controller: 'notifCtrl',
            resolve: {
                // controller will not be loaded until $requireSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                    // $requireSignIn returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $routeChangeError (see above)
                    return Auth.$requireSignIn();
                }]

            }
        })
    }])

    .controller('notifCtrl', ['$scope', '$rootScope', 'currentAuth', '$firebaseAuth', '$location', function($scope, $rootScope, currentAuth, $firebaseAuth, $location) {
        $scope.dati={};
        //set the variable that is used in the main template to show the active button
        $rootScope.dati.currentView = "notif";

            $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
                if (firebaseUser) {
                    console.log("User is yet signed in as:", firebaseUser.uid);
                } else {
                    $location.path("/loginView");
                }
            });
    }]);