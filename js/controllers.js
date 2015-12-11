'use strict'

//Angular controller's for the home page

var homeCIController = angular.module('homeCIController',['ngDragDrop']);

homeCIController.controller('appCtrl',['$scope', '$http', '$timeout','$location','USER_ROLES','AuthenticationService', function($scope,$http, $timeout, $location,USER_ROLES,AuthenticationService){
    
    //Creation of variables used to say to the navbar which page is active
    $scope.activeHome = "active";
    $scope.activeScenarios = "";
    $scope.activeObjets = "";
    $scope.activePage = "#" + $location.path();
    
    //Instantiate isLoginPage to check if angular needs or not to display the login-box
    $scope.isLoginPage = false;
    
    $scope.reload = function(link){
        //Tests to define which page is active
        if(link == "activePage"){link = $scope.activePage} else $scope.activePage = link;
        if(link == "#/home") $scope.activeHome = "active"; else $scope.activeHome = "";
        if(link == "#/scenarios") $scope.activeScenarios = "active" ; else $scope.activeScenarios = "";
        if(link == "#/objets") $scope.activeObjets = "active" ; else $scope.activeObjets = "";
    }
    
    $scope.userName = "Louison" ;
    $scope.changeUserName = function(){
        $scope.userName = prompt("Nouveau nom choisi : ");
    }
    
    $scope.currentUser = null;
    $scope.roles = USER_ROLES;
    $scope.isAuthorized = AuthenticationService.isAuthorized;
    $scope.setCurrentUser = function(user){
        $scope.currentUser = user;
    };
 
    }])
;  

homeCIController.controller('homeCtrl',['$scope', '$http', function($scope,$http){

    var activeMenu = $('#menu'); 
    
    $http.get("/listewidget.json").success(function(data){
        $scope.listWidget = data;
    });

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

homeCIController.controller('loginCtrl',['$scope', '$http','$rootScope','AUTH_EVENTS','AuthenticationService', function($scope,$http,$rootScope,AUTH_EVENTS,AuthenticationService){

    $scope.titleView = "Login";
    
    //using tutorial on medium
    $scope.credentials = {
        username : '',
        password : ''
    };
    
    
    $scope.login = function(credentials){
        AuthenticationService.login(credentials).then(function(user){
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user);
        });
    };
    
    }]);

homeCIController.controller('registerCtrl',['$scope', '$http', function($scope,$http){

    $scope.titleView = "S'enregistrer";
    }]);

