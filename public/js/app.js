// App module
<<<<<<< Updated upstream
var homeControlsInterfaceApp = angular.module('homeControlsInterfaceApp', ['homeCIController', 'applicationController', 'homeControlsDirectives','angular-storage','homeControlsServices','ui.router', 'ui.materialize','homeCIService']);
=======
var homeControlsInterfaceApp = angular.module('homeControlsInterfaceApp', ['homeCIController', 'applicationController', 'homeControlsDirectives','angular-storage','homeControlsServices','ui.router']);
>>>>>>> Stashed changes

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
    .state('modal', {
        url: '/modal1',
        templateUrl: 'view/addObjectPopup.html',
        controller: 'scenariosCtrl',
    })

     $httpProvider.interceptors.push('APIInterceptor');
}]);