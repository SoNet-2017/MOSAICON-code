/**
 * Created by Ronk1 on 09/07/17.
 */
'use strict';

angular.module('myApp.events.oneEventService', [])

    .factory('oneEvent', function($firebaseObject) {
        var oneEventService = {
            getOneEvent: function (eventId) {
                var ref = firebase.database().ref().child("events").child(eventId);
                // download the data into a local object
                return $firebaseObject(ref);
            }
        };
        return oneEventService;
    });