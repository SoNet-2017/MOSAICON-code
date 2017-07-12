/**
 * Created by lucaleli on 09/07/17.
 */
'use strict';

angular.module('myApp.extPassportView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/extPassportView/:passportId', {
            templateUrl: 'extPassportView/extPassportView.html',
            controller: 'extProfileCtrl',
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

    .controller('extProfileCtrl', ['$scope', '$rootScope', 'UsersInfoService', '$routeParams',
        function($scope, $rootScope, UsersInfoService, $routeParams) {
        $scope.dati={};
        //set the variable that is used in the main template to show the active button
        //$rootScope.dati.currentView = "passport";
        $scope.dati.user = UsersInfoService.getUserInfo($routeParams.passportId);

            $scope.dati.user.$loaded().then(function () {
                console.log($scope.dati.user.name);
            });
    }]);