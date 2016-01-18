// App module
var homeControlsInterfaceApp = angular.module('homeControlsInterfaceApp', ['homeCIController', 'applicationController', 'homeControlsDirectives','angular-storage','homeControlsServices','ui.router', 'ui.materialize']);

homeControlsInterfaceApp.config(['$stateProvider','$httpProvider', '$urlRouterProvider', function($stateProvider, $httpProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: 'view/home.html',
        controller: 'homeCtrl',
        children: [
            {
              name: 'newWidget',
              templateUrl: 'newWidget.html',
              controller: 'newWidgetCtrl'
            }
          ]
    })
    .state('objets', {
        url: '/objets',
        templateUrl: 'view/objects.html',
        controller: 'objectsCtrl',
    })
    .state('scenarios', {
        url: '/scenarios',
        templateUrl: 'view/scenarios.html',
        controller: 'scenariosCtrl',
    })
    .state('login', {
        url: '/login',
        templateUrl: 'view/login.html',
        controller: 'loginCtrl',
    })
    .state('register', {
        url: '/register',
        templateUrl: 'view/register.html',
        controller: 'registerCtrl'
    })

     $httpProvider.interceptors.push('APIInterceptor');
}]);