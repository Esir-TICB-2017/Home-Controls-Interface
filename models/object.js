var mongoose = require('mongoose');

var objectsSchema = new mongoose.Schema({
    protocole: String,
    nom: String,
    capteur: Boolean,
    fonction: String,
    lien: String,
    type: String,
    value : String
}, {
    _id: true
});

var objectModel = mongoose.connection.model('objects', objectsSchema);

module.exports=objectModel;