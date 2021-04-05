const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskRequest = new Schema({
    taskId:{
        type:String,
        trim:true
    },
    userName:{
        type:String,
        trim:true
    },
    mail:{
        type:String,
        trim:true
    },
    userId:{
        type:String,
        trim:true
    },
    taskImage:{
        type:String,
    },
    taskDescription:{
        type:String,
    },
    taskLink:{
        type:String,
    },
    rejectDescription:{
        type:String,
    },
    tikmoney:{
        type:String,
    },
    provedDescription:{
        type:String,
        trim:true
    },
    provedImage:{
        type:String,
        trim:true
    },
    language:{
        type:String,
        trim:true
    },
    status:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model('TaskRequest', TaskRequest);
