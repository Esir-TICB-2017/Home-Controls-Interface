'use strict'
var homeCIController = angular.module('homeCIController', []);
homeCIController.controller('homeCtrl', ['UserService', '$scope', '$http', '$state', 'socket', function(UserService, $scope, $http, $state, socket) {
    var mySocketId = null;
    socket.on('connected', onConnected);
    var objectList = {};
    var activeMenu = $('#menu');
    $scope.titleView = 'Home';
    $scope.sendToAutomation = function(smart) {
        socket.emit('automation', smart);
    };
    //Recover the function used to check whether the user is authorized to access this page
    $scope.isAuthorized = UserService.isAuthorized;
    $('.collapsible').collapsible({
        accordion: false
    });
        socket.on('actionneurs',function(data){
            $scope.nools = true;
            $scope.noolsData = data;
            console.log(data);
    });
        
    //Recover the objects in the home and put them in a list in the widget
    $http.get('/getObjects').success(function(data) {
        //types d'objets : lampe, volet, temperature, humidite, luminosite, co2
        console.log(data);
        var objectList = data;
        angular.forEach(objectList, function(object, key) {
            if (object.type == "lampe") {
                object.icon = "lightbulb_outline";
            } else if (object.type == "volet") {
                object.icon = "reorder";
            } else if (object.type == "temperature") {
                object.icon = "";
            } else if (object.type == "luminosite") {
                object.icon = "brightness_medium";
            } else if (object.type == "humidite") {
                object.icon = "opacity";
            }
            //object.fonction = objectList.
        });
        $scope.listObjects = objectList;
    });

    function onConnected(data) {
        // Cache a copy of the client's socket.IO session ID on the App
        mySocketId = data.socketId;
        console.log("You are connected !");
        console.log(mySocketId);
    };
    $scope.sendSmartData = function(data) {
        console.log('ici');
        var data = {
            test: '25 degrés',
            dvsd: 'fre'
        };
        socket.emit('smartData', data);
    };
}]);
homeCIController.controller('scenariosCtrl', ['UserService', '$scope', '$http', '$state', 'newScenario', function(UserService, $scope, $http, $state, newScenario) {
    $scope.isAuthorized = UserService.isAuthorized;
    //If logged in, recover the user
    if (UserService.getCurrentUser()) {
        $scope.currentUser = UserService.getCurrentUser()
    };
    //Recover the list of roles who can access this page
    $scope.authorizedRoles = $state.current.data.authorizedRoles;
    $scope.userIsAuthorized = $scope.isAuthorized($scope.authorizedRoles);
    //First : download scenarios already created
    $http.get('/getScenarios').success(function(data) {
        $scope.scenarios = data;
    });
    $scope.switchScenarioActivation = function(scenario) {
        //To complete with a back-end implementation
        if (scenario.active) {
            Materialize.toast(scenario.name + " desactivé !", 2000);
            scenario.active = false;
        } else {
            Materialize.toast(scenario.name + " activé !", 2000);
            scenario.active = true;
        }
    };
    //Properties to create a new scenario
    $scope.isCreatingANewScenario = false;
    $scope.titleView = "Scénarios";
    $scope.showAddObjectsMenu = false;
    $scope.showAddSensorMenu = false;
    $scope.rooms = [];
    $scope.objectsAvailable = [];
    $scope.sensorsAvailable = [];
    $scope.newScenario = newScenario.getScenario();
    $scope.objectForModal = {};
    $scope.modifyingScenario = false;
    $scope.startCreatingNewScenario = function() {
        Materialize.toast('Création d\'un nouveau scenario', 2000);
        $scope.isCreatingANewScenario = true;
        //Download the rooms, objects and sensors available
        $http.get('/getRooms').success(function(data) {
            $scope.rooms = data;
        });
        $http.get('/getObjects').success(function(data) {
            $scope.objectsAvailable = data;
        });
        $http.get('/getSensors').success(function(data) {
            $scope.sensorsAvailable = data;
        });
        //Initialize the service newScenario
        newScenario.initNewScenario();
        $scope.newScenario = newScenario.getScenario();
        //Position the window on the first-step of the creation
        angular.element(document.querySelector('#secondStep')).click();
        angular.element(document.querySelector('#firstStep')).click();
    };
    $scope.stopCreatingNewScenario = function(displayMessage) {
        if (displayMessage) {
            Materialize.toast('Vous avez décidé d\'arrêter la création d\'un scénario', 3000);
        }
        $scope.isCreatingANewScenario = false;
        newScenario.initNewScenario();
        $scope.newScenario = newScenario.getScenario();
    };
    $scope.validateStep1 = function() {
        newScenario.setName($scope.newScenario.name);
        newScenario.setAutorization($scope.newScenario.autorization);
        newScenario.setOnTop($scope.newScenario.onTop);
        angular.element(document.querySelector('#secondStep')).click();
    };
    $scope.addObjectToScenario = function(object) {
        newScenario.addObject(object);
        $scope.newScenario = newScenario.getScenario();
        $scope.objectsAvailable = newScenario.deleteObjectInATable($scope.objectsAvailable, object);
        //Hide the list of objects on small screens
        if ($scope.showAddObjectsMenu) {
            $scope.showAddObjectsMenu = false;
        }
    };
    $scope.deleteObjectFromScenario = function(object) {
        $scope.objectsAvailable.push(newScenario.deleteObject(object));
        $scope.newScenario = newScenario.getScenario();
    };
    $scope.modifyObjectsParameter = function(object) {
        $scope.objectForModal = clone(object);
        $('#modalObject').openModal();
    };
    $scope.validateObjectsModification = function() {
            $('#modalObject').closeModal();
            newScenario.modifyObjectsParameter($scope.objectForModal);
            $scope.objectForModal = {};
            $scope.newScenario = newScenario.getScenario();
        }
        //Functions dealing with the conditions
        //Move the sensor from the list of sensors available to the list of sensors chosen
    $scope.addSensorToConditions = function(sensor) {
        newScenario.addSensor(sensor);
        $scope.newScenario = newScenario.getScenario();
        $scope.sensorsAvailable = newScenario.deleteObjectInATable($scope.sensorsAvailable, sensor);
        //Hide the list of sensors on small screens
        if ($scope.showAddSensorMenu) {
            $scope.showAddSensorMenu = false;
        }
    };
    //Function linked to the X button on the sensors selected in the "troisieme etape : conditions de declenchement/capteurs séléctionnés"
    $scope.removeSensorFromConditions = function(sensor) {
        //Uncheck the checkbox and empty the condition for a selected sensor
        for (var i = 0; i < sensor.functions.length; i++) {
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
    function generateSensorsList() {
        newScenario.generateSensorsList();
        $scope.newScenario = newScenario.getScenario();
    }
    //Save the condition written by the user when he clicks the OK button
    $scope.saveCondition = function(sensor) {
        newScenario.saveCondition(sensor);
        $scope.newScenario = newScenario.getScenario();
    };
    $scope.saveNewScenario = function() {
        if ($scope.modifyingScenario == false) {
            let scenarioJustCreated = newScenario.saveScenario(false);
            $scope.stopCreatingNewScenario(false);
            //Add the new scenario in the DB
            saveScenarioInDB(scenarioJustCreated);
        } else {
            for (var i = 0; i < $scope.scenarios.length; i++) {
                if ($scope.scenarios[i].id == $scope.newScenario.id) {
                    let scenarioJustCreated = newScenario.saveScenario(true);
                    $scope.stopCreatingNewScenario(false);
                    $scope.modifyingScenario = false;
                    //Add the new scenario in the DB
                    saveScenarioInDB(scenarioJustCreated);
                }
            }
        }
    };
    let saveScenarioInDB = function(obj) {
        var object = {};
        $http({
            method: 'post',
            url: '/saveScenario',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj) str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {
                name: obj.name,
                onTop: obj.onTop,
                orderProp: obj.orderProp,
                autorization: obj.autorization,
                conditions: obj.conditions,
                active: obj.active
            }
        }).
        success(function(response) {
            console.log(response);
            $scope.codeStatus = response.data;
            object = response;
            $http.get('/getScenarios').success(function(data) {
                $scope.scenarios = data;
            });
        }).
        error(function(response) {
            $scope.codeStatus = response || "Request failed";
        });
        //Add objects, sensors and sensorListForConditions associated to the Scenario in the DB
        //Faire un post sur /addObjectToScenario et /addSensorToScenario et /addSensorListForConditionsToScenario
    };
    $scope.modifyScenario = function(scenario) {
        $scope.newScenario = clone(scenario);
        $scope.isCreatingANewScenario = true;
        $scope.modifyingScenario = true;
        newScenario.startModifyingScenario($scope.newScenario);
        //Remove objects and sensors already selected from the tables of objects and sensors available
        for (var i = 0; i < $scope.newScenario.objects.length; i++) {
            for (var j = 0; j < $scope.objectsAvailable.length; j++) {
                if ($scope.newScenario.objects[i].name == $scope.objectsAvailable[j].name) {
                    $scope.objectsAvailable = deleteObjectInATable($scope.objectsAvailable, $scope.objectsAvailable[j]);
                }
            }
        };
        for (var i = 0; i < $scope.newScenario.sensors.length; i++) {
            for (var j = 0; j < $scope.sensorsAvailable.length; j++) {
                if ($scope.newScenario.sensors[i].name == $scope.sensorsAvailable[j].name) {
                    $scope.sensorsAvailable = deleteObjectInATable($scope.sensorsAvailable, $scope.sensorsAvailable[j]);
                }
            }
        };
        //Position the window on the first-step of the creation
        angular.element(document.querySelector('#secondStep')).click();
        angular.element(document.querySelector('#firstStep')).click();
    };
    //Function used to delete object in a table
    var deleteObjectInATable = function(table, object) {
        var tempTable = [];
        for (var i = 0; i < table.length; i++) {
            if (table[i] != object) {
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
    $scope.showAddSensorMenuOnSmall = function() {
        $scope.showAddSensorMenu = true;
    };
    $scope.showAddObjectsMenuOnSmall = function() {
        $scope.showAddObjectsMenu = true;
    };
}]);
homeCIController.controller('objectsCtrl', ['UserService', '$scope', '$http', '$state', 'USER_ROLES', 'socket', function(UserService, $scope, $http, $state, USER_ROLES, socket) {
    //Verify the user autorization to access the datas
    $scope.isAuthorized = UserService.isAuthorized;
    if (UserService.getCurrentUser()) {
        $scope.currentUser = UserService.getCurrentUser()
    };
    $scope.authorizedRoles = $state.current.data.authorizedRoles;
    //Variables containing objects and rooms that are in the home
    var objectList = {};
    var roomList = {};
    $scope.obj = {
        objectName: ''
    };
    $scope.room = {
        roomName: ''
    };
    //Recover objects and rooms that are in the home from the server
    $http.get('/getObjects').success(function(data) {
        //types d'objets : lampe, volet, temperature, humidite, luminosite, co2
        console.log(data);
        var objectList = data;
        angular.forEach(objectList, function(object, key) {
            if (object.type == "lampe") {
                object.icon = "lightbulb_outline";
            } else if (object.type == "volet") {
                object.icon = "reorder";
            } else if (object.type == "temperature") {
                object.icon = "";
            } else if (object.type == "luminosite") {
                object.icon = "brightness_medium";
            } else if (object.type == "humidite") {
                object.icon = "opacity";
            }
            
        });
        console.log(objectList);
        $scope.listObjects = objectList;
    });
}]);
homeCIController.controller('loginCtrl', function($scope, $http, $rootScope, $location, $state, LoginService, UserService) {
    document.getElementById("myButton").onclick = function() {
        location.href = "http://localhost:1337/connect/facebook";
    };
    $scope.titleView = 'Login';
    $scope.credentials = {
        username: '',
        password: ''
    };
    //Functions used by the view
    $scope.login = function(loginID) {
        //Create the user object which will be send to the server
        var user = {
                username: loginID.username,
                password: loginID.password,
                isAuthenticated: false,
                access_token: null
            }
            //Create the data that will be send to the server
        var data = $.param({
            username: loginID.username,
            password: loginID.password
        });
        //Send the request to the server
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
                //Save the token in the user object
                user.access_token = data.token;
                user.isAuthenticated = true;
                UserService.setCurrentUser(user);
                $rootScope.username = UserService.getCurrentUser().username;
                $rootScope.$broadcast('authorized');
                Materialize.toast('Bienvenue ' + String(UserService.getCurrentUser().username) + ' ! ', 2000);
                //Redirect to the home view automatically
                $state.go('home');
            } else {
                console.log('Error: Invalid user or password');
                Materialize.toast('Identifiants invalides !', 2000);
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
homeCIController.controller('administrationCtrl', ['$scope', '$http', 'UserService', '$state', '$anchorScroll', 'USER_ROLES', 'socket', '$rootScope', function($scope, $http, UserService, $state, $anchorScroll, USER_ROLES, socket, $rootScope) {
    $scope.isAuthorized = UserService.isAuthorized;
    //If logged in, recover the user
    if (UserService.getCurrentUser()) {
        $scope.currentUser = UserService.getCurrentUser()
    };
    //Recover the list of roles who can access this page
    $scope.authorizedRoles = $state.current.data.authorizedRoles;
    $scope.userIsAuthorized = $scope.isAuthorized($scope.authorizedRoles);
    $scope.USER_ROLES = USER_ROLES;
    $scope.users; //To be downloaded in the DB
    $scope.tab = "profil"
    $scope.goto = function(hash) {
        $scope.tab = hash;
    };
    socket.on('registrationResponse', function(data) {
        Materialize.toast('Le profile de ' + String(data.data.username) + ' à été créé', 2000);
    });
    socket.on('updateProfileResponse', function(data) {
        console.log(data.data.username);
        UserService.setCurrentUserUsername(data.data.username);
        $rootScope.username = data.data.username;
        console.log(UserService.getCurrentUser());
        Materialize.toast('Profil mis à jour', 2000);
    });
    /**
     * Allow the current User to register a new user.
     * @param  {object} credentials [username - password - role]
     */
    $scope.register = function(credentials) {
            //Verify if passwords match
            if (credentials.password != credentials.confirmedPassword) {
                $scope.messageColor = "red-text text-lighten-1";
                $scope.registerMessage = "Ce ne sont pas les mêmes mots de passe";
                setTimeout(function() {
                    $scope.registerMessage = "";
                }, 2000);
            } else {
                //Verify if password is at least 6 caracters long
                if (credentials.password.length < 6) {
                    $scope.messageColor = "red-text text-lighten-1";
                    $scope.registerMessage = "Mot de passe trop court !";
                    setTimeout(function() {
                        $scope.registerMessage = "";
                    }, 2000);
                } else {
                    //Verify if there is missing information
                    if (!credentials.username || !credentials.password || !credentials.role) {
                        $scope.messageColor = "red-text text-lighten-1";
                        $scope.registerMessage = "Il manque des informations !";
                        setTimeout(function() {
                            $scope.registerMessage = "";
                        }, 2000);
                    } else {
                        //Register the new user by sending a socket serverside
                        $scope.messageColor = "teal-text text-lighten-1";
                        $scope.registerMessage = "Enregistré avec succès !";
                        setTimeout(function() {
                            $scope.registerMessage = "";
                        }, 2000);
                        console.log(credentials);
                        var data = {
                            username: credentials.username,
                            password: credentials.password,
                            role: credentials.role
                        }
                        socket.emit('registration', data);
                    }
                }
            }
        }
        /**
         * Allow current User to update its profile informations
         * @param  {object} information [username - passwords - role]
         */
    $scope.updateProfile = function(information) {
        if (!information) {
            $scope.messageColor = "red-text text-lighten-1";
            $scope.updateProfileMessage = "Vous n'avez rien changé !";
            setTimeout(function() {
                $scope.updateProfileMessage = "";
            }, 2000);
        } else {
            if (!(information.username)) information.username = UserService.getCurrentUser().username;
            if (!information.role) information.role = UserService.getCurrentUser().role;
            if (!information.newPassword && !information.oldPassword && !information.confirmedNewPassword) {
                information.password = UserService.getCurrentUser().password;
            }
            if (information.newPassword && (!information.oldPassword || !information.confirmedNewPassword) || information.oldPassword && (!information.newPassword || !information.confirmedNewPassword) || information.confirmedNewPassword && (!information.oldPassword || !information.newPassword)) {
                $scope.messageColor = "red-text text-lighten-1";
                $scope.updateProfileMessage = "Il manque des informations concernant le mot de passe !";
                setTimeout(function() {
                    $scope.updateProfileMessage = "";
                }, 2000);
            } else {
                if (information.newPassword != information.confirmedNewPassword) {
                    $scope.messageColor = "red-text text-lighten-1";
                    $scope.updateProfileMessage = "Ce ne sont pas les mêmes mots de passe";
                    setTimeout(function() {
                        $scope.updateProfileMessage = "";
                    }, 2000);
                } else {
                    if (information.oldPassword != UserService.getCurrentUser().password && information.oldPassword) {
                        $scope.messageColor = "red-text text-lighten-1";
                        $scope.updateProfileMessage = "Vous n'avez pas bien saisi votre ancien mot de passe";
                        setTimeout(function() {
                            $scope.updateProfileMessage = "";
                        }, 2000);
                    } else {
                        if (information.newPassword) {
                            information.password = information.newPassword;
                        }
                    }
                }
            }
            var data = {
                "currentUser": {
                    username: UserService.getCurrentUser().username,
                    password: UserService.getCurrentUser().password,
                    role: UserService.getCurrentUser().role
                },
                "dataToUpdate": {
                    username: information.username,
                    password: information.password,
                    role: information.role
                }
            }
            console.log(data);
            socket.emit('updateProfile', data);
        }
    }
}]);