'use strict';

angular.module('myApp.editPassportView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/editPassportView', {
            templateUrl: 'editPassportView/editPassportView.html',
            controller: 'editPassportCtrl',
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

    .controller('editPassportCtrl', ['$scope', '$rootScope', 'UsersInfoService', 'Auth','$firebaseStorage', '$location', 'Users', '$firebaseAuth',
        function($scope, $rootScope, UsersInfoService, Auth, $firebaseStorage, $location, Users, $firebaseAuth) {
        $scope.dati={};
        var userId = $firebaseAuth().$getAuth().uid;
        //set the variable that is used in the main template to show the active button
        $rootScope.dati.currentView = "passport";
        $scope.dati.user = UsersInfoService.getUserInfo(userId);
        $scope.fileToUpload = null;
        $scope.dati.user.imgPath= "";
        $rootScope.dati.currentView = "passport";

            $scope.updatePassport = function() {

                if ($scope.dati.user.name !== "" && $scope.dati.user.surname !== null && $scope.dati.user.email !== null && $scope.dati.user.nickname !== null && $scope.dati.user.age !== null && $scope.dati.user.citta !== null && $scope.dati.user.infos !== null) {

                    if ($scope.fileToUpload != null) {

                        //get the name of the file
                        var fileName = $scope.fileToUpload.name;
                        //specify the path in which the file should be saved on firebase
                        var storageRef = firebase.storage().ref("passportImg/" + fileName);
                        $scope.storage = $firebaseStorage(storageRef);
                        var uploadTask = $scope.storage.$put($scope.fileToUpload);
                        uploadTask.$complete(function (snapshot) {
                            $scope.dati.user.imgPath = snapshot.downloadURL;

                            Users.updateUserInfo(userId, $scope.dati.user.name, $scope.dati.user.surname, $scope.dati.user.nickname, $scope.dati.user.age, $scope.dati.user.citta, $scope.dati.user.infos, $scope.dati.user.imgPath);
                            $location.path("/passportView");
                        });
                    }


                    else {

                        Users.updateUserInfo_noPic(userId, $scope.dati.user.name, $scope.dati.user.surname, $scope.dati.user.nickname, $scope.dati.user.age, $scope.dati.user.citta, $scope.dati.user.infos);
                        $location.path("/passportView");
                    }
                }

                else {

                    $scope.dati.feedback = "please fill every field of text"

                }


            };
            var ctrl = this;
            ctrl.onChange = function onChange(fileList) {
                $scope.fileToUpload = fileList[0];
            };


    }]);
