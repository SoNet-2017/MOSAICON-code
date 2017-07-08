'use strict';

angular.module('myApp.calendarView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/calendarView', {
            templateUrl: 'calendarView/calendarView.html',
            controller: 'calendarViewCtrl',
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
    .controller('calendarViewCtrl', ['$scope', '$rootScope', '$filter', '$routeParams', 'currentAuth','$firebaseObject', '$firebaseArray', 'calendarService',
        function($scope, $rootScope, $filter, $routeParams, currentAuth, $firebaseObject, $firebaseArray, calendarService) {
            $scope.dati = {};
            //set the variable that is used in the main template to show the active button
            $rootScope.dati.currentView = "calendar";
            //get the list of all the users registered to our application
            $scope.dati.userId = currentAuth.uid;


           /* // ---- PER DATAPICKER -----
            $scope.myDate = new Date();

            $scope.minimoDate = new Date(
                $scope.myDate.getFullYear(),
                $scope.myDate.getMonth(),
                $scope.myDate.getDate()
            );

            $scope.maxDate = new Date(
                $scope.myDate.getFullYear(),
                $scope.myDate.getMonth() + 5,
                $scope.myDate.getDate()
            );

            $scope.onlyWeekendsPredicate = function(date) {
                var day = date.getDay();
                return day === 0 || day === 6;
            };

            this.isOpen = false;

            // ------------------------

            // ---- PER TIMEPICKER -----
            $scope.oraInizio = new Date();
            $scope.oraFine = new Date();

            $scope.hstep = 1;
            $scope.mstep = 1;
            // -------------------------
*/

            $scope.day = moment();


            $scope.allEvents = {};
            $scope.allEvents.elencoEventi = calendarService.getAllEvents();

            //$scope.event = {};

            $scope.servizio = calendarService;

            $scope.selectedEvent = {};

            $scope.viewEvento = function(id) {
                $scope.selectedEvent = calendarService.getEventInfo(id);
                console.log($scope.day);
            };

            //$scope.t = {};

        }]);