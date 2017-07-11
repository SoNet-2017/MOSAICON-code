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
            }
        };
        return likesService;
    });