'use strict';
/* http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive */

var directives = angular.module('App.directives', []);

directives.directive('chatBox', function ($log, Socket) {

    function link(scope, elem, attr, ctrl) {

        $log.info('ChatBoxCtrl', scope.emitterName, scope.receiverName, scope.annonceId );

        Socket.on('user:msg', function (data) {
            $log.info(data);
            $scope.messages.push(data.msg);
        });
    }

    return {
        replace:true,
        scope:{data: "="},
        restrict: 'A',
        link: link
    }
});

