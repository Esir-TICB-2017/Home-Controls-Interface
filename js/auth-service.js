var homeControlsServices = angular.module('homeControlsServices',[]);

homeControlsServices.factory('AuthService', function ($http, Session) {
  var authService = {};

  authService.login = function (credentials) {

    var user = [{"id":"12" ,"username": "loulouxd", "role": "Admin", "auth": false }]

  /*$.ajax({
    url : '/res.json',
    type : 'GET',
    dataType : "json",

    success:function(data, textStatus, jqXHR) {
    console.log('success');
    user = data['user'];
    console.log(user);
    console.log(data[0]);

  },
  error: function(jqXHR, textStatus, errorThrown) {
     //if fails
     console.log('error');
    } 

      });*/

    if(credentials.username != "loulouxd")
    {
    	console.log("username incorrect");
      Materialize.toast("Nom d'utilisateur incorrect", 4000)
      user[0].auth = false;
      return user;
    }
    else if (credentials.password != "123456")
    {
    	console.log("password incorrect");
       Materialize.toast('Mot de passe incorrect', 4000)
      user[0].auth = false;
      return user;
    }
    else
    {
    	console.log("vous êtes identifié");
      Materialize.toast('vous êtes identifié', 4000)
      Session.create(user[0].id, user[0].username, user[0].role);
      user[0].auth=true;
      return user;
    }
  };
 
  authService.isAuthenticated = function () {
    return !!Session.userId;
  };
 
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };
 
  return authService;
})

homeControlsServices.factory('AuthInterceptor', function ($rootScope, $q,
                                      AUTH_EVENTS) {
  return {
    responseError: function (response) { 
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.sessionTimeout,
        440: AUTH_EVENTS.sessionTimeout
      }[response.status], response);
      return $q.reject(response);
    }
  };
})