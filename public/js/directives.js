'use strict';

var directives = angular.module('App.directives', []);

directives.directive('chatBox', function ($log, Socket, ChatsModel) {

    function link(scope, elem, attr, ctrl) {

        scope.messages = [];
        scope.messages.push(scope.data.msg);

        Socket.on('user:msg', function (data) {
            if(data.roomId === scope.data.roomId)
                scope.messages.push(data.msg);
        });

        scope.onSendMsg = function(e){

            var data = {
                title:scope.data.title,
                fUser:scope.data.fUser,
                roomId:scope.data.roomId,
                tId:scope.data.tId,
                aId:scope.data.aId,
                msg:scope.data.sendMsg
            };

            scope.data.sendMsg = '';
            scope.messages.push(data.msg);
            //$log.info(data.roomId);
            Socket.emit("user:msg", data);
        }

        scope.onMin = function(){
            scope.data.isMin = (scope.data.isMin === true)? false : true;
            //$log.info(scope.data.isMin);
        }

        scope.onClose = function(){
//          $log.info('onClose');
            var chat = ChatsModel.getChatBox(scope.data.roomId);
            ChatsModel.destroy(chat);
        }

    }

    return {
        replace:true,
        scope:{data: "="},
        restrict: 'A',
        link: link
    }
});

