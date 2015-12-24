'use strict'

//Controlleur angular pour la page d'accueil

var applicationController = angular.module('applicationController',[]);

applicationController.controller('applicationController', function ($scope, $location ,USER_ROLES, AuthService) {
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
    $scope.isAuthorized = AuthService.isAuthorized;

    $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };
})