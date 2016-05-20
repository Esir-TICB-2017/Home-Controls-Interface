var API = require("./APIObjects.js");
var fonctionKNX = require("./fonctionKNX");
var express = require('express');
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
var tabIdCapteur = ["573f0e18f8e098a827075b17","573f0e18f8e098a827075b18","573f0e18f8e098a827075b19","573f0e18f8e098a827075b1a"];
BDD.connectionBDD(function(){
    API.init(tabIdCapteur);

});






var BDD = require("./monMongo.js");
BDD.connectionBDD(function(){
   BDD.addObject("lampeSalon", "Rest", false, [{name: 'up', param: 'On'},{name: 'down', param: 'Off'}], "http://148.60.19.201:8080/obix/org/knx/@XEclairage/@XMarche%20Arret/@XM%20A_salon_ecl_1/%24@CDPT_Switch~event/","lampe","000", function(){
        console.log('yes');

    })


    // BDD.updateObject('573efd97234b97a81cb4ef55','lampesalon1',function(){
    //     console.log('mise ajour effective');
    // })

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