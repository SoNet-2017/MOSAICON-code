/**
 * Created by Ronk1 on 08/07/17.
 */

'use strict'

angular.module('myApp.calendar.calendarService', [
])

.factory('calendarService', function commonProp($firebaseArray, $firebaseObject) {

    return {
        getEventInfo: function(id) {
            // RICHIESTA DELL'OGGETTO UTENTE PRESENTE NEL DATABASE "calendario"
            // DI FIREBASE MEDIANTE PASSAGGIO DELL'ID (IDENTIFICATORE UNIVOCO)

            var userRef = firebase.database().ref().child("events").child(id);
            return $firebaseObject(userRef);
        },

        getAllEvents: function(){

            // ARRAY DI TUTTI GLI EVENTI REGISTRATI NEL DATABASE
            var ref = firebase.database().ref().child("events");
            return $firebaseArray(ref);
        },

        searchByDate: function (evento) {

            return true;

        }
    };

});
