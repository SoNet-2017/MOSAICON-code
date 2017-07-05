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
        "com.2fdevs.videogular.plugins.poster"
    ]
)

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/eventView', {
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

function openModal() {
    document.getElementById('myModal').style.display = "block";
}

function closeModal() {
    var vids = $("video.clip");
    $.each(vids, function() {
        this.load();
        //this.pause();
    });
    document.getElementById('myModal').style.display = "none";
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

