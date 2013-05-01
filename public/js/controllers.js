'use strict';
/* App Controllers */

var controllers = angular.module('App.controllers', []);

controllers.controller('ChatsCtrl', function ($scope, $rootScope, $timeout, $log, ChatsModel, Socket){
    $log.info('ChatsCtrl');
    $scope.chats = ChatsModel.chats;

    Socket.on('msgAlert', function (data) {

        ChatsModel.chats.push(data);
        Socket.emit("joinChatRoom",data);

        //var data = {fUser:ChatsModel.user, tId:annonce.uId, aId:annonce.aId};
        //var roomId = ChatsModel.makeRoomId(data);
        //$log.info(roomId);
//        var hasRoom = false;
//        for (var i = 0; i < ChatsModel.chats.length; i++) {
//            var chat = ChatsModel.chats[i];
//            if(chat.roomId === data.roomId){
//                hasRoom = true;
//            }
//        }

//        if(!hasRoom){
//            data.roomId = roomId;
//            data.newRoom = true;
//            ChatsModel.chats.push(data);
//        }

        //scope.messages.push(data.msg);
    });

});

controllers.controller('ConnectionsCtrl', function ($scope, $rootScope, $http, $log, ChatsModel, Socket){
    $log.info('ConnectionsCtrl');

    $scope.onChatEnable = function(){
        var data = { userId:$scope.name };
        data.chatEnable = ($scope.chatEnable)? true:false;
        Socket.emit("user:chatEnable", data);
    }

    $scope.connections = ChatsModel.connections;

    //populate the connections
    Socket.on('user:connect', function (user) {
        $log.info('user:connect');
        ChatsModel.user = user;
        $scope.name = user.name;
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


controllers.controller('AnnoncesCtrl', function ($scope, $rootScope, $timeout, $log, ChatsModel, Socket, $http){
    $http({method: 'GET', url: '/annonce'}).
        success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $log.info('success',data);
            $scope.annonces = data;
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $log.info('error',data);
        });

    $scope.onMakeChatBox = function(annonce){

        //check that annonce Id Vendeur is different from Id User
        if(annonce.uId === ChatsModel.user.id)return;

        var data = {fUser:ChatsModel.user, tId:annonce.uId, aId:annonce.aId};
        data.roomId = ChatsModel.makeRoomId(data);
        ChatsModel.chats.push(data);
        Socket.emit("joinChatRoom",data);
    }
});

controllers.controller('UserCtrl', function ($scope, $rootScope, $timeout, $log, ChatsModel, Socket, $http){

    Socket.on('user:connect', function (user) {
        $log.info('user:connect');
        ChatsModel.user = user;
        $scope.name = user.name;
    });

    Socket.on('user:join', function (data) {
        $log.info('user:join');
    });

    Socket.on('user:disconnect', function (data) {
        $log.info('user:disconnect');
    });

});
















