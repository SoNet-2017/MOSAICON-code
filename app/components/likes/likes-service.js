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
                var ref = firebase.database().ref().child("events").child(eventId).child("content").child(contentId).child("record");
                return $firebaseArray(ref).$add({

                    [userId]: false

                });
            },

            updateRecordId: function (eventId, contentId, recordId) {
                var ref = firebase.database().ref().child("events").child(eventId).child("content").child(contentId).child("record").child(recordId);

                ref.update({
                    id: recordId
                });
            },

            like: function (eventId, contentId, recordId, userId) {
                var ref = firebase.database().ref().child("events").child(eventId).child("content").child(contentId).child("record").child(recordId);

                ref.update({
                    [userId]: true
                });
            },

            disLike: function (eventId, contentId, recordId, userId) {
                var ref = firebase.database().ref().child("events").child(eventId).child("content").child(contentId).child("record").child(recordId);

                ref.update({
                    [userId]: false
                });
            },

            getSingleRecord: function(eventId, contentId, recordId) {

                var ref = firebase.database().ref().child("events").child(eventId).child("content").child(contentId).child("record").child(recordId);
                return(ref);

            }

        };
        return likesService;
    });