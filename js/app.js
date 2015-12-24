

// App module

var homeControlsInterfaceApp = angular.module('homeControlsInterfaceApp', [
	'ngRoute',
	'homeCIController',
	'applicationController',
	'homeControlsServices',
	'homeControlsSession'
	]);

homeControlsInterfaceApp.config(['$routeProvider', 'AUTH_EVENTS','USER_ROLES',
	function($routeProvider, USER_ROLES, AUTH_EVENTS) {
		$routeProvider.
		when('/home', {
			templateUrl: 'view/home.html',
        	controller: 'homeCtrl',
        	data : {
               authorizedRoles : [USER_ROLES.editor]
            }
		}).
		when('/objets', {
			templateUrl: 'view/objects.html',
        	controller: 'objectsCtrl'
		}).
		when('/scenarios', {
			templateUrl: 'view/scenarios.html',
        	controller: 'scenariosCtrl'
		})
		.when('/login', {
			templateUrl: 'view/login.html',
        	controller: 'loginCtrl'
		})
		.when('/register', {
			templateUrl: 'view/register.html',
        	controller: 'registerCtrl'
		})
		.otherwise({ redirectTo: '/login' });
	}]);

homeControlsInterfaceApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
})

homeControlsInterfaceApp.run(function ($rootScope, AUTH_EVENTS, AuthService) {
  $rootScope.$on('$stateChangeStart', function (event, next) {
    var authorizedRoles = next.data.authorizedRoles;
    if (!AuthService.isAuthorized(authorizedRoles)) {
      event.preventDefault();
      if (AuthService.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });
})

homeControlsInterfaceApp.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

homeControlsInterfaceApp.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})