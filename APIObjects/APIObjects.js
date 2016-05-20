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
    var rep;
    setInterval(function(tabIdCapteur){
        for (i in tabIdCapteur){
            monMongo.findByOneId(tabIdCapteur[i], function(data){
                fonctionRest.getEtat(data.lien,function(rep){
                    if(rep!='error'){
                        monMongo.updateValueObject(tabIdCapteur[i],rep,function(){
                            console.log('valeur mise à jour');
                        });
                    }
                   
                });

            });
        }

    }, 3000);
    
}
var up = function(id,callback) {
    var data = monMongo.findByOneId(id, function(data) {
        var param = data.fonction;
        param = param.split(';');
        for (i in param) {
            if (param[i].indexOf('up') != -1) {
                param = param[parseInt(i) + 1].replace('param:', "");
            }
        }
        //en fonction du protocole selectionné 
        if (data.protocole == 'knx') {
            fonctionKNX.setknx(data.lien, param);
            callback(true);
        } else if (data.protocole == 'Rest') {
            fonctionRest.changerEtat(data.lien, param,function(rep){
                callback( true);
            });
        } else {
            callback ('error');
        }
    });
}
var down = function(id,callback) {
    var data = monMongo.findByOneId(id, function(data) {
        var param = data.fonction;
        param = param.split(';');
        for (i in param) {
            if (param[i].indexOf('down') != -1) {
                param = param[parseInt(i) + 1].replace('param:', "");
            }
        }
        //en fonction du protocole selectionné 
        if (data.protocole == 'knx') {
            fonctionKNX.setknx(data.lien, param);
            callback (true);
        } else if (data.protocole == 'Rest') {
            fonctionRest.changerEtat(data.lien, param,function(rep){
               callback (true);

            });
        } else {
            callback ('error');

        }
    });
}
exports.init = init;
exports.up = up;
exports.down = down;