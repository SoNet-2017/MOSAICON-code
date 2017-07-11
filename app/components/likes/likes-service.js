/**
 * Created by Ronk1 on 11/07/17.
 */
'use strict';


angular.module('myApp.likes.likesService', [])

    .factory('Likes', function($firebaseArray, $firebaseObject) {
        var likesService = {

            updateCount: function (eventId, contentId, like_count) {
                var ref = firebase.database().ref().child("events").child(eventId).child("content").child(contentId);
                ref.update({
                   like_count: like_count
                });
            },

            createRecord: function (eventId, contentId, userId) {
                var ref = firebase.database().ref().child("records");
                return $firebaseArray(ref).$add({

                    event_id: eventId,
                    content_id: contentId,
                    [userId]: false

                });
            },

            updateRecordId: function (recordId) {
                var ref = firebase.database().ref().child("records").child(recordId);

                ref.update({
                    id: recordId
                });
            },

            like: function (recordId, userId) {
                var ref = firebase.database().ref().child("records").child(recordId);

                ref.update({
                    [userId]: true
                });
            },

            unLike: function (recordId, userId) {
                var ref = firebase.database().ref().child("records").child(recordId);

                ref.update({
                    [userId]: false
                });
            },

            getSingleRecord: function(recordId) {

                var ref = firebase.database().ref().child("records").child(recordId);
                return(ref);

            },

            getRecords: function(recordId) {

                var ref = firebase.database().ref().child("records").child(recordId);
                return $firebaseArray(ref);

            }

        };
        return likesService;
    });