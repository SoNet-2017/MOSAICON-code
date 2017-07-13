/**
 * Created by Ronk1 on 14/06/17.
 */
'use strict';

angular.module('myApp.searchView', ['ngRoute', 'myApp.events', 'myApp.users'])

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

    .controller('searchCtrl', ['$scope', '$rootScope', 'currentAuth', '$firebaseAuth', '$location', 'Events', 'UserList', '$routeParams',
        function($scope, $rootScope, currentAuth, $firebaseAuth, $location, Events, UserList, $routeParams) {

        $scope.dati={};

        $rootScope.dati.currentView = "search";
        $scope.dati.events = Events.getData();
        $scope.dati.users = UserList.getListOfUsers();

        var user_id = firebase.auth().currentUser.uid;
        $scope.dati.id = user_id;
        var event_id = $routeParams.eventId;

        $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {
                console.log("User is yet signed in as:", firebaseUser.uid);
            } else {
                $location.path("/loginView");
            }
        });

        // FILTER FUNCTIONS
        $('button.tablink').on('click', function(){
            $('button.tablink').removeClass('selected');
            $(this).addClass('selected');
        });

        $scope.showEvent = function() {
            var eventGrid = document.getElementsByClassName("eventGrid");
            var clubbersGrid = document.getElementsByClassName("userGrid");
            //var DJsGrid = document.getElementById("superuserGrid");
            for (var i=0; i<eventGrid.length; i++) {
                eventGrid[i].style.display = "block";
            }
            for (var j=0; j<clubbersGrid.length; j++) {
                clubbersGrid[j].style.display = "none";
            }
        };

        $scope.showClubbers = function() {
            var eventGrid = document.getElementsByClassName("eventGrid");
            var clubbersGrid = document.getElementsByClassName("userGrid");
            for (var i=0; i<eventGrid.length; i++) {
                eventGrid[i].style.display = "none";
            }
            for (var j=0; j<clubbersGrid.length; j++) {
                clubbersGrid[j].style.display = "block";
            }
        };

        $scope.showAll = function() {
            var eventGrid = document.getElementsByClassName("eventGrid");
            var clubbersGrid = document.getElementsByClassName("userGrid");
            //var DJsGrid = document.getElementById("superuserGrid");
            for (var i=0; i<eventGrid.length; i++) {
                eventGrid[i].style.display = "block";
            }
            for (var j=0; j<clubbersGrid.length; j++) {
                clubbersGrid[j].style.display = "block";
            }
        };

        $scope.showDJs = function() {
            var eventGrid = document.getElementsByClassName("eventGrid");
            var clubbersGrid = document.getElementsByClassName("userGrid");
            //var DJsGrid = document.getElementById("superuserGrid");
            for (var i=0; i<eventGrid.length; i++) {
                eventGrid[i].style.display = "none";
            }
            for (var j=0; j<clubbersGrid.length; j++) {
                clubbersGrid[j].style.display = "none";
            }
        };
    }]);