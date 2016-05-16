var ObjetModel = require('../models/object');
var findByOneId = function(id, callback) {
    ObjetModel.findById(id, function(err, answer) {
        if (!err) {
            callback(answer);
        } else {
            callback('error');
        }
    })
}
var addObjet = function(name, protocol, capteur, funct, link, callback) {
    var newObjet = new ObjetModel({
        nom: name
    });
    newObjet.protocole = protocol;
    newObjet.capteur = capteur;
    newObjet.fonction = funct;
    newObjet.lien = link;
    newObjet.save(function(err) {
        if (err) {
            throw err;
        }
        console.log('l\'objet a été ajouté ajouté avec succès!');
        callback();
    });
}
/*
var connectionBDD = function(callback) {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://louison:123456@ds037395.mongolab.com:37395/homecontrol');
    var db = mongoose.connection;
    var dataDb = db.model('objects', ObjetModel);
    mongoose.connection.on('open', function(ref) {
        console.log('Connected to mongo server.');
        callback();
    });
    mongoose.connection.on('error', function(err) {
        console.log('Could not connect to mongo server!');
        console.log(err);
    });
}*/
exports.findByOneId = findByOneId;
exports.addObjet = addObjet;
//exports.connectionBDD=connectionBDD;