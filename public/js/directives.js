'use strict';

var directives = angular.module('App.directives', []);

directives.directive('chatBox', function ($log, Socket) {

    function link(scope, elem, attr, ctrl) {

        scope.messages = [];

        Socket.on('user:msg', function (data) {
            $log.info(data);
            scope.messages.push(data.msg);
        });

        scope.onSendMsg = function(e){

            var data = {
                emitterName:scope.data.emitterName,
                receiverName:scope.data.receiverName,
                annonceId:1,
                msg:scope.data.msg
            };
            scope.messages.push(data.msg);
            //ChatsModel.chats.push(data);
            //Socket.emit("user:msg", data);

            $log.info(data.msg);
            Socket.emit("user:msg", data);
        }
    }

    return {
        replace:true,
        scope:{data: "="},
        restrict: 'A',
        link: link
    }
});

