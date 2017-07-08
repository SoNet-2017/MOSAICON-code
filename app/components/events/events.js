/**
 * Created by lucaleli on 08/07/17.
 */
'use strict';

//declare the module that will act as parent of all the services dedicated to retrieve/save information about the pizzas
angular.module('myApp.events', [
    'myApp.events.eventsService'
])

    .value('version', '0.1');