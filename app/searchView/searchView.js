/**
 * Created by Ronk1 on 14/06/17.
 */
'use strict';

angular.module('myApp.searchView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/searchView', {
            templateUrl: 'searchView/searchView.html',
            controller: 'searchCtrl',
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

    .controller('searchCtrl', ['$scope', '$rootScope', 'currentAuth', '$firebaseAuth', '$location', 'eventsService', 'userChatService',
        function($scope, $rootScope, currentAuth, $firebaseAuth, $location, eventService, userChatService) {
        $scope.dati={};
        //set the variable that is used in the main template to show the active button
        $rootScope.dati.currentView = "search";
        $scope.dati.events = eventService.getAllEvents();

        $scope.filterClub = function () {
            events.style.display = block;
        };
        $scope.filterClubber = function () {

        };
        $scope.filterDJ = function () {

        };

        $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {
                console.log("User is yet signed in as:", firebaseUser.uid);
            } else {
                $location.path("/loginView");
            }
        });
    }]);