

// App module

var homeControlsInterfaceApp = angular.module('homeControlsInterfaceApp', [
	'ngRoute',
	'homeCIController',
	'chart.js'
	]);

homeControlsInterfaceApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/home', {
			templateUrl: 'view/home.html',
        	controller: 'homeCtrl'
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
<<<<<<< Updated upstream
			templateUrl: 'view/login.html',
=======
			templateUrl: 'vues/login.html',
>>>>>>> Stashed changes
        	controller: 'loginCtrl'
		})
		.when('/register', {
			templateUrl: 'vues/register.html',
        	controller: 'registerCtrl'
		})
		.otherwise({ redirectTo: '/login' });
	}]);

homeControlsInterfaceApp.constant('AUTH_EVENTS',{
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

homeControlsInterfaceApp.constant('USER_ROLES',{
    all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})
