const express = require('express');
const router = express.Router();
var http = require('http');
app = module.exports.app = express();
var server = http.createServer(app);
server.listen(7071);
var io = require('socket.io')(server)

require('moment/locale/tr');
const Test = require("../services/modals/Test");
const Admin = require("../services/modals/Admin");
const verifyToken = require('../services/middleware/verify-token');


router.get('/',verifyToken,(req,res)=>{
            res.render('index.ejs');
});

module.exports = router;