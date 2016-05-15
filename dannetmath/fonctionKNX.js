var fonction = require('./fonction.js');
//module et param pour knx
KnxHelper = require('./src/KnxHelper.js');
KnxConnectionTunneling = require('./src/KnxConnectionTunneling.js');
exports.KnxHelper = KnxHelper;
exports.KnxConnectionTunneling = KnxConnectionTunneling;
// varriable
var ipplateauknx = '192.168.1.118';
var portplateauknx = 3671;
var portserver = 13671;
var ipserver = fonction.getIpAddress();
//crée les variables de connexion à la plaque KNX
var KnxConnectionTunneling = require('knx.js').KnxConnectionTunneling;
var connection = new KnxConnectionTunneling(ipplateauknx, portplateauknx, ipserver, portserver);
//fonctions KNX
var connectionKNX = function(callback) {
    setTimeout(function() {
        connection.Connect(function() {
            callback();
        });
    }, 500);
    callback();
}
var deconnectionKNX = function(callback) {
    connection.Disconnect(function() {
        callback();
    });
}
var setKNX = function(adresse, value) {
    if (connection.connected) {
        connection.Action(adresse, value);
    }
}
var getKNX = function(adresse) {
        connection.RequestStatus(adresse);
    }
    //ajouter le lister + maj de la BDD quand il y a un truc qui se passe 
var socketListenerKNX = function() {
    connection.on('status', function(data, data1, data2) {
        console.log('status : L\'adresse ' + data + " est a l'état : " + data1);
        //traiter la donnée 
    });
    connection.on('event', function(data, data1, data2) {
        console.log('event : L\'adresse ' + data + " est a l'état : " + data1);
        //traiter la donné
    });
}
exports.setKNX = setKNX;
exports.getKNX = getKNX;
exports.connectionKNX = connectionKNX;
exports.deconnectionKNX = deconnectionKNX;
exports.connection = connection;
exports.socketListenerKNX = socketListenerKNX;