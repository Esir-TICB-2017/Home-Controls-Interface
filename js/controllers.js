'use strict'

//Controlleur angular pour la page d'accueil

var homeCIController = angular.module('homeCIController',['ngDragDrop']);

homeCIController.controller('navbarCtrl',['$scope', '$http', '$timeout', function($scope,$http, $timeout){

 $scope.nomUtilisateur = "Louison";

$scope.example = {
        text: '12',
        word: /^\s*\w*\s*$/
      };

 $scope.changeUserName = function(){
        $scope.nomUtilisateur = prompt("Nouveau nom choisi : ");
          }

          $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['température intérieure', 'température extérieure'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  $timeout(function () {
    $scope.data = [
      [28, 48, 40, 19, 86, 27, 90],
      [65, 59, 80, 81, 56, 55, 40]
    ];
  }, 3000);

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

