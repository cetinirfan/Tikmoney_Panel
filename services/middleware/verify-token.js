var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var SECRET = "%rasfa%&&&!sd79h9dsh98h689ds9*s)=qweqw312";

function verifyToken(req, res, next){
    var {token} = req.cookies;
    jwt.verify(token,SECRET, function(err, decoded) {
        if (err) {
            return res.redirect('/giris/giris');
        } else {
            res.locals.fullName = decoded.fullName
            res.locals.status = decoded.status
            res.locals._id = decoded._id


            req.fullName = decoded.fullName
            req.status = decoded.status
            req._id = decoded._id
            next()
        }
    });
}

module.exports = verifyToken;