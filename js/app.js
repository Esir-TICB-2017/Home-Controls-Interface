// App module
var homeControlsInterfaceApp = angular.module('homeControlsInterfaceApp', ['homeCIController', 'applicationController', 'homeControlsDirectives','angular-storage','homeControlsServices','ui.router', 'ui.materialize','homeCIService']);


homeControlsInterfaceApp.config(['$stateProvider','$httpProvider', '$urlRouterProvider', function($stateProvider, $httpProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/login');
    
    $httpProvider.interceptors.push('APIInterceptor');

    $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
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
        templateUrl: 'views/objects.html',
        controller: 'objectsCtrl',
    })
    .state('scenarios', {
        url: '/scenarios',
        templateUrl: 'views/scenarios.html',
        controller: 'scenariosCtrl',
    })
    .state('login', {
        url: '/login',
        templateUrl: 'publicViews/login.html',
        controller: 'loginCtrl',
    })
    .state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'registerCtrl'
    })
    .state('modal', {
        url: '/modal1',
        templateUrl: 'views/addObjectPopup.html',
        controller: 'scenariosCtrl',
    })

     
}]);

homeControlsInterfaceApp.run(function($state, $rootScope, UserService,$location){
    $rootScope.$on('$stateChangeStart', function(event, next){
        var user = UserService.getCurrentUser();
       
        currentUrl = $location.path();
        
        if(!UserService.isAuthenticated() && (currentUrl!="/login")){
            console.log("dans le if");
            
            $location.path("/login");
            }
        else{
            console.log("dans le else");
        }
        
    });
});