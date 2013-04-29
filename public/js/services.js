'use strict';

var services = angular.module('App.services', []);

services.factory('ChatsModel', function ($http, $log, $rootScope, $routeParams, $location) {

    var chatsModel = {
        chats: [],
        connections: []
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
