const express = require('express');
const router = express.Router();
require('moment/locale/tr');
const Test = require("../services/modals/Test");
const Admin = require("../services/modals/Admin");
const verifyToken = require('../services/middleware/verify-token');


router.get('/',verifyToken,(req,res)=>{
            res.render('index.ejs');
});

module.exports = router;