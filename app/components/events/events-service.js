/**
 * Created by lucaleli on 08/07/17.
 */
'use strict';


angular.module('myApp.events.eventsService', [])

    .factory('Event', function($firebaseArray) {
        var eventsService = {
            getData: function () {
                var ref = firebase.database().ref().child("events");
                // download the data into a local object
                return $firebaseArray(ref);
            }
        };
        return eventsService;
    });