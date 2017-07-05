/**
 * Created by mlnmtt on 16/06/17.
 */
'use strict';

angular.module('myApp',
    [
        "ngSanitize",
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
    ]
)
    .controller('HomeCtrl',
        ["$sce", function ($sce) {
            this.config = {
                sources: [
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/audios/videogular.mp3"), type: "audio/mpeg"},
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/audios/videogular.ogg"), type: "audio/ogg"}
                ],
                theme: {
                    url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
                }
            };
        }]
    );
