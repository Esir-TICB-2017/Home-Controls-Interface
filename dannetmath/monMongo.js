var findByOneId = function(id,callback) {
    var mongoose = require('mongoose');
    var port = process.env.PORT || 1337; // Port du serveur
    //-----Permet de vérifier la connexion à la base de données------
    mongoose.connect('mongodb://louison:123456@ds037395.mongolab.com:37395/homecontrol');
    mongoose.connection.on('open', function(ref) {
        console.log('Connected to mongo server.');
    });
    mongoose.connection.on('error', function(err) {
        console.log('Could not connect to mongo server!');
        console.log(err);
    });
    var db = mongoose.connection;
    var dataDbModel = new mongoose.Schema({
        protocole: String,
        nom: String,
        techno: String,
        capteur: Boolean,
        fonction: String,
        lien: String
    }, {
        _id: true
    });
    var dataDb = db.model('dataDb', dataDbModel);
    module.exports = dataDb;
    dataDb.findById(id, function(err, answer) {
        callback(answer);
    })
}
exports.findByOneId = findByOneId;
/*var mongoose = require('mongoose');
var dataDbModel = new mongoose.Schema({
    protocole: String,
    nom: String,
    capteur: Boolean,
    fonction: String,
    lien: String,
    type: String
}, {
    _id: true
});
var connectionBDD = function(callback) {
    var mongoose = require('mongoose');
    var port = process.env.PORT || 1337; // Port du serveur
    //-----Permet de vérifier la connexion à la base de données------
    mongoose.connect('mongodb://louison:123456@ds037395.mongolab.com:37395/homecontrol');
    var db = mongoose.connection;
    var dataDb = db.model('dataDb', dataDbModel);
    mongoose.connection.on('open', function(ref) {
        console.log('Connected to mongo server.');
    });
    mongoose.connection.on('error', function(err) {
        console.log('Could not connect to mongo server!');
        console.log(err);
    });
}
var findByOneId = function(id, callback) {
    connectionBDD();
    var ObjetModel = mongoose.connection.model('objet', dataDbModel);
    console.log('ici');
    ObjetModel.findById('57349b8cef975a848f3cbafe', function(err, answer) {
        console.log(answer);
        console.log(answer.protocole);
    })
}
var addObjet = function(name, protocol, capteur, funct, link, callback) {
    connectionBDD();
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
        mongoose.connection.close();
        callback();
    });
}
exports.findByOneId = findByOneId;
exports.addObjet = addObjet;*/