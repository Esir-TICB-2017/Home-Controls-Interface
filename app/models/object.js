// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var objectModel = mongoose.model('Object', new Schema({
    name : String,
    room : { 
    		type : mongoose.Schema.Types.ObjectId,
    		ref : 'Room'
    	},
    functions : [{
            type : mongoose.Schema.Types.ObjectId,
            name : String
        }
    ]
}));

module.exports = objectModel;

