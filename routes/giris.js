const express = require('express');
const router = express.Router();
const Admin = require('../services/modals/Admin');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
var SECRET = "%rasfa%&&&!sd79h9dsh98h689ds9*s)=qweqw312";

router.get('/giris',(req,res) => {
    res.render('giris.ejs',{message : req.flash('message')});
});

router.post("/giris", (req,res) => {
    var telephone = req.body.telephone;
    var password = md5(req.body.password);
    if (!password || !telephone) {
        req.flash('message', ['Lütfen Tüm Alanları Doldurunuz.',"alert alert-danger mb-4" ])
        res.redirect('/giris/giris')
      }else{
        Admin.findOne({telephone:telephone,password:password},(err,find_giris)=>{
            if(err){
                return res.render('error.ejs');
            }
            if(find_giris){
                var token = jwt.sign({ _id:find_giris._id ,fullName: find_giris.fullName,status: find_giris.status }, SECRET);
                res.cookie('token', token)
                return res.send("<script>window.location = '/'; </script>");
            }else{
                req.flash('message', ['Telefon Numarası veya Şifre Hatalı.',"alert alert-danger mb-4" ])
                res.redirect('/giris/giris')
            }
        });
      }
});



module.exports = router;