'use strict'

//Controlleur angular pour la page d'accueil

var homeCIController = angular.module('homeCIController',['ngDragDrop']);

homeCIController.controller('navbarCtrl',['$scope', '$http', '$timeout','$location', function($scope,$http, $timeout, $location){
    
    //Creation des variables fonction active
    $scope.activeHome = "active";
    $scope.activeScenarios = "";
    $scope.activeObjets = "";
    $scope.pageActive = "#" + $location.path();
    
    $scope.nomUtilisateur = "Louison";
    
    
    
    $scope.reload = function(lien){
        //Calcule de la valeur des variables utilisées pour montrer à l'utilisateur sur quel vue il est dans la navbar
        if(lien == "pageActive"){lien = $scope.pageActive} else $scope.pageActive = lien;
        if(lien == "#/home") $scope.activeHome = "active"; else $scope.activeHome = "";
        if(lien == "#/scenarios") $scope.activeScenarios = "active" ; else $scope.activeScenarios = "";
        if(lien == "#/objets") $scope.activeObjets = "active" ; else $scope.activeObjets = "";
    }
    

 $scope.changeUserName = function(){
        $scope.nomUtilisateur = prompt("Nouveau nom choisi : ");
          }
    }])
;  

homeCIController.controller('homeCtrl',['$scope', '$http', function($scope,$http){

    var activeMenu = $('#menu'); 
    
    $http.get("/listewidget.json").success(function(data){
        $scope.listewidget = data;
    });

    $scope.titleView = "Vue Home";

    $('.collapsible').collapsible({
      accordion : false
    });
  
}]); 

homeCIController.controller('scenariosCtrl',['$scope', '$http', function($scope,$http){

    $scope.titleView = "Vue scénarios";
    }]); 

homeCIController.controller('objetsCtrl',['$scope', '$http', function($scope,$http){

    $scope.titleView = "Vue objets";
    }]);

homeCIController.controller('loginCtrl',['$scope', '$http', function($scope,$http){

    $scope.titleView = "Login";
    }]);

homeCIController.controller('registerCtrl',['$scope', '$http', function($scope,$http){

    $scope.titleView = "S'enregistrer";
    }]);

