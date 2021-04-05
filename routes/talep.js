const express = require("express");
const router = express.Router();
const moment = require('moment')
require("moment/locale/tr");
const verifyToken = require("../services/middleware/verify-token");
const Support = require("../services/modals/Support");

router.get("/yeni_talepler", verifyToken, (req, res) => {
  Support.find({problemStatus:1}, (err, find_support) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("yeni_talepler.ejs", {
      find_support,
      moment,
      message : req.flash('message')
    });
  });
});

router.get("/okunan_talepler", verifyToken, (req, res) => {
  Support.find({problemStatus:2}, (err, find_support) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("okunan_talepler.ejs", {
      find_support,
      moment,
      message : req.flash('message')
    });
  });
});

router.get("/talep_sil/:_id", verifyToken, (req, res) => {
  Support.findOneAndDelete({ _id: req.params._id }, (err, find_support) => {
    if (err) {
      return res.render("error.ejs");
    }
    req.flash('message', ['Kullanıcı Talebi Başırıyla Silindi.',"alert alert-success mb-4" ])
    res.redirect('/talep/okunan_talepler')
  });
});

router.get("/talep_oku/:_id", verifyToken, (req, res) => {
  Support.findOne({ _id: req.params._id }, (err, find_talep) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("talep_oku.ejs", {
      find_talep,
    });
  });
});

router.post("/talep_oku/:_id", verifyToken, (req, res) => {
  const { solve } = req.body;
  const _id = req.params._id;

  if (!solve || !_id ) {
    return res.send(
      "<script> alert('Lütfen tüm alanları doldurunuz.'); window.location = '../../../talep/talep_oku/" +
        _id +
        "'; </script>"
    );
  }
  Support.findByIdAndUpdate(
    { _id: req.params._id },
    {
      $set: {
        problemStatus:2,
        solve
      },
    },
    (err, find_talep) => {
      if (err) {
        return res.render("error.ejs");
      }
      else{
        return res.send(
          "<script> alert('Talep cevap verme işlemi başarılı.'); window.location = '../../../talep/yeni_talepler/'; </script>"
        );
      }
    }
  );
});
module.exports = router;
