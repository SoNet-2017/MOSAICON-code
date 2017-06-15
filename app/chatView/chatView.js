'use strict';

angular.module('myApp.chatView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/chat/:recipientUserId', {
            templateUrl: 'chatView/chatView.html',
            controller: 'chatViewCtrl',
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
    .controller('chatViewCtrl', ['$scope', '$rootScope', '$routeParams', 'currentAuth', 'UsersChatService',
        function($scope, $rootScope, $routeParams, currentAuth,UsersChatService) {
            //initialize variables
            $scope.dati = {};
            //set the variable that is used in the main template to show the active button
            $rootScope.dati.currentView = "chat";
            //get the id of the current user and of the one that was selected to chat with
            $scope.dati.userId = currentAuth.uid;
            $scope.dati.recipientUserId = $routeParams.recipientUserId;

            $scope.orderProp = 'utctime';
            //get info of the current user and of the one that was selected to chat with
            $scope.dati.userInfo = UsersChatService.getUserInfo($scope.dati.userId);
            $scope.dati.interlocutor = UsersChatService.getUserInfo($scope.dati.recipientUserId);

            //get messages from firebase
            $scope.dati.messages = UsersChatService.getMessages();
            //function that add a message on firebase
            $scope.addMessage = function(e) {
                if (e.keyCode != 13) return;
                //create the JSON structure that should be sent to Firebase
                var newMessage = UsersChatService.createMessage($scope.dati.userId, $scope.dati.userInfo.email, $routeParams.recipientUserId, $scope.dati.msg);
                UsersChatService.addMessage(newMessage);
                //reset the content of the input text box
                $scope.dati.msg = "";
            };
        }]);