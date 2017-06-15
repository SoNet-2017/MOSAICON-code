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
        }]);