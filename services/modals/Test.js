
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Test = new Schema({
    name: {
        type: String,
        trim: true,
    },
    classStatus: {
        type: String,
        trim: true,
    },
    questions:[],
    solveUser:[]
});

module.exports = mongoose.model('Test', Test);