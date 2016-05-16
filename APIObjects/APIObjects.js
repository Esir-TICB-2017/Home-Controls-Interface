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
}
var up = function(id) {
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
            return true;
        } else if (data.protocole == 'Rest') {
            var rep = fonctionRest.changerEtat(data.lien, param);
            return true;
        } else {
            return 'error';
        }
    });
}
var down = function(id) {
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
            return true;
        } else if (data.protocole == 'Rest') {
            var rep = fonctionRest.changerEtat(data.lien, param);
            return true;
        } else {
            return 'error';
        }
    });
}
exports.init = init;
exports.up = up;
exports.down = down;