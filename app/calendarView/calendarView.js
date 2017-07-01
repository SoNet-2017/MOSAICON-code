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
    .controller('calendarViewCtrl', ['$scope', '$rootScope', '$routeParams', 'currentAuth',
        function($scope, $rootScope, $routeParams, currentAuth, moment, alert, calendarConfig) {
            $scope.dati = {};
            //set the variable that is used in the main template to show the active button
            $rootScope.dati.currentView = "calendar";
            //get the list of all the users registered to our application
            $scope.dati.userId = currentAuth.uid;

            //$scope.day = moment();

            // datapicker
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

            // -------------------------

            // timepicker
            $scope.oraInizio = new Date();
            $scope.oraFine = new Date();

            $scope.hstep = 1;
            $scope.mstep = 1;
            // -------------------------


        }]);