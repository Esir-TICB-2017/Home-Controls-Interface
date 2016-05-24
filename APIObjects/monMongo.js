var ObjectModel = require('../models/object');
var findByOneId = function(id, callback) {
    ObjectModel.findById(id, function(err, answer) {
        if (!err) {
            callback(answer);
        } else {
            callback('error');
        }
    })
}
var findBy = function(name, value , callback){
    //a modif pour pas que ce soit codé en dur ------------------------------------
    var param= '{"'+name+'":"'+value+'"}';
    param = JSON.parse(param);
    ObjectModel.find(param,function(err,object){
        if(err){
            callback(err);
        }
        else{
            callback(object);
        }
    })
}
var addObject = function(name, protocol, capteur, funct, link,type,valeur, callback) {
    var newObject = new ObjectModel({
        nom: name
    });
    newObject.protocole = protocol;
    newObject.capteur = capteur;
    newObject.fonction = funct;
    newObject.lien = link;
    newObject.type = type;
    newObject.value = valeur; 
    newObject.save(function(err) {
        if (err) {
            throw err;
        }
        console.log('l\'objet a été ajouté ajouté avec succès!');
        callback();
    });
}
var updateValueObject = function(id,valeur,callback){
    ObjectModel.findOneAndUpdate({'_id' : id} , {'value' : valeur }, {upsert:true}, function(err, doc){
        if (err) { throw err; }
        console.log('la valeur est maitenant : '+ valeur);
        callback();
    });
}
var connectionBDD = function(callback) {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://louison:123456@ds037395.mongolab.com:37395/homecontrol');
    var db = mongoose.connection;
    var dataDb = db.model('objects', ObjectModel);
    mongoose.connection.on('open', function(ref) {
        console.log('Connected to mongo server.');
        callback();
    });
    mongoose.connection.on('error', function(err) {
        console.log('Could not connect to mongo server!');
        console.log(err);
    });
}
exports.findByOneId = findByOneId;
exports.addObject = addObject;
exports.updateValueObject = updateValueObject;
exports.connectionBDD = connectionBDD;
exports.findBy = findBy;