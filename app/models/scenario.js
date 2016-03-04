// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Scenario', new Schema({
    name : String,
    onTop : Boolean,
    orderProp : Number,
    autorization : String,
    objects: [{
    	object : { 
    		type : mongoose.Schema.Types.ObjectId,
    		ref : 'Object'
    	}
    }],
    sensors : [{
        sensor : {
            type : mongoose.Schema.Types.ObjectId,
            name : String
        }
    }],
    conditions : [String],
    active : Boolean,
    sensorsListForConditions : [{
        sensor : {
            type : mongoose.Schema.Types.ObjectId,
            name : String
        }
    }]
}));