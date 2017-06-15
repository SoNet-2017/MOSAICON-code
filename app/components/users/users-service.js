'use strict';

//The service implemented in this module will save the status of the user (logged or not logged) ad will save user info at first registration
angular.module('myApp.users.usersService', [])

    .factory('Users', function($firebaseArray) {
        return {
            registerLogin: function (userId, email) {
                //add the user to list of users and set the logged value to true
                var ref = firebase.database().ref().child("users").child(userId);
                // create a synchronized array
                ref.update({
                    email: email,
                    logged: true
                });
            },
            registerLogout: function (userId)
            {
                var ref = firebase.database().ref().child("users").child(userId);
                // create a synchronized array
                ref.update({
                    logged: false
                });
            },
            registerNewUserInfo: function (userId, name, surname, email, nickname, nascita, citta, infos, imgPath) {
                //add the user to list of users and set the logged value to true
                var ref = firebase.database().ref().child("users").child(userId);
                // create a synchronized array
                ref.set({
                    name: name,
                    surname: surname,
                    email: email,
                    nickname: nickname,
                    nascita: nascita,
                    citta: citta,
                    infos: infos,
                    img_url: imgPath
                });
            }
        };
    });
