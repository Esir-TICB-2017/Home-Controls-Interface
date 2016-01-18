'use strict'
//Controlleur angular pour la page d'accueil
var homeCIController = angular.module('homeCIController', []);
homeCIController.controller('homeCtrl', ['$scope', '$http', function($scope, $http, $state) {
    var objectList = {};
    var activeMenu = $('#menu');
    $scope.titleView = 'Vue Home';
    $('.collapsible').collapsible({
        accordion: false
    });
    $http.get('/api/getObjects').success(function(data) {
        objectList = data;
        $scope.listObjects = data;
    });
}]);
homeCIController.controller('scenariosCtrl', ['$scope', '$http', function($scope, $http, $state) {
    $scope.titleView = 'Vue scénarios';
    
}]);
homeCIController.controller('objectsCtrl', ['$scope', '$http', function($scope, $http, $state) {
    var objectList = {};
    var roomList = {};
    $scope.obj = {
        objectName: ''
    };
    $scope.room = {
        roomName: ''
    };
    $http.get('/api/getObjects').success(function(data) {
        objectList = data;
        $scope.listObjects = data;
    });
    $http.get('/api/getRooms').success(function(data) {
        roomList = data;
        $scope.listRooms = data;
    });

    $scope.addObject = function(obj) {
        var object = {};
        
        var data = "name=" + obj.objectName;
        $http({
            method: 'POST',
            url: '/api/setObject',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        }).
        success(function(response) {
            console.log(response);
            $scope.codeStatus = response.data;
            object = response;
            Materialize.toast('Objet créé !', 4000);
            $http.get('/api/getObjects').success(function(data) {
        objectList = data;
        $scope.listObjects = data;
    });
        }).
        error(function(response) {
            $scope.codeStatus = response || "Request failed";
        });
    }

    $scope.addRoom = function(room) {
        var object = {};
        
        var data = "name=" + room.roomName;
        $http({
            method: 'POST',
            url: '/api/setRoom',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        }).
        success(function(response) {
            console.log(response);
            $scope.codeStatus = response.data;
            object = response;
            Materialize.toast('Room created !', 4000);
            $http.get('/api/getRooms').success(function(data) {
        roomList = data;
        $scope.listRooms = data;
    });
        }).
        error(function(response) {
            $scope.codeStatus = response || "Request failed";
        });
    }

    $scope.deleteObject = function(object) {
        var obj = {};
        var data = "objectId=" + object._id;
        console.log(data);
        $http({
            method: 'DELETE',
            url: '/api/deleteObject',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        }).
        success(function(response) {
            console.log(response);
            $scope.codeStatus = response.data;
            obj = response;
            Materialize.toast('Object deleted !', 4000);
            $http.get('/api/getObjects').success(function(data) {
        objectList = data;
        $scope.listObjects = data;
    });
        }).
        error(function(response) {
            $scope.codeStatus = response || "Request failed";
        });
    }

    $scope.deleteRoom = function(room) {
        var object = {};
        var data = "roomId=" + room._id;
        console.log(data);
        $http({
            method: 'DELETE',
            url: '/api/deleteRoom',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        }).
        success(function(response) {
            console.log(response);
            $scope.codeStatus = response.data;
            object = response;
            Materialize.toast('Room deleted !', 4000);
            $http.get('/api/getRooms').success(function(data) {
            roomList = data;
            $scope.listRooms = data;
            });
        }).
        error(function(response) {
            $scope.codeStatus = response || "Request failed";
        });
    }


    function getOneObject(objectId) {
        var object = {};
        var data = "objectId=" + objectId;
        $http({
            method: 'POST',
            url: '/api/getOneObject',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).
        success(function(response) {
            console.log(response);
            $scope.codeStatus = response.data;
            object = response;
            return object;
        }).
        error(function(response) {
            $scope.codeStatus = response || "Request failed";
        });
    };
    $scope.addToRoom = function(object) {
        console.log();
        var roomId = roomList[0]._id;
        var objectId = object._id;
        var data = "objectId=" + objectId + "&roomId=" + roomId;
        var objectId = object._id;
        var roomId = $http({
            method: 'PUT',
            url: '/api/addObjectToRoom',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).
        success(function(response) {
            $scope.codeStatus = response.data;
        }).
        error(function(response) {
            $scope.codeStatus = response || "Request failed";
        });
        return false;
    };
    $scope.deleteFromRoom = function(object) {
        var roomId = roomList[0]._id;
        var objectId = object._id;
        var data = "objectId=" + objectId + "&roomId=" + roomId;
        var objectId = object._id;
        var roomId = $http({
            method: 'DELETE',
            url: '/api/deleteObjectFromRoom',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).
        success(function(response) {
            $scope.codeStatus = response.data;
        }).
        error(function(response) {
            $scope.codeStatus = response || "Request failed";
        });
        return false;
    };
}]);
homeCIController.controller('loginCtrl', function($scope, $http, $rootScope, $location, $state, LoginService, UserService) {
    $scope.titleView = 'Login';
    $scope.credentials = {
        username: '',
        password: ''
    };
    $scope.login = function(credentials) {
        LoginService.login(credentials).then(function(response) {
            Materialize.toast(response.message, 4000);
            if (response.success) {
                console.log("Auth réussie");
                credentials.access_token = response.token;
                UserService.setCurrentUser(credentials);
                $rootScope.$broadcast('authorized');
                $state.go('home');
            } else {
                console.log("No Auth");
                $rootScope.$broadcast('unauthorized');
            }
        });
    }
});
homeCIController.controller('registerCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.titleView = 'S\'enregistrer';
}]);