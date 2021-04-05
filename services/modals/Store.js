const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Store = new Schema({
    title:{
        type:String,
        trim:true
    },
    language:{
        type:String,
        trim:true
    },
    content:[]
});

module.exports = mongoose.model('Store', Store);
