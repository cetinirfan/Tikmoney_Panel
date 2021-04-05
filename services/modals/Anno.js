const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Anno = new Schema({
    title:{
        type:String,
        trim:true
    },
    description:{
        type:String,
    },
    language:{
        type:String,
        trim:true
    },
    AnnoCreated:{
        type:Date,
    }
});

module.exports = mongoose.model('Anno', Anno);
