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

    .controller('searchCtrl', ['$scope', '$rootScope', 'currentAuth', '$firebaseAuth', '$location', 'Events', 'UserList',
        function($scope, $rootScope, currentAuth, $firebaseAuth, $location, Events, UserList) {
        $scope.dati={};
        //set the variable that is used in the main template to show the active button
        $rootScope.dati.currentView = "search";
        $scope.dati.events = Events.getData();
        $scope.dati.users = UserList.getListOfUsers();

        $('button.tablink').on('click', function(){
            $('button.tablink').removeClass('selected');
            $(this).addClass('selected');
        });

        /*
        $scope.filterClub = function () {
            events.style.display = block;
        };
        $scope.filterClubber = function () {

        };
        $scope.filterDJ = function () {

        };*/

        $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {
                console.log("User is yet signed in as:", firebaseUser.uid);
            } else {
                $location.path("/loginView");
            }
        });
    }]);

function showEvent() {
    var eventGrid = document.getElementsByClassName("eventGrid");
    var clubbersGrid = document.getElementsByClassName("userGrid");
    //var DJsGrid = document.getElementById("superuserGrid");
    for (var i=0; i<eventGrid.length; i++) {
        eventGrid[i].style.display = "block";
    }
    for (var j=0; j<clubbersGrid.length; j++) {
        clubbersGrid[j].style.display = "none";
    }
}

function showClubbers() {
    var eventGrid = document.getElementsByClassName("eventGrid");
    var clubbersGrid = document.getElementsByClassName("userGrid");
    for (var i=0; i<eventGrid.length; i++) {
        eventGrid[i].style.display = "none";
    }
    for (var j=0; j<clubbersGrid.length; j++) {
        clubbersGrid[j].style.display = "block";
    }
}

function showAll() {
    var eventGrid = document.getElementsByClassName("eventGrid");
    var clubbersGrid = document.getElementsByClassName("userGrid");
    //var DJsGrid = document.getElementById("superuserGrid");
    for (var i=0; i<eventGrid.length; i++) {
        eventGrid[i].style.display = "block";
    }
    for (var j=0; j<clubbersGrid.length; j++) {
        clubbersGrid[j].style.display = "block";
    }
}

function showDJs() {
    var eventGrid = document.getElementsByClassName("eventGrid");
    var clubbersGrid = document.getElementsByClassName("userGrid");
    //var DJsGrid = document.getElementById("superuserGrid");
    for (var i=0; i<eventGrid.length; i++) {
        eventGrid[i].style.display = "none";
    }
    for (var j=0; j<clubbersGrid.length; j++) {
        clubbersGrid[j].style.display = "none";
    }
}

function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}