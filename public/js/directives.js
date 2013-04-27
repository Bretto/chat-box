'use strict';
/* http://docs-next.angularjs.org/api/angular.module.ng.$compileProvider.directive */

var directives = angular.module('App.directives', []);

directives.directive('imgFadeIn', function ($log, $parse, $timeout) {

    function getRandom(max, min) {
        return Math.floor(Math.random() * (1 + max - min) + min);
    }

    return {
        restrict: 'A',
        link: link
    }
});