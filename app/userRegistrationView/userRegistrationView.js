'use strict';

angular.module('myApp.userRegistrationView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/userRegistration', {
    templateUrl: 'userRegistrationView/userRegistrationView.html',
    controller: 'UserRegistrationCtrl'
  });
}])

.controller('UserRegistrationCtrl', ['$scope', '$rootScope', 'Auth', '$firebaseStorage', '$location', 'Users', function($scope, $rootScope, Auth, $firebaseStorage, $location, Users) {
    $scope.user={};
    //set the variable that is used in the main template to show the active button
    $scope.fileToUpload = null;
    $scope.user.imgPath= "";
    $rootScope.dati.currentView = "home";
    $scope.signUp = function() {
        //check if the second password is equal to the first one
        if ($scope.user.password!= '' && $scope.user.password === $scope.user.password2) {
            //create a new user with specified email and password
            Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
                .then(function (firebaseUser) {
                    //after creating the user, we will perform a login and then the new information will be saved in the database
                    //(the reason is that we cannot write in the database if we are not logged in ... it is not the best way of doing it but it is ok for our prototype)
                    Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(internalFirebaseUser) {
                        var userId = internalFirebaseUser.uid;




                        if ($scope.fileToUpload != null) {

                            //get the name of the file
                            var fileName = $scope.fileToUpload.name;
                            //specify the path in which the file should be saved on firebase
                            var storageRef = firebase.storage().ref("passportImg/" + fileName);
                            $scope.storage = $firebaseStorage(storageRef);
                            var uploadTask = $scope.storage.$put($scope.fileToUpload);
                            uploadTask.$complete(function (snapshot) {
                                $scope.user.imgPath = snapshot.downloadURL;
                                Users.registerNewUserInfo(userId, $scope.user.name, $scope.user.surname, $scope.user.email, $scope.user.nickname, $scope.user.nascita, $scope.user.citta, $scope.user.infos, $scope.user.imgPath);

                                Users.registerLogin(userId, $scope.user.email);
                                // login successful: redirect
                                $location.path("/homeView");

                            });
                        }


                    }).catch(function(error) {
                        $scope.error = error;
                        console.log(error.message);
                    });
                }).catch(function (error) {
                    $scope.error = error;
                    console.log(error.message);
            });
        }
    };
    var ctrl = this;
    ctrl.onChange = function onChange(fileList) {
        $scope.fileToUpload = fileList[0];
    };
}]);