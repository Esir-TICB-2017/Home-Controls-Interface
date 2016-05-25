'use strict'
//Controlleur angular pour la page d'accueil
var applicationController = angular.module('applicationController', []);
applicationController.controller('applicationController', function($scope, $location, $rootScope, $state, UserService, USER_ROLES, AUTH_EVENTS, socket) {
    //Broadcast the username of the user if he has been connected the last time he was on the application 
    //
    $scope.objectFunction = function(nameFct, idObject) {
        console.log(nameFct);
        var data = {
            nameFct: nameFct,
            id: idObject
        };
        socket.emit('objectFunction', data);
    };
    socket.on('upResponse', function(data) {
        console.log(data);
    })
    if (UserService.getCurrentUser()) {
        $rootScope.username = UserService.getCurrentUser().username;
    }
    //Creation of the variables function active
    var main = this;
    $scope.activeHome = "active";
    $scope.activeScenarios = "";
    $scope.activeObjets = "";
    $scope.activePage = "#" + $location.path();
    $scope.isAuthorized = UserService.isAuthorized;
    $scope.userRole = USER_ROLES;
    $scope.currentUser = null;
    $scope.canAccessAdmin = null;
    //Recover the user if he has been logged in the last time
    if (UserService.getCurrentUser()) {
        $scope.currentUser = UserService.getCurrentUser();
    }
    //Function that set the currentUser
    $scope.setCurrentUser = function(user) {
            $scope.currentUser = user;
        }
        /**
         * This function is used to switch highlighted tabs in the navbar on click
         * @param  {Link of the tab}
         * @return {null}
         */
    $scope.reload = function(link) {
            //Calculate the value of the var used to show the user which page he is currently on
            if (link == "activePage") {
                link = $scope.activePage
            } else $scope.activePage = link;
            if (link == "#/home") $scope.activeHome = "active";
            else $scope.activeHome = "";
            if (link == "#/scenarios") $scope.activeScenarios = "active";
            else $scope.activeScenarios = "";
            if (link == "#/objets") $scope.activeObjets = "active";
            else $scope.activeObjets = "";
            if (link == "#/automation") $scope.activeAutomation = "active";
            else $scope.activeAutomation = "";
        }
        //Log the user out
    $scope.logout = function() {
            main.currentUser = UserService.setCurrentUser(null);
            location.reload();
        }
        //Listener that copy the user and check whether the user has the right to access the administration page
    $rootScope.$on(AUTH_EVENTS.loginSucces, function() {
        $scope.currentUser = UserService.getCurrentUser();
        $scope.canAccessAdmin = ($scope.currentUser.role == $scope.userRole.parents) ? true : false;
    });
    $rootScope.$on('authorized', function() {
        main.currentUser = UserService.getCurrentUser();
    });
    $rootScope.$on('unauthorized', function() {
        main.currentUser = UserService.setCurrentUser(null);
        $state.go('login');
    });
    main.currentUser = UserService.getCurrentUser();
})