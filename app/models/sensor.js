// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Sensor', new Schema({
    name : String,
    room : { 
    		type : mongoose.Schema.Types.ObjectId,
    		ref : 'Room'
    },
    sensors : [{
        sensor : {
            type : mongoose.Schema.Types.ObjectId,
            name : String,
            value : Number
        }
    }]
}));