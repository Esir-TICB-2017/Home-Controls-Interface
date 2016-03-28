// App module
var homeControlsInterfaceApp = angular.module('homeControlsInterfaceApp', ['homeCIController', 'applicationController', 'homeControlsDirectives','angular-storage','homeControlsServices','ui.router', 'ui.materialize','homeCIService']);


homeControlsInterfaceApp.config(['$stateProvider','$httpProvider', '$urlRouterProvider','USER_ROLES', function($stateProvider, $httpProvider, $urlRouterProvider, USER_ROLES) {
    
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
          ],
        data : {
            authorizedRoles : [USER_ROLES.parents, USER_ROLES.child,USER_ROLES.guest]
        }
    })
    .state('objets', {
        url: '/objets',
        templateUrl: 'views/objects.html',
        controller: 'objectsCtrl',
        data : {
            authorizedRoles : [USER_ROLES.parents, USER_ROLES.child,USER_ROLES.guest]
        }
    })
    .state('scenarios', {
        url: '/scenarios',
        templateUrl: 'views/scenarios.html',
        controller: 'scenariosCtrl',
        data : {
            authorizedRoles : [USER_ROLES.parents, USER_ROLES.guest]
        }
    })
    .state('login', {
        url: '/login',
        templateUrl: 'publicViews/login.html',
        controller: 'loginCtrl',
        data : {
            authorizedRoles : [USER_ROLES.parents, USER_ROLES.child, USER_ROLES.guest]
        }
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

homeControlsInterfaceApp.run(function($state, $rootScope, UserService,$location, AUTH_EVENTS){
    $rootScope.$on('$stateChangeStart', function(event, next){
        var user = UserService.getCurrentUser();
        var currentUrl = $location.path();
        var authorizedRoles = next.data.authorizedRoles;
        
        if(!UserService.isAuthenticated() && (currentUrl!="/login")){
            $location.path("/login");
            console.log('pas authentifié ou pas sur la bonne page');
            }
        if(!UserService.isAuthorized(authorizedRoles) && (currentUrl!="/login")){
            if(UserService.isAuthenticated){
                //User is not allowed
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                console.log("user is not allowed");
                Materialize.toast("Vous n'êtes pas autorisé a accéder à cette page", 3000);
            }
            else{
                //User is not logged in
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                $location.path('/login');
                console.log("user is not logged in");
            }
        }
        
        console.log("app.js/run/stateChangeStart, nextDataAuthorizedRoles : " + next.data.authorizedRoles);
    });
});

homeControlsInterfaceApp.constant('AUTH_EVENTS',{
    loginSucces : 'auth-login-success',
    loginFailed : 'auth-login-failed',
    logoutSucces : 'auth-logout-success',
    sessionTimeout : 'auth-session-timeout',
    notAuthenticated : 'auth-not-authenticated',
    notAuthorized : 'auth-not-authorized'
});

homeControlsInterfaceApp.constant('USER_ROLES',{
    all : '*',
    parents : 'parents',
    child : 'child',
    guest : 'guest'
});