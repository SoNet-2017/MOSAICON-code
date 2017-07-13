/**
 * Created by Ronk1 on 08/07/17.
 */

'use strict'

angular.module('myApp.calendar.calendarService', [
])

.factory('calendarService', function($firebaseArray, $firebaseObject) {

    return {
        getEventInfo: function(id) {

            var userRef = firebase.database().ref().child("events").child(id);
            return $firebaseObject(userRef);
        },

        getAllEvents: function(){

            var ref = firebase.database().ref().child("events");
            return $firebaseArray(ref);
        }

    };

});
