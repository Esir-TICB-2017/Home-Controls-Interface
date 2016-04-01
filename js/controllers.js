'use strict'
//Controlleur angular pour la page d'accueil
var homeCIController = angular.module('homeCIController', []);

homeCIController.controller('homeCtrl', ['UserService', '$scope', '$http','$state', function(UserService,$scope, $http, $state) {
    var objectList = {};
    var activeMenu = $('#menu');
    $scope.titleView = 'Vue Home';
    
    $scope.isAuthorized = UserService.isAuthorized;
    
    $scope.allumerLampe = function(){
        $http.get('/onspot');
    }
    
    $scope.eteindreLampe = function(){
        $http.get('/offspot');
    }
    
    
    $('.collapsible').collapsible({
        accordion: false
    });
    $http.get('/getObjects').success(function(data) {
        objectList = data;
        $scope.listObjects = data;
    });
}]);

homeCIController.controller('scenariosCtrl', ['UserService', '$scope', '$http','$state','newScenario', function(UserService, $scope, $http,$state,newScenario) {
    $scope.isAuthorized = UserService.isAuthorized;
    
    if(UserService.getCurrentUser()){$scope.currentUser = UserService.getCurrentUser()};
    
    $scope.authorizedRoles =  $state.current.data.authorizedRoles;
    
    if($scope.isAuthorized($scope.authorizedRoles)){
    
        //First : download scenarios already created
        $http.get('/getScenarios').success(function(data){
            $scope.scenarios = data;
        });

        $scope.switchScenarioActivation = function(scenario){
            //To write
            if(scenario.active){
                Materialize.toast(scenario.name + " desactivé !",2000);
                scenario.active = false;
            }
            else{
                Materialize.toast(scenario.name + " activé !",2000);
                scenario.active = true;
            }

        };

        //Properties to create a new scenario
        $scope.isCreatingANewScenario = false;
        $scope.titleView = "Vue scénarios";
        $scope.showAddObjectsMenu = false;
        $scope.showAddSensorMenu = false;

        $scope.rooms = [];
        $scope.objectsAvailable = [];
        $scope.sensorsAvailable = [];
        /*
        $scope.sensorsAvailable=[
            {
                name:"Station netatmo",
                room:"Salle de bain",
                type:"capteur",
                idObject : 1,
                functions : [
                    {
                        name: "CO2",
                        value: 300,
                        checked : false,
                        condition: "",
                        idObject:1,
                        idSensor:1
                    },
                    {
                        name: "Humidité",
                        value: 50,
                        checked : false,
                        condition: "",
                        idObject:1,
                        idSensor:2
                    },
                    {
                        name: "Température",
                        value: 21,
                        checked : false,
                        condition: "",
                        idObject:1,
                        idSensor:3
                    }
                ]
            }

        ];
        */

        $scope.newScenario = newScenario.getScenario(); 

        $scope.objectForModal = {};
        $scope.modifyingScenario = false;

        $scope.startCreatingNewScenario = function(){
            Materialize.toast('Création d\'un nouveau scenario',2000);
            $scope.isCreatingANewScenario = true;

            //Download the rooms, objects and sensors available
            $http.get('/getRooms').success(function(data){
                $scope.rooms = data;
            });
            $http.get('/getObjects').success(function(data){
                $scope.objectsAvailable = data;
            });
            $http.get('/getSensors').success(function(data){
                $scope.sensorsAvailable = data;
            });

            //Initialize the service newScenario
            newScenario.initNewScenario();
            $scope.newScenario = newScenario.getScenario();

            //Position the window on the first-step of the creation
            angular.element(document.querySelector('#secondStep')).click();
            angular.element(document.querySelector('#firstStep')).click();  

        };

        $scope.stopCreatingNewScenario = function(displayMessage){

            if(displayMessage){
                Materialize.toast('Vous avez décidé d\'arrêter la création d\'un scénario',3000);
            }

            $scope.isCreatingANewScenario = false;

            newScenario.initNewScenario();
            $scope.newScenario = newScenario.getScenario();
        };

        $scope.validateStep1 = function(){
            newScenario.setName($scope.newScenario.name);
            newScenario.setAutorization($scope.newScenario.autorization);
            newScenario.setOnTop($scope.newScenario.onTop);
            angular.element(document.querySelector('#secondStep')).click();
        };

        $scope.addObjectToScenario = function(object){

            newScenario.addObject(object);
            $scope.newScenario = newScenario.getScenario();
            $scope.objectsAvailable = newScenario.deleteObjectInATable($scope.objectsAvailable,object);

            //Hide the list of objects on small screens
            if($scope.showAddObjectsMenu){
                $scope.showAddObjectsMenu = false;
            }

        };

        $scope.deleteObjectFromScenario = function(object){
            $scope.objectsAvailable.push(newScenario.deleteObject(object));
            $scope.newScenario = newScenario.getScenario();
        };

        $scope.modifyObjectsParameter = function(object){
            $scope.objectForModal = clone(object);
            $('#modalObject').openModal();
        };

        $scope.validateObjectsModification = function(){
            $('#modalObject').closeModal();
            newScenario.modifyObjectsParameter($scope.objectForModal);
            $scope.objectForModal = {};
            $scope.newScenario = newScenario.getScenario();
        }


        //Functions dealing with the conditions

        //Move the sensor from the list of sensors available to the list of sensors chosen
        $scope.addSensorToConditions = function(sensor){
            newScenario.addSensor(sensor);
            $scope.newScenario = newScenario.getScenario();

            $scope.sensorsAvailable = newScenario.deleteObjectInATable($scope.sensorsAvailable,sensor);

            //Hide the list of sensors on small screens
            if($scope.showAddSensorMenu){
                $scope.showAddSensorMenu = false;
            }
        };

        //Function linked to the X button on the sensors selected in the "troisieme etape : conditions de declenchement/capteurs séléctionnés"
        $scope.removeSensorFromConditions = function(sensor){
            //Uncheck the checkbox and empty the condition for a selected sensor
            for(var i = 0;i<sensor.functions.length;i++){
                sensor.functions[i].checked = false;
                sensor.functions[i].condition = "";
            }

            //Remove the sensor
            newScenario.removeSensor(sensor);

            //Put the sensor removed from the sensors selected in the sensorsAvailable table
            $scope.sensorsAvailable.push(sensor);

            $scope.newScenario = newScenario.getScenario();
        };

        //Put the sensors provided by a sensor-device in a table which list every sensor provided by the device to create new conditions
        function generateSensorsList(){
            newScenario.generateSensorsList();
            $scope.newScenario = newScenario.getScenario();
        }

        //Save the condition written by the user when he clicks the OK button
        $scope.saveCondition = function(sensor){
            newScenario.saveCondition(sensor);
            $scope.newScenario = newScenario.getScenario();
        };

        $scope.saveNewScenario = function(){

            if($scope.modifyingScenario == false){
                let scenarioJustCreated = newScenario.saveScenario(false);
                $scope.stopCreatingNewScenario(false);

                //Add the new scenario in the DB
                saveScenarioInDB(scenarioJustCreated);
            }
            else{
                for(var i=0;i < $scope.scenarios.length;i++){
                    if($scope.scenarios[i].id == $scope.newScenario.id){
                        let scenarioJustCreated = newScenario.saveScenario(true) ;
                        $scope.stopCreatingNewScenario(false);
                        $scope.modifyingScenario = false;

                        //Add the new scenario in the DB
                        saveScenarioInDB(scenarioJustCreated);
                    }
                }
            }
        };

        let saveScenarioInDB = function(obj){
            var object = {};

            $http({
                method : 'post',
                url : '/saveScenario',
                headers : {'Content-type': 'application/x-www-form-urlencoded' },
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {name: obj.name, onTop: obj.onTop, orderProp : obj.orderProp, autorization : obj.autorization, conditions : obj.conditions, active : obj.active}
            }).
            success(function(response){
                console.log(response);
                $scope.codeStatus = response.data;
                object = response;
                $http.get('/getScenarios').success(function(data){
                    $scope.scenarios = data;
                });
            }).
            error(function(response){
                $scope.codeStatus = response || "Request failed";
            });

            //Add objects, sensors and sensorListForConditions associated to the Scenario in the DB
            //Faire un post sur /addObjectToScenario et /addSensorToScenario et /addSensorListForConditionsToScenario

        };

        $scope.modifyScenario = function(scenario){
            $scope.newScenario = clone(scenario);
            $scope.isCreatingANewScenario = true;
            $scope.modifyingScenario = true;
            newScenario.startModifyingScenario($scope.newScenario);

            //Remove objects and sensors already selected from the tables of objects and sensors available
            for(var i=0;i<$scope.newScenario.objects.length;i++){
                for(var j=0;j<$scope.objectsAvailable.length;j++){
                    if($scope.newScenario.objects[i].name == $scope.objectsAvailable[j].name){
                        $scope.objectsAvailable = deleteObjectInATable($scope.objectsAvailable,$scope.objectsAvailable[j]);
                    }
                }
            };

            for(var i=0;i<$scope.newScenario.sensors.length;i++){
                for(var j=0;j<$scope.sensorsAvailable.length;j++){
                    if($scope.newScenario.sensors[i].name == $scope.sensorsAvailable[j].name){
                        $scope.sensorsAvailable = deleteObjectInATable($scope.sensorsAvailable,$scope.sensorsAvailable[j]);
                    }
                }
            };

            //Position the window on the first-step of the creation
            angular.element(document.querySelector('#secondStep')).click();
            angular.element(document.querySelector('#firstStep')).click(); 

        };

        //Function used to delete object in a table
        var deleteObjectInATable = function(table, object){
            var tempTable = [];

            for(var i=0;i<table.length;i++){
                if(table[i]!=object){
                    tempTable.push(table[i]);
                }
            }
            return tempTable;
        };

        function clone(obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        };

        //Functions used to make the creation's scenario tool responsive
        $scope.showAddSensorMenuOnSmall = function(){
            $scope.showAddSensorMenu = true;
        };

        $scope.showAddObjectsMenuOnSmall = function(){
            $scope.showAddObjectsMenu = true;
        };
        
    }
    
}]);

