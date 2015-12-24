'use strict'

//Controlleur angular pour la page d'accueil

var homeCIController = angular.module('homeCIController',[]);

homeCIController.controller('navbarCtrl',['$scope', '$http','$location', function($scope, $http, $location, USER_ROLES, AuthService){
    
    //Creation des variables fonction active
    $scope.activeHome = "active";
    $scope.activeScenarios = "";
    $scope.activeObjets = "";
    $scope.activePage = "#" + $location.path();
    
    $scope.reload = function(link){
      
        //Calcule de la valeur des variables utilisées pour montrer à l'utilisateur sur quel vue il est dans la navbar
        if(link == "activePage"){link = $scope.activePage} else $scope.activePage = link;
        if(link == "#/home") $scope.activeHome = "active"; else $scope.activeHome = "";
        if(link == "#/scenarios") $scope.activeScenarios = "active" ; else $scope.activeScenarios = "";
        if(link == "#/objets") $scope.activeObjets = "active" ; else $scope.activeObjets = "";
    }


          $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    /*$scope.isAuthorized = AuthService.isAuthorized;*/

    $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };
    }]);  

homeCIController.controller('homeCtrl',['$scope', '$http', function($scope,$http){

    var activeMenu = $('#menu'); 

    $scope.titleView = "Vue Home";

    $('.collapsible').collapsible({
      accordion : false
    });
  
}]); 

homeCIController.controller('scenariosCtrl',['$scope', '$http', function($scope,$http){

    $scope.titleView = "Vue scénarios";
    }]); 

homeCIController.controller('objectsCtrl',['$scope', '$http', function($scope,$http){

$http.get("/data/listeobjets.json").success(function(data){
        $scope.listObjects = data;
          });
$http.get("/data/listepieces.json").success(function(data){
        $scope.listRooms = data;
          });

    }]);

homeCIController.controller('loginCtrl', function($scope, $http, $rootScope, AUTH_EVENTS, AuthService){


    $scope.titleView = "Login";

 $scope.credentials = {
    username: '',
    password: ''
  };

  $scope.login = function (credentials) {

    var user = AuthService.login(credentials);

    if(user[0].auth == true)
    {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(user);
    }
    else
    {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    }
  };
    });

homeCIController.controller('registerCtrl',['$scope', '$http', function($scope,$http){

    $scope.titleView = "S'enregistrer";
    }]);
 

