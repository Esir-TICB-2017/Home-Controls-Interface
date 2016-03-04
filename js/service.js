'use strict'

var homeCIService = angular.module('homeCIService',[]);

homeCIService.service('newScenario',function(){
    //Properties
    
    //New scenario we will work with
    var scenario = {};
    var numberOfScenarioCreated = 0;
    
    //Initializer
    this.initNewScenario = function(){
        scenario = {
            name : "",
            onTop : false,
            orderProp : 1,
            autorization : "",
            objects : [],
            sensors : [],
            conditions : [],
            id : 0,
            sensorsListForConditions : [],
            active : false
        };
    };
    
    //Getter
    this.getScenario = function(){
        return scenario;
    };
    
    //Setter
    this.setName = function(name){
        scenario.name = name;
    };
    
    this.setAutorization = function(autorization){
        scenario.autorization = autorization;
    };
    
    this.setOnTop = function(onTop){
        scenario.onTop = onTop;
    };
    
    //Empty the scenario variable
    this.emptyScenario = function(){
        scenario = {};
    };
    
    //Uncheck and empty the conditions of all sensors selected during the creation process
    this.reinitSensorsAvailableTable = function(sensorsAvailable){
        for(var i = 0;i<sensorsAvailable.length;i++){
            for(var j=0;j<sensorsAvailable[i].functions.length;j++){
                sensorsAvailable[i].functions[j].checked = false;
                sensorsAvailable[i].functions[j].condition = "";
            }
        }
    };
    
    this.addObject = function(object){
        if(scenario.objects.indexOf(object) == -1){
            scenario.objects.push(object);
        }
    };
    
    this.deleteObject = function(object){
        //TODO : Reinitialisation of the parameters of the object
        
        
        scenario.objects = this.deleteObjectInATable(scenario.objects, object);
        
        return object;
    };
    
    this.modifyObjectsParameter = function(object){
        for(var i=0;i < scenario.objects.length;i++){
            if(object.idObject == scenario.objects[i].idObject){
                scenario.objects[i].name = object.name;
                //Functions to add in the future
            }
        }
    };
    
    this.addSensor = function(sensor){
        if(scenario.sensors.indexOf(sensor) == -1){
            scenario.sensors.push(sensor);
            this.generateSensorsList();
        }
    };
    
    this.removeSensor = function(sensor){
        //New temporary variable
        var newNewScenarioConditionTable = [];
        
        //update the conditions table and remove conditions linked to the sensor removed
        for(var i=0;i<scenario.conditions.length;i++){
            if(scenario.conditions[i].idObject != sensor.idObject){
                newNewScenarioConditionTable.push(scenario.conditions[i]);
            }
        }
        scenario.conditions = newNewScenarioConditionTable;
        var newSensorsListForConditions = [];
        //update the sensorsListForConditions table and remove sensor linked to the sensor-device removed
        for(var i=0;i<scenario.sensorsListForConditions.length;i++){
            if(scenario.sensorsListForConditions[i].idObject != sensor.idObject){
                newSensorsListForConditions.push(scenario.conditions[i]);
            }
        }
        scenario.sensorsListForConditions = newSensorsListForConditions;
        
        //Delete the sensor in the sensors table
        scenario.sensors = this.deleteObjectInATable(scenario.sensors, sensor);
    };
    
    this.generateSensorsList = function(){
        scenario.sensorsListForConditions = [];
        
        for(var i=0; i < scenario.conditions.length ; i++){
            var tempSensor = {
                name : scenario.conditions[i].name,
                value : 0,
                checked : true,
                condition : scenario.conditions[i].condition,
                idObject : scenario.conditions[i].idObject,
                idSensor : scenario.conditions[i].idSensor
            }
            scenario.sensorsListForConditions.push(clone(tempSensor));
        }

        for(var i=0; i < scenario.sensors.length ; i++){
            for(var j=0; j < scenario.sensors[i].functions.length;j++){
                scenario.sensorsListForConditions.push(scenario.sensors[i].functions[j]);
            }
        }
    };
    
    // A tester
    this.saveCondition = function(sensor){
        //Create a new occurency of the sensor selected, to permit the user to create multiple conditions for a sensor
        if(sensor.checked & sensor.condition != ""){
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
                name : sensor.name,
                idObject : sensor.idObject,
                idSensor : sensor.idSensor,
                condition : sensor.condition
            }
            scenario.conditions.push(newCondition);
        }
        else{
            for(var i=0; i<scenario.conditions.length;i++){
                if(sensor.idSensor == scenario.conditions[i].idSensor){
                    scenario.conditions = this.deleteObjectInATable(scenario.conditions,scenario.conditions[i]);
                }
            }
            this.generateSensorsList();
            sensor.condition = "";
        }
    };
    
    this.saveScenario = function(modifyingScenario){
        
        if(!modifyingScenario){
            numberOfScenarioCreated = numberOfScenarioCreated + 1 ;
            scenario.id = numberOfScenarioCreated;
            //Generate the order prop of the scenario
            if(scenario.onTop === true){scenario.orderProp = 2;};
        }
        else{
            //We save a scenario that have been modified
            if(scenario.onTop === true){scenario.orderProp = 2;}
            else{scenario.orderProp = 1;}
        }
        
        return clone(scenario);
    };
    
    this.startModifyingScenario = function(scenarioToModify){
        scenario = scenarioToModify;
        this.generateSensorsList();
    };
    
    /**
    Annexes functions
    **/
    
    //Function used to delete object in a table
    this.deleteObjectInATable = function(table, object){
        var tempTable = [];
        
        for(var i=0;i<table.length;i++){
            if(table[i]!=object){
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