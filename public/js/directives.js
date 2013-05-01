'use strict';

var directives = angular.module('App.directives', []);

directives.directive('chatBox', function ($log, Socket) {

    function link(scope, elem, attr, ctrl) {

        scope.messages = [];

        Socket.on('user:msg', function (data) {
            if(data.roomId === scope.data.roomId)
                scope.messages.push(data.msg);
        });

        scope.onSendMsg = function(e){

            var data = {
                fUser:scope.data.fUser,
                roomId:scope.data.roomId,
                tId:scope.data.tId,
                aId:scope.data.aId,
                msg:scope.data.msg
            };
            scope.messages.push(data.msg);
            $log.info(data.roomId);
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

