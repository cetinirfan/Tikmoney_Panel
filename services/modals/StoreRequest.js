const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreRequest = new Schema({
    tikmoney:{
        type:String,
        trim:true
    },
    language:{
        type:String,
        trim:true
    },
    contentImage:{
        type:String,
        trim:true
    },
    status:{
        type:Number,
        default:0
    },
    userId:{
        type:String,
        trim:true
    },
    productDescription:{
        type:String,
    },
    userDescription:{
        type:String,
    },
    product:{
        type:String,
        trim:true
    },
    userMail:{
        type:String,
        trim:true
    },
    userName:{
        type:String,
        trim:true
    },
    requestCreated:{
        type:Date,
    }
});

module.exports = mongoose.model('StoreRequest', StoreRequest);