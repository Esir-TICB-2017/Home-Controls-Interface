'use strict'

//Controlleur angular pour la page d'accueil

var homeCIController = angular.module('homeCIController',[]);

homeCIController.controller('homeCtrl',['$scope', '$http', function($scope,$http){
    
    $http.get("phones.json").success(function(data){
        $scope.phones = data;
    });
    
    $scope.nomUtilisateur = "Louison";
    
    $scope.etatLampe = "Light-On.png";
    
     $scope.changeUserName = function(){
        $scope.nomUtilisateur = prompt("Nouveau nom choisi : ");
    }
     
     $scope.switchLampe = function(){
         if($scope.etatLampe=="Light-On.png"){
             $scope.etatLampe = "Light-Off.png";
             alert("Extinction de la lumière");
         }
         else{ 
             $scope.etatLampe = "Light-On.png";
             alert("Allumage de la lumière");
         }
     }
}]); 