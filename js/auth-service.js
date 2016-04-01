var homeControlsServices = angular.module('homeControlsServices', []);
homeControlsServices.service('UserService', function( USER_ROLES) {
    
    /*User Architecture :
    User {
        name : String,
        password : String,
        role : String,
        access_token : String
    }*/
    var service = {},
        currentUser = null;
    service.setCurrentUser = function(user) {
        currentUser = user;
        //Temporaire, à retirer quand il sera implementé dans le backend
        if(currentUser){user.role = USER_ROLES.parents;}
       // store.set('user', user);
        return currentUser;
    };
    service.getCurrentUser = function() {
        if (!currentUser) {
           // currentUser = store.get('user');
        }
        return currentUser;
    };
    
    service.isAuthenticated = function(){
        if(currentUser){
            return currentUser.isAuthenticated;
        }
        else{return false;}
        
    };
    
    service.isAuthorized = function(authorizedRoles){
        service.setCurrentUser(currentUser);
        //if the var is not a table we convert it to a table
        if(!angular.isArray(authorizedRoles)){
            authorizedRoles = [authorizedRoles];
        }
        return(service.isAuthenticated() && (authorizedRoles.indexOf(currentUser.role) !== -1));    
    };
    
    return service;
})

homeControlsServices.service('APIInterceptor', function($rootScope, UserService) {
    var service = this;
    service.request = function(config) {
        var currentUser = UserService.getCurrentUser(),
            access_token = currentUser ? currentUser.access_token : null;
        if (access_token) {
            config.headers.authorization = access_token;
        }
        return config;
    };
    service.responseError = function(response) {
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');
        }
        return response;
    };
})

homeControlsServices.service('LoginService', function($http) {
    var service = this;
    service.login = function(credentials) {
        return $.post('/api/authenticate', credentials).success(function(data) {}).error(function(data) {
            console.log('Error: ' + data);
        });
        service.logout = function() {};
    };
})