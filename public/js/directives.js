'use strict';

var directives = angular.module('App.directives', []);

directives.directive('chatBox', function ($log, Socket, ChatsModel, $timeout) {

    function link(scope, elem, attr, ctrl) {

        scope.messages = [];
        scope.username = '';
        scope.msgCnt = 0;

        function addMeMsg(msg, received){
            var msg = {type:"me", message:msg, received:received};
            scope.messages.push(msg);
        }

        function addYouMsg(data){
            var msg = {type:"you", message:data.msg, dateTime:data.dateTime};
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
            scope.username = ChatsModel.user.name;
            Socket.emit("user:join",scope.data, function(data){
                scope.data.chatable = data.chatable;
            });
        }

        init();



        Socket.on('user:msg', function (data) {
            if(data.roomId === scope.data.roomId){
                scope.data.chatable = true;
                scope.msgCnt += 1;
                addYouMsg(data);
            }
        });

        Socket.on('user:join', function (joinData) {
            if(joinData.roomId === scope.data.roomId){
                scope.data.chatable = true;
                var msg = joinData.user.name + ' has join the room';
                addInfoMsg(msg);
            }
        });

        Socket.on('user:leave', function (leaveData) {
            if(leaveData.roomId === scope.data.roomId){
                scope.data.chatable = false;
                var msg = leaveData.user.name + ' has left the room';
                addInfoMsg(msg);
            }
        });

        Socket.on('user:error', function (data) {
            //(data.roomId === scope.data.roomId){
                addInfoMsg(data.message);
            //}
        });

        Socket.on('user:chatable', function (data) {
            if(data.roomId === scope.data.roomId){
                scope.data.chatable = data.chatable;
            }
        });

        Socket.on('user:connect', function (user) {
            addInfoMsg('Connection found');
            Socket.emit("user:join",scope.data, function(data){
                scope.data.chatable = data.chatable;
            });
        });

        scope.onSendMsg = function(e){

            if(scope.data.sendMsg === '')return;


            var data = {
                        tUser:scope.data.tUser,
                        aId:scope.data.aId,
                        title:scope.data.title,
                        roomId:scope.data.roomId,
                        msg:scope.data.sendMsg
                       };


            Socket.emit("user:msg", data, function(received){
                $log.info('received:',received);
                //scope.received = received;
                addMeMsg(scope.data.sendMsg, received);
                scope.data.sendMsg = '';
            });

        }

        scope.isCntVisible = function(){
            return (scope.data.isMin && scope.msgCnt > 0)? true : false;
        }

        scope.onMin = function(){
            var isMin = (scope.data.isMin === true)? false : true;
            scope.data.isMin = isMin;

            if(isMin){
                scope.msgCnt = 0;
            }
        }



        scope.onClose = function(e){
            //e.stopImmediatePropagation();
            var chat = ChatsModel.getChatBox(scope.data.roomId);
            ChatsModel.destroy(chat);
            Socket.emit("user:leave", scope.data.roomId);
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

directives.directive('hasFocus', function ($log, $timeout) {

    function link(scope, elem, attr, ctrl) {
        $(elem).focus();

        scope.$watch(function(){return  scope.data.isMin}, function(value){
            if(!value){
                $timeout(function(){
                    $(elem).focus();
                },0)
            }
        });
    }

    return {
        restrict: 'A',
        link: link
    }
});

