var homeControlsServices = angular.module('homeControlsServices', []);

homeControlsServices.service('UserService', function(store) {
    var service = this,
        currentUser = null;

    service.setCurrentUser = function(user) {
        currentUser = user;
        store.set('user', user);
        return currentUser;
    };

    service.getCurrentUser = function() {
        if (!currentUser) {
            currentUser = store.get('user');
        }
        return currentUser;
    };
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
          return  $.post('/api/authenticate', credentials).success(function(data) {
        }).error(function(data) {
            console.log('Error: ' + data);
        });

         service.logout = function() {
         
        };
    };
})