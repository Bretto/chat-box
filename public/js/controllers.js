'use strict';
/* App Controllers */

var controllers = angular.module('App.controllers', []);

controllers.controller('ChatsCtrl', function ($scope, $rootScope, $timeout, $log, ChatsModel, Socket){
    $log.info('ChatsCtrl');

    $scope.chats = ChatsModel.chats;
});

controllers.controller('ConnectionsCtrl', function ($scope, $rootScope, $timeout, $log, ChatsModel, Socket){
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

    $scope.onSendMsg = function(){
        var data = {emitterName:$scope.name, receiverName:$scope.connection.name, msg:"Hello World"};
        Socket.emit("user:msg", data);
    }

    Socket.on('user:msg', function (data) {
        $log.info(data);
    });
});

















