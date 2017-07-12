'use strict';

angular.module('myApp.passportView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/passportView', {
    templateUrl: 'passportView/passportView.html',
    controller: 'userProfileCtrl',
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

.controller('userProfileCtrl', ['$scope', '$rootScope', 'UsersInfoService', 'Users', 'currentAuth', '$firebaseAuth', '$location', 'oneEvent',
    function($scope, $rootScope, UsersInfoService, Users, currentAuth, $firebaseAuth, $location, oneEvent) {
    $scope.dati={};
    //set the variable that is used in the main template to show the active button
    $rootScope.dati.currentView = "passport";
    $scope.dati.user = UsersInfoService.getUserInfo(currentAuth.uid);
    $scope.dati.user_id = currentAuth.uid;
        $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyCyGzdO_rC3i7oXldFLWJmVsDP5MCvBqZs";


        $scope.dati.content = oneEvent.getContent(0);

    // function called when the "logout" button will be pressed
    $scope.logout = function () {
        //save the new status in the database (we do it before the actual logout because we can write in the database only if the user is logged in)
        Users.registerLogout(currentAuth.uid);
        //sign out
        $firebaseAuth().$signOut();
        $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {
                console.log("User is yet signed in as:", firebaseUser.uid);
            } else {
                $location.path("/loginView");
            }
        });
    };
}]);