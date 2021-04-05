const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Support = new Schema({
    problem:{
        type:String,
        trim:true
    },
    solve:{
        type:String,
        trim:true
    },
    problemStatus:{
        type:Number,
        default:1,
    },
    userId:{
        type:String,
        trim:true
    }, 
    userName:{ 
        type:String,
    },
    userMail:{
        type:String,
        trim:true
        
    },
    supportCreated:{
        type:Date,
    }
});

module.exports = mongoose.model('Support', Support);
