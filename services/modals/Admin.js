
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Admin = new Schema({
    fullName: {
        type: String,
        trim: true,
    },
    telephone: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model('Admin', Admin);