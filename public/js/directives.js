'use strict';

var directives = angular.module('App.directives', []);

directives.directive('chatBox', function ($log, Socket, ChatsModel) {

    function link(scope, elem, attr, ctrl) {

        scope.messages = [];

        function addMeMsg(msg){
            var msg = {type:"me", message:msg};
            scope.messages.push(msg);
            //objDiv.scrollTop = objDiv.scrollHeight;
        }

        function addYouMsg(msg){
            var msg = {type:"you", message:msg};
            scope.messages.push(msg);
        }

        function addInfoMsg(msg){
            var msg = {type:"info", message:msg};
            scope.messages.push(msg);
        }

        if(angular.isDefined(scope.data.msg))
            addYouMsg(scope.data.msg);
            //scope.messages.push(scope.data.msg);


        Socket.on('user:msg', function (data) {
            if(data.roomId === scope.data.roomId)
//                scope.messages.push(data.msg);
                addYouMsg(data.msg);
        });

        scope.onSendMsg = function(e){

            addMeMsg(scope.data.sendMsg);

            var data = {
                title:scope.data.title,
                fUser:scope.data.fUser,
                roomId:scope.data.roomId,
                tId:scope.data.tId,
                aId:scope.data.aId,
                msg:scope.data.sendMsg
            };


            //var msg = {type:"me", message:data.msg};
            //scope.messages.push(msg);

            Socket.emit("user:msg", data);
            scope.data.sendMsg = '';
        }

        scope.onMin = function(){
            scope.data.isMin = (scope.data.isMin === true)? false : true;
        }

        scope.onClose = function(){
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

directives.directive('autoScroll', function ($log, Socket, ChatsModel) {

    function link(scope, elem, attr, ctrl) {

        scope.$watch(function(){return  elem[0].scrollHeight}, function(value){
            elem[0].scrollTop = value;
        });
    }

    return {
        restrict: 'A',
        link: link
    }
});

