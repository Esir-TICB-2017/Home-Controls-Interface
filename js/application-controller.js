
'use strict'
//Controlleur angular pour la page d'accueil
var applicationController = angular.module('applicationController', []);
applicationController.controller('applicationController', function($scope, $location, $rootScope, $state, UserService) {
    //Creation des variables fonction active
    var main = this;
    $scope.activeHome = "active";
    $scope.activeScenarios = "";
    $scope.activeObjets = "";
    $scope.activePage = "#" + $location.path();
    document.addEventListener('keydown', function(event) {
        if (event.keyCode == 37) {
            console.log(UserService.getCurrentUser());
        }
    });
    this.topDirections = ['left', 'up'];
    this.bottomDirections = ['down', 'right'];
    this.isOpen = false;
    this.availableModes = ['md-fling', 'md-scale'];
    this.selectedMode = 'md-fling';
    this.availableDirections = ['up', 'down', 'left', 'right'];
    this.selectedDirection = 'up';
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
    document.addEventListener('keydown', function(event) {
        if (event.keyCode == 37) {}
    });

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