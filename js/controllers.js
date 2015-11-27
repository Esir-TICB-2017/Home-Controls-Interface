'use strict'

//Controlleur angular pour la page d'accueil

var homeCIController = angular.module('homeCIController',['ngDragDrop']);

homeCIController.controller('navbarCtrl',['$scope', '$http', '$timeout', function($scope,$http, $timeout){

 $scope.nomUtilisateur = "Louison";

 $scope.changeUserName = function(){
        $scope.nomUtilisateur = prompt("Nouveau nom choisi : ");
          }
    }]);  

homeCIController.controller('homeCtrl',['$scope', '$http', function($scope,$http){
    
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

