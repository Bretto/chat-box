'use strict';
/* App Controllers */

var controllers = angular.module('App.controllers', []);

controllers.controller('ChatsCtrl', function ($scope, $rootScope, $timeout, $log, ChatsModel, Socket){
    $log.info('ChatsCtrl');

    $scope.chats = ChatsModel.chats;
});

controllers.controller('ConnectionsCtrl', function ($scope, $rootScope, $http, $log, ChatsModel, Socket){
    $log.info('ConnectionsCtrl');

    $scope.connections = ChatsModel.connections;

    //populate the connections
    Socket.on('user:connect', function (data) {
        $log.info('user:connect');
        $scope.name = data.name;
        $scope.connections = data.connections;
    });

    //push new connection to current connections
    Socket.on('user:join', function (data) {
        $log.info('user:join');
        $scope.connections.push(data);
    });

    // add a message to the conversation when a user disconnects or leaves the room
    Socket.on('user:disconnect', function (data) {
        $log.info('user:disconnect');

        for (var i = 0; i < $scope.connections.length; i++) {
            var connection = $scope.connections[i];
            if (connection.socketId === data.socketId) {
                $scope.connections.splice(i, 1);
                break;
            }
        }
    });

    $scope.onMakeChatBox = function(){
        var data = {emitterName:$scope.name, receiverName:$scope.connection.name, annonceId:1};
        ChatsModel.chats.push(data);
        //Socket.emit("user:msg", data);
    }

    $scope.onGetMessages = function(){
        $http({method: 'GET', url: '/messages/123'}).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                $log.info('success',data);
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $log.info('error',data);
            });
    }


});


//controllers.controller('ChatBoxCtrl', function ($scope, $rootScope, $timeout, $log, ChatsModel, Socket){
//    $log.info('ChatBoxCtrl');
//    $scope.messages = [];
//    Socket.on('user:msg', function (data) {
//        $log.info(data);
//        $scope.messages.push(data.msg);
//    });
//});
















