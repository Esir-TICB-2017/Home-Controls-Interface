var API = require("./APIObjet.js");
var fonctionKNX = require("./fonctionKNX");
var express = require('C:/Users/Math/AppData/Roaming/npm/node_modules/express');
var app = express();
var url = require('url');
var http = require('http').Server(app);
//app.use(bodyParser.json());
//|===================================================================================|
//|==================================== server =======================================|
//|===================================================================================|
fonctionKNX.connectionKNX(function() {
    if (fonctionKNX.connection.connected == true) {
        fonctionKNX.socketListenerKNX();
        console.log('vous etes connecté a KNX');
    }
});
API.down('5735f0d0baed94100a09e3f4');
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