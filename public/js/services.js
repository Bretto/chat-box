'use strict';

var services = angular.module('App.services', []);

services.factory('ChatsModel', function ($http, $log, $rootScope, $routeParams, $location) {

    var makeRoomId = function(data){
        var id = 'vid'+ data.tId + 'aid' + data.aId + 'cid' + data.fUser.id;
        return id;
    }

    var chatsModel = {
        user: {},
        chats: [],
        makeRoomId: makeRoomId
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
