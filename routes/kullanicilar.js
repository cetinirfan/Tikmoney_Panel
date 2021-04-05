const express = require("express");
const router = express.Router();
require("moment/locale/tr");
const verifyToken = require("../services/middleware/verify-token");
const Users = require("../services/modals/Users");

router.get("/kullanicilar", verifyToken, (req, res) => {
  Users.find({userBanType:0}, (err, find_kullanici) => {
    console.log(find_kullanici)
    if (err) {
      return res.render("error.ejs");
    }
    res.render("kullanicilar.ejs", {
      find_kullanici,
      message : req.flash('message')
    });
  });
});

router.get("/engelli_kullanicilar", verifyToken, (req, res) => {
    Users.find({userBanType:1}, (err, find_kullanici) => {
      if (err) {
        return res.render("error.ejs");
      }
      res.render("engelli_kullanicilar.ejs", {
        find_kullanici,
        message : req.flash('message')
      });
    });
  });

router.get("/kullanici_sil/:_id", verifyToken, (req, res) => {
    Users.findOneAndDelete({ _id: req.params._id }, (err, find_kullanici) => {
    if (err) {
      return res.render("error.ejs");
    }else{
      req.flash('message', ['Kullanıcı Başarıyla Silindi.',"alert alert-success mb-4" ])
      res.redirect('/kullanicilar/kullanicilar')
    }
    
  });
});

router.get("/kullanici_engelle/:_id", verifyToken, (req, res) => {
    Users.updateOne(
      { _id: req.params._id },
      {
        $set: {
          userBanType:1,
        },
      },
      (err, find_kullanici) => {
        if (err) {
          return res.render("error.ejs");
        }else{
          req.flash('message', ['Kullanıcı Başarıyla Engellendi.',"alert alert-success mb-4" ])
          res.redirect('/kullanicilar/kullanicilar')
        }
  });
});

router.get("/kullanici_engel_kaldir/:_id", verifyToken, (req, res) => {
  Users.updateOne(
    { _id: req.params._id },
    {
      $set: {
        userBanType:0,
      },
    },
    (err, find_kullanici) => {
      if (err) {
        return res.render("error.ejs");
      }else{
        req.flash('message', ['Kullanıcı Engeli Başarıyla Kaldırıldı.',"alert alert-success mb-4" ])
        res.redirect('/kullanicilar/engelli_kullanicilar')
      }
});
  });

module.exports = router;