homeCIController.controller('objectsCtrl', ['UserService','$scope', '$http', '$state','USER_ROLES', function(UserService, $scope, $http, $state, USER_ROLES) {

    var objectList = {};
    var roomList = {};
    
    //Verify the user autorization to access the datas
    $scope.isAuthorized = UserService.isAuthorized;
    
    if(UserService.getCurrentUser()){$scope.currentUser = UserService.getCurrentUser()};
    
    $scope.authorizedRoles =  $state.current.data.authorizedRoles;
    console.log($scope.isAuthorized($scope.authorizedRoles));
    console.log($scope.currentUser.role);
    
    
    $scope.obj = {
        objectName: ''
    };
    $scope.room = {
        roomName: ''
    };
    $http.get('/getObjects').success(function(data) {
        objectList = data;
        $scope.listObjects = data;
    });
    $http.get('/getRooms').success(function(data) {
        roomList = data;
        $scope.listRooms = data;
    });

    $scope.addObject = function(obj) {
        var object = {};
        
        var data = "name=" + obj.objectName;
        $http({
            method: 'POST',
            url: '/setObject',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data //Pourquoi l'avoir mis deux fois ?
        }).
        success(function(response) {
            console.log(response);
            $scope.codeStatus = response.data;
            object = response;
            Materialize.toast('Objet créé !', 4000);
            $http.get('/getObjects').success(function(data) {
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
            url: '/setRoom',
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
            $http.get('/getRooms').success(function(data) {
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
            url: '/deleteObject',
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
            $http.get('/getObjects').success(function(data) {
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
            url: '/deleteRoom',
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
            $http.get('/getRooms').success(function(data) {
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
            url: '/getOneObject',
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
            url: '/addObjectToRoom',
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
            url: '/deleteObjectFromRoom',
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
    $scope.login = function(loginID) {
        var user = {
            username: loginID.username,
            password: loginID.password,
            isAuthenticated : false,
            access_token: null
        }
        var data = $.param({
            username: loginID.username,
            password: loginID.password
        });
        $http({
            method: 'POST',
            url: '/login',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).
        success(function(data, status, headers, config) {
            if (data.success) {
                //The user is now logged in
                console.log("welcome");
                //Save the token in the user variable
                user.access_token = data.token;
                user.isAuthenticated = true;
                UserService.setCurrentUser(user);
                console.log(UserService.getCurrentUser().username);
                $rootScope.username = UserService.getCurrentUser().username;
                $rootScope.$broadcast('authorized');
                $state.go('home');
            } else {
                console.log('Error: Invalid user or password');
            }
        }).
        error(function(data, status, headers, config) {
            console.log('Network Error');
            // Handle login errors here
        });
    }
});
homeCIController.controller('registerCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.titleView = 'S\'enregistrer';
}]);