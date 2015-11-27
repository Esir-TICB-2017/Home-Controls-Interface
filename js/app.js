

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
		.when('login', {
			templateUrl: 'login.html',
        	controller: 'loginCtrl'
		})
		.when('Register', {
			templateUrl: 'register.html',
        	controller: 'registerCtrl'
		})
		.otherwise({ redirectTo: '/login' });
	}]);

homeControlsInterfaceApp.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
      datasetFill: true,
      colours: ['#212121', '#90A4AE'],

    });
  }])
