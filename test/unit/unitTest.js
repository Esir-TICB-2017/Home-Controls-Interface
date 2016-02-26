'use strict';

describe('homeControlsInterfaceApp', function(){
    
    describe('homeCIService', function(){
        
        var scenario, service, sensorsAvailable;
        
        var bobby;
        
        beforeEach(module('homeCIService'));
        
        beforeEach(inject(function(newScenario){
            
            service = newScenario;
            newScenario.initNewScenario()
            scenario = newScenario.getScenario();
            
            sensorsAvailable = [ {
            name:"Station netatmo",
            room:"Salle de bain",
            type:"capteur",
            idObject : 1,
            functions : [
                {
                    name: "CO2",
                    value: 300,
                    checked : true,
                    condition: "alibaba",
                    idObject:1,
                    idSensor:1
                },
                {
                    name: "Humidité",
                    value: 50,
                    checked : false,
                    condition: "bamby",
                    idObject:1,
                    idSensor:2
                },
                {
                    name: "Température",
                    value: 21,
                    checked : true,
                    condition: "",
                    idObject:1,
                    idSensor:3
                }
            ]
        } ];    
            
        }));
        
       
        it('should initialize the scenario var', function(){
            expect(scenario.name).toBe("");
        });
        
        it('should initialize sensorsAvailable with 1 sensor which has 3 functions', function($service){
            expect(sensorsAvailable.length).toBe(1);
            expect(sensorsAvailable[0].functions.length).toBe(3);
        });
        
        it('should uncheck and empty the conditions', function(){
            
            service.reinitSensorsAvailableTable(sensorsAvailable);
            
            expect(sensorsAvailable[0].functions[0].checked).toBe(false)
            expect(sensorsAvailable[0].functions[0].condition).toBe("")
            expect(sensorsAvailable[0].functions[1].checked).toBe(false)
            
        });
        
        it('should add only one time a same object if the user ask for', function(){
            var object = {name : "objet 1", id:"1"};
            service.addObject(object);
            service.addObject(object);
            scenario = service.getScenario();
            expect(scenario.objects.length).toBe(1)
        });
        
        it('should add 2 sensors and 6 conditions to the scenario', function(){
            //neuve table with 2 sensors (device)
            var sensor = [{ 
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
            },{ 
                name:"Station withings",
            room:"Salle de bain",
            type:"capteur",
            idObject : 1,
            functions : [
                {
                    name: "Vent exterieur",
                    value: 300,
                    checked : false,
                    condition: "",
                    idObject:1,
                    idSensor:1
                },
                {
                    name: "Humidité exterieur",
                    value: 50,
                    checked : false,
                    condition: "",
                    idObject:1,
                    idSensor:2
                },
                {
                    name: "Température exterieure",
                    value: 21,
                    checked : false,
                    condition: "",
                    idObject:1,
                    idSensor:3
                }
                ]
            }];
            
            service.initNewScenario();
            service.addSensor(sensor[0]);
            service.addSensor(sensor[0]);
            service.addSensor(sensor[1]);
            scenario = service.getScenario();
            
            expect(scenario.sensors.length).toBe(2);
            expect(scenario.sensorsListForConditions.length).toBe(6);
            
        });
        
        it('should remove all physical sensors corresponding to a sensor device in the list of conditions available to create scenarios', function(){
            //neuve table with 2 sensors (device)
            var sensor = [{ 
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
            },{ 
                name:"Station withings",
            room:"Salle de bain",
            type:"capteur",
            idObject : 1,
            functions : [
                {
                    name: "Vent exterieur",
                    value: 300,
                    checked : false,
                    condition: "",
                    idObject:1,
                    idSensor:1
                },
                {
                    name: "Humidité exterieur",
                    value: 50,
                    checked : false,
                    condition: "",
                    idObject:1,
                    idSensor:2
                },
                {
                    name: "Température exterieure",
                    value: 21,
                    checked : false,
                    condition: "",
                    idObject:1,
                    idSensor:3
                }
                ]
            }];
            
            var sensorCondition = {
                name: sensor[0].name,
                value: sensor[0].value,
                checked: true,
                condition: "8",
                idObject: sensor[0].idObject,
                idSensor: scenario.sensorsListForConditions.length + 1
            }
            
            
            service.initNewScenario();
            service.addSensor(sensor[0]);
            service.addSensor(sensor[0]);
            service.addSensor(sensor[1]);
            service.saveCondition(sensorCondition);

            scenario = service.getScenario();
            
            expect(scenario.sensors.length).toBe(2);
            expect(scenario.sensorsListForConditions.length).toBe(7);
            expect(scenario.conditions.length).toBe(1);
            
            service.removeSensor(sensor[0]);
            expect(scenario.sensors.length).toBe(1);
            expect(scenario.sensorsListForConditions.length).toBe(0);
            expect(scenario.conditions.length).toBe(0);
            
            
        });
        
        it('should delete an object in a table',function(){
            var tab = [{name : 'David'},{name : 'Damien'}];
            let varToDelete = tab[1];
            
            var tabUpdated = service.deleteObjectInATable(tab,varToDelete);
            
            expect(tabUpdated.length).toBe(1);
            
            var found = false;
            for (var t in tabUpdated){
                if(t == varToDelete){found = true}
            }
            
            expect(found).toBe(false)
            
        });
        
        //Tests to add
        
    });
});