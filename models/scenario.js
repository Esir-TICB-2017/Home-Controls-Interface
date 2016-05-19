// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Scenario', new Schema({
    name : String,
    onTop : Boolean,
    orderProp : Number,
    autorization : String,
    objects: [{ type : mongoose.Schema.Types.ObjectId, ref : 'Object'}],
    sensors : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Sensor'
    }],
    conditions : [String],
    active : Boolean,
    sensorsListForConditions : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Sensor'
    }]
}));