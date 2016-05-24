var fonctionSocketServer = require('../server.js');
var fonctionKNX = require("./fonctionKNX.js");
var fonctionRest = require("./fonctionRest.js");
var monMongo = require("./monMongo.js");
var init = function() {
    //---- connection aux équipements KNX
    fonctionKNX.connectionKNX(function() {
        if (fonctionKNX.connection.connected == true) {
            fonctionKNX.socketListenerKNX();
            console.log('vous etes connecté a KNX');
        }
    });
    //-- création de la routine pour relever les valeurs .
    monMongo.findBy("capteur", true , function(data){
        for (i in data){
            pingSensor(data[i].id)
        }
    });
}
//infite boucle query to sensors 
var pingSensor = function(id){
    monMongo.findByOneId(id, function(data){
        fonctionRest.getEtat(data.lien,function(rep){
            if(rep!='error'){
                monMongo.updateValueObject(id,rep,function(){
                    console.log('valeur mise à jour pour '+id);
                    fonctionSocketServer.sensorValues(data);
                    setTimeout(function(){pingSensor(id)},10000);

                });
            }
            else{
                console.log('error');
                 setTimeout(function(){pingSensor(id)},10000);
            }
           
        });

    });
}

var objectChangeState = function(action, id, callback){
    
    if(callback!=undefined){
    var data = monMongo.findByOneId(id, function(data) {
        for (i in data.fonction) {
            if (data.fonction[i].name == action) {
                var parametre = data.fonction[i].param;
            }
        }
        //en fonction du protocole selectionné 
        if (data.protocole == 'knx') {
            fonctionKNX.setknx(data.lien, parametre);
            callback(true);
        } else if (data.protocole == 'Rest') {
            var restParametre = '<str val="' + parametre + '"/>';
            var rep = fonctionRest.changerEtat(data.lien, restParametre, function(data) {
                callback(data);
            });
        } else {
            callback('error on objectChangeState');
        }
    });
    }
    else{
    var data = monMongo.findByOneId(id, function(data) {
            for (i in data.fonction) {
                if (data.fonction[i].name == action) {
                    var parametre = data.fonction[i].param;
                }
            }
            //en fonction du protocole selectionné 
            if (data.protocole == 'knx') {
                fonctionKNX.setknx(data.lien, parametre);
            } else if (data.protocole == 'Rest') {
                var restParametre = '<str val="' + parametre + '"/>';
                var rep = fonctionRest.changerEtat(data.lien, restParametre, function(data) {
                });
            } else {
            }
        });
    }
}
exports.init = init;
exports.objectChangeState = objectChangeState;
