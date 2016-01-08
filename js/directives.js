'use strict'

var homeControlsDirectives = angular.module('homeControlsDirectives',[]);

homeControlsDirectives.directive('loginDialog', function (AUTH_EVENTS) {
  return {
    restrict: 'A',
    template: '<div ng-if="visible" ng-include="\'view/login.html\'">',
    link: function (scope) {
      var showDialog = function () {
        scope.visible = true;
      };
  
      scope.visible = false;
      scope.$on(AUTH_EVENTS.notAuthenticated, showDialog());
      scope.$on(AUTH_EVENTS.sessionTimeout, showDialog())
    }
  };
});
/*
HomeControlsDirectives.directive('FormAutofillFix', function($timeout){
    return function(scope, element, attrs){
        element.prop('method','post');
        if(attrs.ngSubmit){
            $timeout(function(){
                element
                    .unbind('submit')
                    .bind('submit', function(event){
                        event.preventDefault();
                        element
                            .find('input, textarea, select')
                            .trigger('input')
                            .trigger('change')
                            .trigger('keydown');
                        scope.$apply(attrs.ngSubmit)
                });
            });
        }
    };
});*/