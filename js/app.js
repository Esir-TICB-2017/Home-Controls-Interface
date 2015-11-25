

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
			templateUrl: 'vues/home.html',
        	controller: 'homeCtrl'
		}).
		when('/objets', {
			templateUrl: 'vues/objets.html',
        	controller: 'objetsCtrl'
		}).
		when('/scenarios', {
			templateUrl: 'vues/scenarios.html',
        	controller: 'scenariosCtrl'
		})
		.otherwise({ redirectTo: '/' });
	}]);
