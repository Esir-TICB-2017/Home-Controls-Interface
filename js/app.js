

// App module

var homeControlsInterfaceApp = angular.module('homeControlsInterfaceApp', [
	'ngRoute',
	'homeCIController'
	]);

homeControlsInterfaceApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
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
	}]);
