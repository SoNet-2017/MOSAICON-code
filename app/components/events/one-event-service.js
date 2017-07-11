/**
 * Created by Ronk1 on 09/07/17.
 */
'use strict';

angular.module('myApp.events.oneEventService', [])

    .factory('oneEvent', function($firebaseObject, $firebaseArray) {
        var oneEventService = {

            getOneEvent: function (eventId) {
                var ref = firebase.database().ref().child("events").child(eventId);
                // download the data into a local object
                return $firebaseObject(ref);
            },

            getContent: function(eventId){

                var ref = firebase.database().ref().child("events").child(eventId).child("content");
                return $firebaseArray(ref);
            },

            uploadContent: function(comment, event_id, nickname, url, user_id) {

                var ref = firebase.database().ref().child("events").child(event_id).child("content");
                return $firebaseArray(ref).$add({
                    comment: comment,
                    event_id: event_id,
                    nickname: nickname,
                    url: url,
                    user_id: user_id,
                    like_count : 0
                });

            },

            getContentInfo: function(eventId, contentId) {
                var ref = firebase.database().ref().child("events").child(eventId).child("content").child(contentId);
                return $firebaseObject(ref);
            },

           updateContent: function (event_id, contentId, recordId) {
                //add the user to list of users and set the logged value to true
                var ref = firebase.database().ref().child("events").child(event_id).child("content").child(contentId);
                // create a synchronized array
                ref.update({
                    id: contentId,
                    record_id: recordId
                });
            }
        };
        return oneEventService;
    });