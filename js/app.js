//Reste à faire dans le tuto : Issues with the login form

// App module

var homeControlsInterfaceApp = angular.module('homeControlsInterfaceApp', [
    'homeControlsDirectives',
	'ngRoute',
	'homeCIController',
	'chart.js',
    'homeControlsServices'    
	]);

homeControlsInterfaceApp.config(['$routeProvider','AUTH_EVENTS','USER_ROLES',
	function($routeProvider,USER_ROLES,AUTH_EVENTS) {
		$routeProvider.
		when('/home', {
			templateUrl: 'view/home.html',
        	controller: 'homeCtrl',
            data : {
               authorizedRoles : [USER_ROLES.all]
            }
		}).
		when('/objets', {
			templateUrl: 'view/objects.html',
        	controller: 'objectsCtrl',
            data : {
               authorizedRoles : [USER_ROLES.all]
            }
		}).
		when('/scenarios', {
			templateUrl: 'view/scenarios.html',
        	controller: 'scenariosCtrl',
            data : {
               authorizedRoles : [USER_ROLES.all]
            }
		})
		.when('/login', {
			templateUrl: 'view/login.html',
        	controller: 'loginCtrl'
		})
		.when('/register', {
			templateUrl: 'register.html',
        	controller: 'registerCtrl',
            data : {
               authorizedRoles : [USER_ROLES.all]
            }
		})
		.otherwise({ redirectTo: '/login' });
	}]);

homeControlsInterfaceApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push(['$injector',function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
});

homeControlsInterfaceApp.run(['$rootScope','AUTH_EVENTS','AuthenticationService','$location',
                              function($rootScope,AUTH_EVENTS,AuthenticationService,$location){
                
    $rootScope.$on('$routeChangeStart',function(event, next){
        
        //We update the isLoginPage
        if(next.templateUrl=="view/login.html"){$rootScope.$broadcast('isLoginPage', {isLoginPage : "true"})}
        else{$rootScope.$broadcast('isLoginPage',{isLoginPage : "false"})}
        
        //Retrieve the next page authorized roles
        var authorizedRoles = next.data.authorizedRoles;

        //We test user's authorization to access the page
        if(!AuthenticationService.isAuthorized(authorizedRoles)){
            $rootScope.$broadcast('isLoginPage', {isLoginPage : "true"})
            event.preventDefault();
            
            if(AuthenticationService.isAuthenticated()){
                //user is authenticated but nos allowed to access the page
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            }else{
                //user is not logged in
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }
    });
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
});