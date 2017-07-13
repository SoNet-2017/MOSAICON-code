/**
 * Created by Ronk1 on 14/06/17.
 */
'use strict';

angular.module('myApp.mapView', ['ngRoute', 'myApp.events'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/mapView', {
            templateUrl: 'mapView/mapView.html',
            controller: 'mapCtrl',
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

    .controller('mapCtrl', ['$scope', '$rootScope', 'Events', 'oneEvent',
        function($scope, $rootScope, Events, oneEvent) {

            $scope.dati={};
            $scope.dati.vm = this;
            $scope.dati.vm.positions = [];

            $rootScope.dati.currentView = "map";

            $scope.dati.events = Events.getData();
            $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyCyGzdO_rC3i7oXldFLWJmVsDP5MCvBqZs";
            $scope.dati.events.$loaded().then(function() {
                var i = 0;
                var tempEvent = [];

                do {
                    tempEvent[i] = oneEvent.getOneEvent(i);
                    tempEvent[i].$loaded().then(function(variable) {

                        var indirizzo = variable.indirizzo;
                        $scope.dati.vm.positions.push({indirizzo: indirizzo});
                        console.log(indirizzo);
                    });

                    i++;
                }
                while(i < $scope.dati.events.length);

                console.log("vm.positions", $scope.dati.vm.positions);

        });
    }]);