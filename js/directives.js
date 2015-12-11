'use strict'

var HomeControlsDirectives = angular.module('HomeControlsDirectives',[]);

HomeControlsDirectives.directive('loginBox', function (AUTH_EVENTS) {
  return {
    restrict: 'A',
    template: '<div ng-if="visible" ng-include="\'login-form.html\'">',
    link: function (scope) {
      var showBox = function () {
        scope.visible = true;
      };
  
      scope.visible = false;
      scope.$on(AUTH_EVENTS.notAuthenticated, showBox);
      scope.$on(AUTH_EVENTS.sessionTimeout, showBox)
    }
  };
});