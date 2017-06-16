'use strict';



angular.module('myApp.events', [
    'myApp.events.event-service',
    'myApp.events.event-directive'
])

    .value('version', '0.1');