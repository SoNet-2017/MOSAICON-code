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

            $scope.dati.event = oneEvent.getOneEvent($routeParams.eventId);

            $scope.dati.event.$loaded().then(function() {
                $scope.dati.event.content = oneEvent.getContent(event_id);
                $scope.dati.event.content.$loaded().then(function() {
                    console.log($scope.dati.event.content.length);
                });
            });

            $scope.addImage = function() {

                if ($scope.fileToUpload != null) {

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

                            oneEvent.uploadContent($scope.dati.content, event_id, $scope.dati.user.nickname, $scope.dati.img_url, user_id).then(function (ref) {
                                var contentId = ref.key;
                                oneEvent.updateContent(event_id, contentId);
                                $scope.dati.feedback = "upload done";

                            });

                        });

                    });
                }

                else {

                    //oneEvent.updateUserInfo(userId, $scope.dati.user.name, $scope.dati.user.surname, $scope.dati.user.nickname, $scope.dati.user.nascita, $scope.dati.user.citta, $scope.dati.user.infos, path);

                }


                $location.path("/eventView/" + event_id);

            };

            $scope.likePic = function(event_id, contentId) {


                var content = oneEvent.getContentInfo(event_id, contentId);
                content.$loaded().then(function () {
                    var likes = content.like_count +1;

                    Likes.updateCount(event_id, contentId, likes);

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
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/audios/videogular.mp3"), type: "audio/mpeg"}
                ],
                theme: "../../lib/bower_components/videogular-themes-default/videogular.css",

                plugins: {
                    controls: {

                    }
                }
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
                        controller.moveTo(30);
                        $rootScope.mainVideoCtrl.moveTo(30);
                    }
                    if (slideIndex===2) {
                        controller.moveTo(45);
                        $rootScope.mainVideoCtrl.moveTo(45);
                    }
                    if (slideIndex===3) {
                        controller.moveTo(15);
                        $rootScope.mainVideoCtrl.moveTo(15);
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
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
                ],
                theme: "../../lib/bower_components/videogular-themes-default/videogular.css",

                plugins: {
                    poster: "http://www.videogular.com/assets/images/videogular.png",
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

/* Modal */
var vids = $("video");
$.each(vids, function() {
    this.controls = false;
});
//Loop though all Video tags and set Controls as false

function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

function openModal() {
    document.getElementById('myModal').style.display = "block";
}

function openSingleModal() {
    document.getElementById('mySingleModal').style.display = "block";
}

function closeModal() {
    var vids = $("video.clip");
    $.each(vids, function() {
        this.load();
        //this.pause();
    });
    document.getElementById('myModal').style.display = "none";
}

function closeSingleModal () {
    document.getElementById('mySingleModal').style.display = "none";
}

function openGalleryModal() {
    document.getElementById('myGalleryModal').style.display = "block";
}

function closeGalleryModal() {
    document.getElementById('myGalleryModal').style.display = "none";
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
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

