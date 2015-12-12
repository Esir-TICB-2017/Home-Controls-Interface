'use strict'

//Controlleur angular pour la page d'accueil

var homeCIController = angular.module('homeCIController',['ngDragDrop']);

homeCIController.controller('navbarCtrl',['$scope', '$http', '$timeout','$location', function($scope,$http, $timeout, $location){
    
    //Creation des variables fonction active
    $scope.activeHome = "active";
    $scope.activeScenarios = "";
    $scope.activeObjets = "";
    $scope.activePage = "#" + $location.path();
    
    $scope.userName = "Louison";
    
    
    
    $scope.reload = function(link){
        //Calcule de la valeur des variables utilisées pour montrer à l'utilisateur sur quel vue il est dans la navbar
        if(link == "activePage"){link = $scope.activePage} else $scope.activePage = link;
        if(link == "#/home") $scope.activeHome = "active"; else $scope.activeHome = "";
        if(link == "#/scenarios") $scope.activeScenarios = "active" ; else $scope.activeScenarios = "";
        if(link == "#/objets") $scope.activeObjets = "active" ; else $scope.activeObjets = "";
    }
    

 $scope.changeUserName = function(){
        $scope.userName = prompt("Nouveau nom choisi : ");
          }
    }])
;  

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

