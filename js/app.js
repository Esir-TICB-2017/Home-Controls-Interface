

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
			templateUrl: 'login.html',
        	controller: 'loginCtrl'
		})
		.when('/register', {
			templateUrl: 'register.html',
        	controller: 'registerCtrl'
		})
		.otherwise({ redirectTo: '/login' });
	}]);
