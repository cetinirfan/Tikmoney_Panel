const express = require("express");
const router = express.Router();
require("moment/locale/tr");
const verifyToken = require("../services/middleware/verify-token");
const Anno = require("../services/modals/Anno");
const md5 = require("md5");

router.get("/duyuru_ekle", verifyToken, (req, res) => {
  res.render("duyuru_ekle.ejs",{message : req.flash('message')});
});

router.post("/duyuru_ekle", verifyToken, (req, res) => {
  const { title, description, language } = req.body;
  if (!title || !description || !language) {
    req.flash('message', ['Lütfen Tüm Alanları Doldurunuz.',"alert alert-danger mb-4" ])
    res.redirect('/duyurular/duyuru_ekle')
  }else{
      const newAnno = new Anno({
        title,
        description,
        language,
        annoCreated:this.all,
      });
      newAnno.save((err, find_duyuru) => {
        if (err) {
          console.log(err);
          res.render("error.ejs");
        }
        req.flash('message', ['Duyuru Başarıyla Eklendi.',"alert alert-success mb-4" ])
        res.redirect('/duyurular/duyuru_ekle')
      });
  }
});

router.get("/en_duyurular", verifyToken, (req, res) => {
  Anno.find({language:'en-Us'}, (err, find_duyuru) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("en_duyurular.ejs", {
      find_duyuru,
      message : req.flash('message')
    });
  });
});

router.get("/tr_duyurular", verifyToken, (req, res) => {
  Anno.find({language:'tr-TR'}, (err, find_duyuru) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("tr_duyurular.ejs", {
      find_duyuru,
      message : req.flash('message')
    });
  });
});

router.get("/duyuru_sil/:_id", verifyToken, (req, res) => {
  Anno.findOneAndDelete({ _id: req.params._id }, (err, find_duyuru) => {
    const language = find_duyuru.language
    console.log(language)
  if (err) {
    return res.render("error.ejs");
  }else{
    if(language==='tr-TR'){
      req.flash('message', ['Duyuru Başarıyla Silindi.',"alert alert-success mb-4" ])
      res.redirect('/duyurular/tr_duyurular')
    }else{
      req.flash('message', ['Duyuru Başarıyla Silindi.',"alert alert-success mb-4" ])
      res.redirect('/duyurular/en_duyurular')
    }
  }
  
});
});

router.get("/duyuru_duzenle/:_id", verifyToken, (req, res) => {
  Anno.findOne({ _id: req.params._id }, (err, find_duyuru) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("duyuru_duzenle.ejs", {
      find_duyuru,
    });
  });
});

router.post("/duyuru_duzenle/:_id", verifyToken, (req, res) => {
  const { title, description} = req.body;
  const _id = req.params._id;

  if (!title || !description || !_id ) {
    return res.send(
      "<script> alert('Lütfen tüm alanları doldurunuz.'); window.location = '../../../duyurular/duyuru_duzenle/" +
        _id +
        "'; </script>"
    );
  }
  Anno.findByIdAndUpdate(
    { _id: req.params._id },
    {
      $set: {
        title,
        description
      },
    },
    (err, find_duyuru) => {
      if (err) {
        return res.render("error.ejs");
      }
      if(find_duyuru.language==='tr-TR'){
        return res.send(
          "<script> alert('Güncelleme işlemi başarılı.'); window.location = '../../../duyurular/tr_duyurular/'; </script>"
        );
      }else{
        return res.send(
          "<script> alert('Güncelleme işlemi başarılı.'); window.location = '../../../duyurular/en_duyurular/'; </script>"
        );
      }
    }
  );
});

module.exports = router;
