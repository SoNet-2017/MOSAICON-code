/**
 * Created by Ronk1 on 01/07/17.
 */

'use strict';



angular.module('myApp.calendar', [
    'myApp.calendar.calendar-directive',
    'myApp.calendar.calendarService'
])

    .value('version', '0.1');