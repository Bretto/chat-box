'use strict';
/* App Controllers */

var controllers = angular.module('App.controllers', []);

controllers.controller('ChatsCtrl', function ($scope, $rootScope, $timeout, $log, ChatsModel, Socket){
    $log.info('ChatsCtrl');
    $scope.chats = ChatsModel.chats;

    Socket.on('msgAlert', function (data) {
        ChatsModel.chats.push(data);
    });
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

        var data = {
                        tUser:{name:'unknown', id:annonce.uId},
                        aId:annonce.aId,
                        title:annonce.title,
                        roomId: ChatsModel.makeRoomId(annonce.uId, annonce.aId, ChatsModel.user.id)
        };

        //prevents the creation of same chat rooms
        if(ChatsModel.getChatBox(data.roomId))return;

        ChatsModel.chats.push(data);

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

    $scope.onChatEnable = function(){
        Socket.emit("user:chatable", ($scope.chatable)? false:true);
    }

});
















