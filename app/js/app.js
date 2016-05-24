// App module
var homeControlsInterfaceApp = angular.module('homeControlsInterfaceApp', ['homeCIController', 'applicationController', 'homeControlsDirectives', 'ui.router', 'ui.materialize', 'homeCIService', 'angular-storage']);
homeControlsInterfaceApp.config(['$stateProvider', '$httpProvider', '$urlRouterProvider', 'USER_ROLES', function($stateProvider, $httpProvider, $urlRouterProvider, USER_ROLES) {
    //redirect the user to /login if he try to reach an unvalid address
    $urlRouterProvider.otherwise('/login');
    //Push the interceptor in the application
    $httpProvider.interceptors.push('APIInterceptor');
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'homeCtrl',
        children: [{
            name: 'newWidget',
            templateUrl: 'newWidget.html',
            controller: 'newWidgetCtrl'
        }],
        data: {
            authorizedRoles: [USER_ROLES.parents, USER_ROLES.child, USER_ROLES.guest]
        }
    }).state('objets', {
        url: '/objets',
        templateUrl: 'views/objects.html',
        controller: 'objectsCtrl',
        data: {
            authorizedRoles: [USER_ROLES.parents, USER_ROLES.child, USER_ROLES.guest]
        }
    }).state('scenarios', {
        url: '/scenarios',
        templateUrl: 'views/scenarios.html',
        controller: 'scenariosCtrl',
        data: {
            authorizedRoles: [USER_ROLES.parents, USER_ROLES.guest]
        }
    }).state('auth', {
        url: '/auth',
        template: '<h1>Récupération du token</h1>'
    }).state('login', {
        url: '/login',
        templateUrl: 'publicViews/login.html',
        controller: 'loginCtrl',
        data: {
            authorizedRoles: [USER_ROLES.parents, USER_ROLES.child, USER_ROLES.guest]
        }
    }).state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'registerCtrl'
    }).state('modal', {
        url: '/modal1',
        templateUrl: 'views/addObjectPopup.html',
        controller: 'scenariosCtrl',
    }).state('administration', {
        url: '/administration',
        templateUrl: 'views/administration.html',
        controller: 'administrationCtrl',
        data: {
            authorizedRoles: [USER_ROLES.parents]
        }
    })
}]);
//Function called on each route change
homeControlsInterfaceApp.run(function($state, $rootScope, UserService, $location, AUTH_EVENTS) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
        var user = UserService.getCurrentUser();
        var currentUrl = $location.path();
        var authorizedRoles = next.data.authorizedRoles;
        if (!UserService.isAuthenticated() && (currentUrl != "/login")) {
            event.preventDefault();
            console.log('utilisateur pas authentifié');
            //Fais les deux pour doubler les chances que ça fonctionne
            $location.path("/login");
            $state.go('login');
        }
        else if (!UserService.isAuthorized(authorizedRoles) && (currentUrl != "/login")) {
            if (UserService.isAuthenticated()) {
                //User is not allowed
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                console.log("user is not allowed");
                Materialize.toast("Vous n'êtes pas autorisé a accéder à cette page, redirection vers la page home", 3000);
                $location.path('/home');
                //Deuxième essai
                event.preventDefault();
                $state.go('home');
            } else {
                //User is not logged in
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                console.log("user is not logged in");
                $location.path('/login');
                //Deuxième essai
                event.preventDefault();
                $state.go('login');
            }
        }
        if(UserService.isAuthenticated() && next.name == "login"){
            $location.path('/home');
            //Deuxième essai
            event.preventDefault();
            $state.go('home');
        }
        if (UserService.isAuthenticated()) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSucces);
        }
        $rootScope.$broadcast(next.data.authorizedRoles);
    });
});
homeControlsInterfaceApp.constant('AUTH_EVENTS', {
    loginSucces: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSucces: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});
homeControlsInterfaceApp.constant('USER_ROLES', {
    all: '*',
    parents: 'parents',
    child: 'child',
    guest: 'guest'
});