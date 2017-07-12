'use strict';

//The service implemented in this module will get/save messages sent/received in a chat
angular.module('myApp.users.usersInfoService', [])

    .factory('UsersInfoService', function usersInfoService($firebaseArray, $firebaseObject) {
        return {
            getUserInfo: function(userId) {
                var userRef = firebase.database().ref().child("users").child(userId);
                return $firebaseObject(userRef);
            }
        };
    });