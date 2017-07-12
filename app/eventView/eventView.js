/**
 * Created by mlnmtt on 30/05/17.
 */
'use strict';

angular.module('myApp.eventView',
    [
        'ngRoute',
        "ngSanitize",
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "com.2fdevs.videogular.plugins.overlayplay",
        "com.2fdevs.videogular.plugins.poster",
        "com.2fdevs.videogular.plugins.buffering",
        'myApp.events',
        'myApp.users',
        'myApp.likes'
    ]
)

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/eventView/:eventId', {
            templateUrl: 'eventView/eventView.html',
            resolve: {
                // controller will not be loaded until $requireSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                    // $requireSignIn returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $routeChangeError (see above)
                    return Auth.$requireSignIn();
                }]

            }
        })
    }])

    .controller('eventViewCtrl', ['$scope', '$rootScope', '$routeParams', 'oneEvent', '$firebaseAuth', '$firebaseStorage', 'UsersChatService', '$location', 'Likes',
        function ($scope, $rootScope, $routeParams, oneEvent, $firebaseAuth, $firebaseStorage, UsersChatService, $location, Likes) {

            $scope.dati = {};
            //$scope.dati.currentView = "calendar";

            var user_id = firebase.auth().currentUser.uid;
            $scope.dati.id = user_id;
            var event_id = $routeParams.eventId;

            /* Modal */
            var vids = $("video");
            $.each(vids, function() {
                this.controls = false;
            });
            //Loop though all Video tags and set Controls as false

            $scope.openNav = function() {
                document.getElementById("myNav").style.height = "100%";
            };

            $scope.closeNav = function() {
                document.getElementById("myNav").style.height = "0%";
            };

            $scope.openModal = function() {
                document.getElementById('myModal').style.display = "block";
            };

            $scope.openSingleModal = function() {
                document.getElementById('mySingleModal').style.display = "block";
            };

            $scope.closeModal = function() {
                var vids = $("video.clip");
                $.each(vids, function() {
                    this.load();
                    //this.pause();
                });
                document.getElementById('myModal').style.display = "none";
            };

            $scope.closeSingleModal = function() {
                document.getElementById('mySingleModal').style.display = "none";
            };

            $scope.openGalleryModal = function() {
                document.getElementById('myGalleryModal').style.display = "block";
            };

            $scope.closeGalleryModal = function() {
                document.getElementById('myGalleryModal').style.display = "none";
            }

            //$scope.showSlides(slideIndex);

            $scope.plusSlides = function(n) {
                $scope.showSlides(slideIndex += n);
            }

            $scope.currentSlide = function(n) {
                $scope.showSlides(slideIndex = n);
            }

            $scope.showSlides = function(n) {
                var i;
                var slides = document.getElementsByClassName("mySlides");
                //var dots = document.getElementsByClassName("demo");
                //var captionText = document.getElementById("caption");
                if (n > slides.length) {slideIndex = 1}
                if (n < 1) {slideIndex = slides.length}
                for (i = 0; i < slides.length; i++) {
                    slides[i].style.display = "none";
                }
                //for (i = 0; i < dots.length; i++) {
                //    dots[i].className = dots[i].className.replace(" active", "");
                //}
                slides[slideIndex-1].style.display = "block";
                //dots[slideIndex-1].className += " active";
                //captionText.innerHTML = dots[slideIndex-1].alt;
            }

            $scope.dati.event = oneEvent.getOneEvent($routeParams.eventId);

            $scope.dati.event.$loaded().then(function() {
                $scope.dati.event.content = oneEvent.getContent(event_id);
                $scope.dati.event.content.$loaded().then(function() {
                    console.log($scope.dati.event.content.length);
                });
            });

            $scope.addImage = function() {

                $scope.dati.feedback = null;
                $scope.dati.feedback_err = null;

                if ($scope.fileToUpload != null) {

                    if ($scope.dati.content) {

                        $scope.dati.user = UsersChatService.getUserInfo(user_id);

                        $scope.dati.user.$loaded().then(function () {

                            //get the name of the file
                            var fileName = $scope.fileToUpload.name;
                            //specify the path in which the file should be saved on firebase
                            var storageRef = firebase.storage().ref("eventsImg/" + fileName);
                            $scope.storage = $firebaseStorage(storageRef);

                            var uploadTask = $scope.storage.$put($scope.fileToUpload);
                            uploadTask.$complete(function (snapshot) {
                                $scope.dati.img_url = snapshot.downloadURL;

                                var s = $scope.dati.img_url.toString();
                                console.log(s);
                                var s1 = ".jpg";
                                var s2 = ".png";

                                if (s.indexOf(s1) !== -1 || s.indexOf(s2) !== -1) {

                                    oneEvent.uploadContent($scope.dati.content, event_id, $scope.dati.user.nickname, $scope.dati.img_url, user_id).then(function (ref) {
                                        var contentId = ref.key;

                                        Likes.createRecord(event_id, contentId, user_id).then(function (ref) {

                                            var recordId = ref.key;
                                            Likes.updateRecordId(event_id, contentId, recordId);
                                            oneEvent.updateContent(event_id, contentId, recordId);
                                            $scope.dati.feedback = "upload done";

                                        })

                                    });

                                }

                                else {

                                    $scope.dati.feedback_err = "please choose a .jpg or .png";

                                }
                            });

                        });
                    }

                    else {

                        $scope.dati.feedback_err = "please leave a comment";

                    }

                }

                else {

                    $scope.dati.feedback_err = "please add a image";
                }

                $location.path("/eventView/" + event_id);

            };

            $scope.likePic = function(event_id, contentId) {

                var content = oneEvent.getContentInfo(event_id, contentId);

                content.$loaded().then(function () {
                    var likes = content.like_count +1;
                    Likes.updateCount(event_id, contentId, likes);

                    var user_id = firebase.auth().currentUser.uid;
                    var recordId = content.record_id;
                    Likes.like(event_id, contentId, recordId, user_id);

                })

            };

            $scope.dislikePic = function(event_id, contentId) {

                var content = oneEvent.getContentInfo(event_id, contentId);

                content.$loaded().then(function () {
                    var likes = content.like_count -1;
                    Likes.updateCount(event_id, contentId, likes);

                    var user_id = firebase.auth().currentUser.uid;
                    var recordId = content.record_id;
                    Likes.disLike(event_id, contentId, recordId, user_id);

                })
            };

            var ctrl = this;
            ctrl.onChange = function onChange(fileList) {
                $scope.fileToUpload = fileList[0];
            };

        }])

    /* Audiogular */
   .controller('audioCtrl',
        ["$sce", "$rootScope", function ($sce, $rootScope) {
            var controller = this;
            controller.API = null;
            $rootScope.mainAudioCtrl = controller;

            this.config = {
                sources: [
                    {src: $sce.trustAsResourceUrl('https://firebasestorage.googleapis.com/v0/b/mosaicon-ffefe.appspot.com/o/eventsVid%2FAudio.mp3?alt=media&token=dc72161c-f7c9-4a76-998a-dfb432286a1e'), type: 'audio/mpeg'}
                ],
                theme: '../../../MOSAICON-code/lib/bower_components/videogular-themes-default/videogular.css'
            };
            controller.onPlayerReady = function(API) {
                controller.API = API;
                controller.API.setVolume(1);
            };
            controller.moveTo = function(sync) {
                controller.API.seekTime(sync, false);
            };
            /*controller.onUpdateState = function (state) {
                var currentState = state;

                if (currentState === 'play')
                    $rootScope.mainVideoCtrl.API.play();
                else {
                    $rootScope.mainVideoCtrl.API.pause();
                }
            };*/
            controller.onUpdateTime = function (time, duration) {
                var currentTime = time;
                var finalTime = duration;
                $rootScope.mainVideoCtrl.API.seekTime(time, false);
                //$rootScope.mainVideoCtrl.API.play();
            };

            /* Videomodal */
            $("video.clip").click(function() {
                console.log(this);

                if (this.paused) {
                    this.play();
                    controller.API.play();
                    $rootScope.mainVideoCtrl.API.play();
                    if (slideIndex===1) {
                        controller.moveTo(157);
                        $rootScope.mainVideoCtrl.moveTo(157);
                    }
                    if (slideIndex===2) {
                        controller.moveTo(596);
                        $rootScope.mainVideoCtrl.moveTo(596);
                    }
                    if (slideIndex===3) {
                        controller.moveTo(1244);
                        $rootScope.mainVideoCtrl.moveTo(1244);
                    }
                } else {
                    this.pause();
                    controller.API.pause();
                    $rootScope.mainVideoCtrl.API.pause();
                }
            });
        }]
    )
    /* Videogular */
    .controller('videoCtrl',
        ["$sce", "$rootScope", function ($sce, $rootScope) {
            var controller = this;
            controller.API = null;
            $rootScope.mainVideoCtrl = controller;

            this.config = {
                sources: [
                    {src: $sce.trustAsResourceUrl('https://firebasestorage.googleapis.com/v0/b/mosaicon-ffefe.appspot.com/o/eventsVid%2FBW.mp4?alt=media&token=4f14d834-d7b1-48d2-abec-65777429b2aa'), type: 'video/mp4'}
                ],
                theme: '../../../MOSAICON-code/lib/bower_components/videogular-themes-default/videogular.css',

                plugins: {
                    //poster: 'https://firebasestorage.googleapis.com/v0/b/mosaicon-ffefe.appspot.com/o/eventsVid%2FVG%20-%20playover.jpg?alt=media&token=d8bcf42b-ad0e-4817-b746-5d836d456afc',
                    controls: {

                    }
                }
            };
            controller.onPlayerReady = function(API) {
                controller.API = API;
                controller.API.setVolume(0);
            };
            controller.moveTo = function(time) {
                controller.API.seekTime(time, false);
            };
            controller.onUpdateState = function (state) {
                var currentState = state;

                if (currentState === 'play')
                    $rootScope.mainAudioCtrl.API.play();
                else {
                    $rootScope.mainAudioCtrl.API.pause();
                }
            };
        }]
    );

var slideIndex = 1;
