var fonctionKNX = require("./fonctionKNX.js");
var fonctionRest = require("./fonctionRest.js");
var monMongo = require("./monMongo.js");
var init = function(tabIdCapteur) {
    //---- connection aux équipements KNX
    fonctionKNX.connectionKNX(function() {
        if (fonctionKNX.connection.connected == true) {
            fonctionKNX.socketListenerKNX();
            console.log('vous etes connecté a KNX');
        }
    });
    //-- création de la routine pour relever les valeurs .
    var rep;
    setInterval(function(){
        for (var i=0 ; i<tabIdCapteur.lenght;i ){
            var encour=tabIdCapteur[i];
            monMongo.findByOneId(encour, function(data){
                fonctionRest.getEtat(data.lien,function(rep){
                    console.log(rep);
                    if(rep!='error'){
                        monMongo.updateValueObject(encour,rep,function(){
                            console.log('valeur mise à jour pour '+encour);
                            i++;
                        });
                    }
                    else{
                        console.log('error');
                    }
                   
                });

            });
        }
    }, 3000);
}
var objectChangeState = function(action ,id,callback) {
    var data = monMongo.findByOneId(id, function(data) {
        
        for(i in data.function){
            if(data.function[i].name == action){
                var parametre = data.function[i].param;
                console.log(parametre);
            }
        }
        //en fonction du protocole selectionné 
        if (data.protocole == 'knx') {
            fonctionKNX.setknx(data.lien, parametre);
            return true;
        } else if (data.protocole == 'Rest') {
            var restParametre = '<str val="' + data.function[i].param + '"/>';
            var rep = fonctionRest.changerEtat(data.lien, restParametre);
            return true;
        } else {
            return 'error';
        }
    });
}

exports.init = init;
exports.objectChangeState = objectChangeState;

