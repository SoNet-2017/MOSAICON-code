/**
 * Created by Ronk1 on 11/07/17.
 */
'use strict';

//declare the module that will act as parent of all the services dedicated to retrieve/save information about the users
angular.module('myApp.likes', [
    'myApp.likes.likesService'
])

    .value('version', '0.1');