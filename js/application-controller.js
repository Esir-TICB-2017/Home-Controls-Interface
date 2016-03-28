
'use strict'
//Controlleur angular pour la page d'accueil
var applicationController = angular.module('applicationController', []);
applicationController.controller('applicationController', function($scope, $location, $rootScope, $state, UserService, USER_ROLES) {
    //Broadcast the username of the user if he has been connected the last time he was on the application 
    if(UserService.getCurrentUser()){$rootScope.username = UserService.getCurrentUser().username;}
    
    //Creation des variables fonction active
    var main = this;
    $scope.activeHome = "active";
    $scope.activeScenarios = "";
    $scope.activeObjets = "";
    $scope.activePage = "#" + $location.path();
    $scope.isAuthorized = UserService.isAuthorized;
    
    $scope.userRole = USER_ROLES;
    
    /**
     * This function is used to switch highlighted tabs in the navbar on click
     * @param  {Link of the tab}
     * @return {null}
     */
    $scope.reload = function(link) {
        //Calcule de la valeur des variables utilisées pour montrer à l'utilisateur sur quel vue il est dans la navbar
        if (link == "activePage") {
            link = $scope.activePage
        } else $scope.activePage = link;
        if (link == "#/home") $scope.activeHome = "active";
        else $scope.activeHome = "";
        if (link == "#/scenarios") $scope.activeScenarios = "active";
        else $scope.activeScenarios = "";
        if (link == "#/objets") $scope.activeObjets = "active";
        else $scope.activeObjets = "";
    }

    $scope.logout = function() {
        main.currentUser = UserService.setCurrentUser(null);
        location.reload();
    }
    $rootScope.$on('authorized', function() {
        main.currentUser = UserService.getCurrentUser();
    });
    $rootScope.$on('unauthorized', function() {
        main.currentUser = UserService.setCurrentUser(null);
        $state.go('login');
    });
    main.currentUser = UserService.getCurrentUser();
    
})