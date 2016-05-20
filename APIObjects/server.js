//var API = require("./APIObjects.js");
//var fonctionKNX = require("./fonctionKNX");
var express = require('C:/Users/Math/AppData/Roaming/npm/node_modules/express');
var app = express();
var url = require('url');
var http = require('http').Server(app);
//app.use(bodyParser.json());
//|===================================================================================|
//|==================================== server =======================================|
//|===================================================================================|
/*fonctionKNX.connectionKNX(function() {
    if (fonctionKNX.connection.connected == true) {
        fonctionKNX.socketListenerKNX();
        console.log('vous etes connecté a KNX');
    }
});*/


var BDD = require("./monMongo.js");
BDD.connectionBDD(function(){
     BDD.addObjet("temps", "Rest", true, "name:up;param:<str val=\"On\"/>;name:down;param:<str val=\"Off\"/>", "http://148.60.19.201:8080/obix/org/knx/@XEclairage/@XMarche%20Arret/@XM%20A_salon_ecl_1/%24@CDPT_Switch~event/", function(){
        console.log('yes');
    })
})



//API.down('573998dd1b0f602c50933cbf');
//|===================================================================================|
//|============================== Lancement du server  ===============================|
//|===================================================================================|
http.listen(8000, function() {
    console.log('listening on *:8000');
});
//|===================================================================================|
//|====================== Deconnection et shut down du server  =======================|
//|===================================================================================|
process.on('SIGINT', function() {
    if (fonctionKNX.connection.connected) {
        console.log('deconnection du tunel KNX');
        fonctionKNX.deconnectionKNX(function() {
            console.log('shut down server');
            process.exit();
        });
    } else {
        console.log('shut down server');
        process.exit();
    }
});