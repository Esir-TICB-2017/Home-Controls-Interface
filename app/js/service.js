'use strict'
var homeCIService = angular.module('homeCIService', []);
homeCIService.service('newScenario', function() {
    //Properties
    //New scenario we will work with
    var scenario = {};
    var numberOfScenarioCreated = 0;
    //Initializer
    this.initNewScenario = function() {
        scenario = {
            name: "",
            onTop: false,
            orderProp: 1,
            autorization: "",
            objects: [],
            sensors: [],
            conditions: [],
            id: 0,
            sensorsListForConditions: [],
            active: false
        };
    };
    //Getter
    this.getScenario = function() {
        return scenario;
    };
    //Setter
    this.setName = function(name) {
        scenario.name = name;
    };
    this.setAutorization = function(autorization) {
        scenario.autorization = autorization;
    };
    this.setOnTop = function(onTop) {
        scenario.onTop = onTop;
    };
    //Empty the scenario variable
    this.emptyScenario = function() {
        scenario = {};
    };
    //Uncheck and empty the conditions of all sensors selected during the creation process
    this.reinitSensorsAvailableTable = function(sensorsAvailable) {
        for (var i = 0; i < sensorsAvailable.length; i++) {
            for (var j = 0; j < sensorsAvailable[i].functions.length; j++) {
                sensorsAvailable[i].functions[j].checked = false;
                sensorsAvailable[i].functions[j].condition = "";
            }
        }
    };
    this.addObject = function(object) {
        if (scenario.objects.indexOf(object) == -1) {
            scenario.objects.push(object);
        }
    };
    this.deleteObject = function(object) {
        //TODO : Reinitialisation of the parameters of the object
        scenario.objects = this.deleteObjectInATable(scenario.objects, object);
        return object;
    };
    this.modifyObjectsParameter = function(object) {
        for (var i = 0; i < scenario.objects.length; i++) {
            if (object.idObject == scenario.objects[i].idObject) {
                scenario.objects[i].name = object.name;
                //Functions to add in the future
            }
        }
    };
    this.addSensor = function(sensor) {
        if (scenario.sensors.indexOf(sensor) == -1) {
            scenario.sensors.push(sensor);
            this.generateSensorsList();
        }
    };
    this.removeSensor = function(sensor) {
        //New temporary variable
        var newNewScenarioConditionTable = [];
        //update the conditions table and remove conditions linked to the sensor removed
        for (var i = 0; i < scenario.conditions.length; i++) {
            if (scenario.conditions[i].idObject != sensor.idObject) {
                newNewScenarioConditionTable.push(scenario.conditions[i]);
            }
        }
        scenario.conditions = newNewScenarioConditionTable;
        var newSensorsListForConditions = [];
        //update the sensorsListForConditions table and remove sensor linked to the sensor-device removed
        for (var i = 0; i < scenario.sensorsListForConditions.length; i++) {
            if (scenario.sensorsListForConditions[i].idObject != sensor.idObject) {
                newSensorsListForConditions.push(scenario.conditions[i]);
            }
        }
        scenario.sensorsListForConditions = newSensorsListForConditions;
        //Delete the sensor in the sensors table
        scenario.sensors = this.deleteObjectInATable(scenario.sensors, sensor);
    };
    this.generateSensorsList = function() {
        scenario.sensorsListForConditions = [];
        for (var i = 0; i < scenario.conditions.length; i++) {
            var tempSensor = {
                name: scenario.conditions[i].name,
                value: 0,
                checked: true,
                condition: scenario.conditions[i].condition,
                idObject: scenario.conditions[i].idObject,
                idSensor: scenario.conditions[i].idSensor
            }
            scenario.sensorsListForConditions.push(clone(tempSensor));
        }
        for (var i = 0; i < scenario.sensors.length; i++) {
            for (var j = 0; j < scenario.sensors[i].functions.length; j++) {
                scenario.sensorsListForConditions.push(scenario.sensors[i].functions[j]);
            }
        }
    };
    // A tester
    this.saveCondition = function(sensor) {
        //Create a new occurency of the sensor selected, to permit the user to create multiple conditions for a sensor
        if (sensor.checked & sensor.condition != "") {
            var newSensor = {
                name: sensor.name,
                value: sensor.value,
                checked: false,
                condition: "",
                idObject: sensor.idObject,
                idSensor: scenario.sensorsListForConditions.length + 1 // a corriger, peut planter
            }
            scenario.sensorsListForConditions.push(newSensor);
            //Add the condition created in a table dedicated to the conditions selected
            var newCondition = {
                name: sensor.name,
                idObject: sensor.idObject,
                idSensor: sensor.idSensor,
                condition: sensor.condition
            }
            scenario.conditions.push(newCondition);
        } else {
            for (var i = 0; i < scenario.conditions.length; i++) {
                if (sensor.idSensor == scenario.conditions[i].idSensor) {
                    scenario.conditions = this.deleteObjectInATable(scenario.conditions, scenario.conditions[i]);
                }
            }
            this.generateSensorsList();
            sensor.condition = "";
        }
    };
    this.saveScenario = function(modifyingScenario) {
        if (!modifyingScenario) {
            numberOfScenarioCreated = numberOfScenarioCreated + 1;
            scenario.id = numberOfScenarioCreated;
            //Generate the order prop of the scenario
            if (scenario.onTop === true) {
                scenario.orderProp = 2;
            };
        } else {
            //We save a scenario that have been modified
            if (scenario.onTop === true) {
                scenario.orderProp = 2;
            } else {
                scenario.orderProp = 1;
            }
        }
        return clone(scenario);
    };
    this.startModifyingScenario = function(scenarioToModify) {
        scenario = scenarioToModify;
        this.generateSensorsList();
    };
    /**
    Annexes functions
    **/
    //Function used to delete object in a table
    this.deleteObjectInATable = function(table, object) {
        var tempTable = [];
        for (var i = 0; i < table.length; i++) {
            if (table[i] != object) {
                tempTable.push(table[i]);
            }
        }
        return tempTable;
    };
    //Function that clone an object
    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    };
});
homeCIService.service('UserService', ['USER_ROLES', 'store', function(USER_ROLES, store) {
    /*User Architecture :
    User {
        name : String,
        password : String,
        role : String,
        access_token : String,
        isAuthenticated : boolean
    }*/
    var service = this;
    var currentUser = null;
    service.setCurrentUserUsername = function(username) {
        var user = currentUser;
        user.username = username;
        store.set('user', user);
    }
    service.setCurrentUser = function(user) {
        currentUser = user;
        //Temporaire, à retirer quand il sera implementé dans le backend
        if (currentUser) {
            user.role = USER_ROLES.parents;
        }
        store.set('user', user);
        return currentUser;
    };
    service.getCurrentUser = function() {
        if (!currentUser) {
            currentUser = store.get('user');
        }
        return currentUser;
    };
    service.isAuthenticated = function() {
        if (currentUser) {
            return currentUser.isAuthenticated;
        } else {
            return false;
        }
    };
    service.isAuthorized = function(authorizedRoles) {
        service.setCurrentUser(currentUser);
        //if the var authorizedRoles is not a table we convert it to a table
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (service.isAuthenticated() && (authorizedRoles.indexOf(currentUser.role) !== -1));
    };
    return service;
}]);
homeCIService.service('APIInterceptor', function($rootScope, UserService) {
    var service = this;
    //Put the access_token in the header of a communication with the server when the user is logged in and have an access_token
    service.request = function(config) {
        //Recover the user and his access_token
        var currentUser = UserService.getCurrentUser();
        var access_token = currentUser ? currentUser.access_token : null;
        //If the user has an access_token, put the access_token in the header of the communication
        if (access_token) {
            config.headers.authorization = access_token;
        }
        //Return the config which is what will be send to the server
        return config;
    };
    //Catch the different kind of HTML response we may receive
    service.responseError = function(response) {
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');
        }
        return response;
    };
});
homeCIService.service('LoginService', function($http) {
    var service = this;
    //Connect this angular application with the server sending a post request
    service.login = function(credentials) {
        return $http.post('/api/authenticate', credentials).success(function(data) {}).error(function(data) {
            console.log('Error: ' + data);
        })
    };
    //Log the user out
    service.logout = function() {
        //TODO : a function that delete the token server-side
    };
});
homeCIService.service('parseObjctsFunction', function() {
    /*  Parse an the string function received in every object from the server to adapt it to our needs
     *   Exemple :
     *   String : name:up;param:<str val="On"/>;name:down;param:<str val="Off"/>
     *   Will return : [{name:'up',param:'<str val="On"/>'},{name:'down',param:'<str val="Off"/>'}]
     */
    this.parse = function(functions) {
        //Variable containing the result, will be returned
        var res = "[{";
        //Temporary variable used to split a part of the String
        var temp = functions.split(";");
        //For each instruction, if it's a name parameter we create a new object, if not, we continue to store
        //each parameter in the object, adding ' around the parameter to make it a string
        angular.forEach(temp, function(val, key) {
            if ((val.indexOf("name") != -1) && (res != "[{")) {
                res += "},{";
            }
            if (res.charAt(res.length - 1) != "{") {
                res += ",";
            }
            var temp2 = val.split(":");
            res += temp2[0];
            res += ":'" + temp2[1] + "'"
        })
        res += ("}]");
        res = eval("(" + res + ")");
        return res;
    }
});
homeCIService.factory('socket', function($rootScope) {
    var socket = io.connect();
    return {
        dataSocket: function() {
            return socket;
        },
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});