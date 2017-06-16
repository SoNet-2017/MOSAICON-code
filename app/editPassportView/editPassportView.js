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

    .controller('editPassportCtrl', ['$scope', '$rootScope', 'UsersChatService', 'Auth','$firebaseStorage', '$location', 'Users', '$firebaseAuth', function($scope, $rootScope, UsersChatService, Auth, $firebaseStorage, $location, Users, $firebaseAuth) {
        $scope.dati={};
        var userId = $firebaseAuth().$getAuth().uid;
        //set the variable that is used in the main template to show the active button
        $rootScope.dati.currentView = "passport";
        $scope.dati.user = UsersChatService.getUserInfo(userId);
        var path = $scope.dati.user.img_url;
        $scope.fileToUpload = null;
        $scope.dati.user.imgPath= "";
        $rootScope.dati.currentView = "passport";

            $scope.updatePassport = function() {

                                if ($scope.fileToUpload != null) {

                                    //get the name of the file
                                    var fileName = $scope.fileToUpload.name;
                                    //specify the path in which the file should be saved on firebase
                                    var storageRef = firebase.storage().ref("passportImg/" + fileName);
                                    $scope.storage = $firebaseStorage(storageRef);
                                    var uploadTask = $scope.storage.$put($scope.fileToUpload);
                                    uploadTask.$complete(function (snapshot) {
                                        $scope.dati.user.imgPath = snapshot.downloadURL;

                                        Users.updateUserInfo(userId, $scope.dati.user.name, $scope.dati.user.surname, $scope.dati.user.nickname, $scope.dati.user.nascita, $scope.dati.user.citta, $scope.dati.user.infos, $scope.dati.user.imgPath);

                                    });
                                }

                                else {

                                    Users.updateUserInfo(userId, $scope.dati.user.name, $scope.dati.user.surname, $scope.dati.user.nickname, $scope.dati.user.nascita, $scope.dati.user.citta, $scope.dati.user.infos, path);

                                }


                $location.path("/passportView");

            };
            var ctrl = this;
            ctrl.onChange = function onChange(fileList) {
                $scope.fileToUpload = fileList[0];
            };


    }]);
