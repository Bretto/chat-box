'use strict';

var directives = angular.module('App.directives', []);

directives.directive('chatBox', function ($log, Socket, ChatsModel, $timeout) {

    function link(scope, elem, attr, ctrl) {

        scope.messages = [];
        scope.username = '';

        function addMeMsg(msg){
            var msg = {type:"me", message:msg};
            scope.messages.push(msg);
        }

        function addYouMsg(data){
            var msg = {type:"you", message:data.msg};
            scope.tUsername = data.tUser.name;
            scope.messages.push(msg);
        }

        function addInfoMsg(msg){
            var msg = {type:"info", message:msg};
            scope.messages.push(msg);
        }

        function init(){
            if(angular.isDefined(scope.data.msg)){
                addYouMsg(scope.data);
            }
            scope.username = scope.data.fUser.name;
        }

        init();

        Socket.on('user:msg', function (data) {
            if(data.roomId === scope.data.roomId){
                addYouMsg(data);
            }

        });

        Socket.on('joinChatRoom', function (data) {
            if(data.roomId === scope.data.roomId){
                var msg = data.tUser.name + ' has join the room';
                addInfoMsg(msg);
            }
        });

        Socket.on('leaveChatRoom', function (data) {
            if(data.roomId === scope.data.roomId){
                var msg = data.name + ' has left the room';
                addInfoMsg(msg);
            }

        });

        scope.onSendMsg = function(e){

            addMeMsg(scope.data.sendMsg);

            var data = {
                        fUser:scope.data.fUser,
                        tUser:scope.data.tUser,
                        aId:scope.data.aId,
                        title:scope.data.title,
                        roomId:scope.data.roomId,
                        msg:scope.data.sendMsg
                       };

            Socket.emit("user:msg", data);
            scope.data.sendMsg = '';
        }

        scope.onMin = function(){
            scope.data.isMin = (scope.data.isMin === true)? false : true;
        }

        scope.onClose = function(){
            var chat = ChatsModel.getChatBox(scope.data.roomId);
            ChatsModel.destroy(chat);
            Socket.emit("leaveChatRoom", scope.data);
        }

    }

    return {
        replace:true,
        scope:{data: "="},
        restrict: 'A',
        link: link
    }
});

directives.directive('autoScroll', function ($log, Socket, ChatsModel) {

    function link(scope, elem, attr, ctrl) {

        var msgList = $(elem[0]);

        msgList.bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e){
            if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel"){
                msgList.clearQueue();
                msgList.stop();
            }
        });

        scope.$watch(function(){return  elem[0].scrollHeight}, function(value){
//            elem[0].scrollTop = value;
            msgList.clearQueue();
            msgList.animate({ scrollTop: value }, 500);
        });
    }

    return {
        restrict: 'A',
        link: link
    }
});

directives.directive('hasFocus', function ($log, Socket, ChatsModel) {

    function link(scope, elem, attr, ctrl) {
        $(elem[0]).find(':input').focus();
    }

    return {
        restrict: 'A',
        link: link
    }
});

