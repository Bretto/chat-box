'use strict';

var services = angular.module('App.services', []);

services.factory('ChatsModel', function ($http, $log, $rootScope, $routeParams, $location) {

    var user = {};
    var chats = [];

    var makeRoomId = function(data){
        var id = 'vid'+ data.tId + 'aid' + data.aId + 'cid' + data.fUser.id;
        return id;
    }

    var getChatBox = function(roomId){
        var chatBox = null;
        for (var i = 0; i < chats.length; i++) {
            var chat = chats[i];
            if(chat.roomId === roomId){
                chatBox = chat;
            }
        }
        return chatBox;
    }

    var destroy = function(chat){
        var i = chats.indexOf(chat);
        if (i !== -1) chats.splice(i, 1);
    }


    var chatsModel = {
        user: user,
        chats: chats,
        makeRoomId: makeRoomId,
        getChatBox: getChatBox,
        destroy: destroy
    };

    return chatsModel;
});

services.factory('Socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});
