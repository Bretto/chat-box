'use strict';
/* App Controllers */

var controllers = angular.module('App.controllers', []);

controllers.controller('chatsCtrl', function ($scope, $rootScope, $timeout, $log, chatsModel, socket){
    $log.info('Chats Ctrl');

    $scope.chats = [1,1];
});

















