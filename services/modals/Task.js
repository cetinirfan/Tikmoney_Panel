const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Task = new Schema({
    title:{
        type:String,
        trim:true
    },
    language:{
        type:String,
        trim:true
    },
    content:[
         {
            description:{
                type:String,
                trim:true
            },
            language:{
                type:String,
                trim:true
            },
            tikmoney:{
                type:String,
                trim:true
            },
            link:{
                type:String,
                trim:true
            },
            icon:{
                type:String,
                trim:true
            },
            inputDescription:{
                type:String,
                trim:true
            },
            input:{
                type:String,
                trim:true
            },
            taskImage:{
                type:String,
                trim:true
            },
            taskCreated:{
                type:Date,
            },
            title:{
                type:String,
                trim:true
            }
         }
    ]
});

module.exports = mongoose.model('Task', Task);
