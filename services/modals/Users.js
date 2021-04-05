const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
    userName:{
        type:String,
        trim:true
    },
    password:{
        type:String,
        trim:true
    }, 
    FirebaseToken:{  
        type:String,
        default:'a'
    },
    language:{  
        type:String,
    },
    mail:{
        type:String,
        trim:true
        
    },
    loginStatus:{
        type:Number,
    },
    userBanType:{
        type:Number,
        default:0,
    },
    userPhoto:{
        type:String,
    },
    tikmoney:{
        type:Number,
        default:10,
    },
    notStatus:{
        type:Number,
        default:1,
    },
    userMailCode:{
        type:String,
    },
    userTasks:[],
    rejectedTask:[],
    userCreated:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Users', Users);
