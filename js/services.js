'use strict'

//Services used in the application

var homeControlsServices = angular.module('homeControlsServices',[]);

homeControlsServices.factory('AuthenticationService', function($http, Session){
    var authService = {};
    
    authService.login = function(credentials){
        return $http.post('/login', credentials).then(function(res){
            Session.create(res.data.id, res.data.user.id, res.data.user.role);
            return res.data.user
        });
    };
    
    authService.isAuthenticated = function(){
        return !!Session.userId;
    };
    
    authService.isAuthorized = function(authorizedRoles){
        if(!angular.isArray(authorizedRoles)){
            authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
    };
    
    return authService;
});

homeControlsServices.service('Session', function(){
    this.create = function(sessionId,userId,userRole){
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function(){
        this.id = null;
        this.userId = null;
        this.userRole = null;
    };
});

homeControlsServices.factory('AuthInterceptor', function ($rootScope, $q,
                                      AUTH_EVENTS) {
  return {
    responseError: function (response) { 
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.sessionTimeout,
        440: AUTH_EVENTS.sessionTimeout
      }[response.status], response);
      return $q.reject(response);
    }
  };
})