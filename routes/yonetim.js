const express = require("express");
const router = express.Router();
require("moment/locale/tr");
const verifyToken = require("../services/middleware/verify-token");
const Admin = require("../services/modals/Admin");
const Class = require("../services/modals/Support");
const md5 = require("md5");

router.get("/yonetici_ekle", verifyToken, (req, res) => {
  res.render("yonetici_ekle.ejs",{message : req.flash('message')});
});

router.post("/yonetici_ekle", verifyToken, (req, res) => {
  const { fullName, telephone, password, password2 } = req.body;
  if (!password || !telephone || !password2 || !fullName) {
    req.flash('message', ['Lütfen Tüm Alanları Doldurunuz.',"alert alert-danger mb-4" ])
    res.redirect('/yonetim/yonetici_ekle')
  }else{
    if (password != password2) {
      req.flash('message', ['Şifreler Uyuşmadı.',"alert alert-danger mb-4" ])
      res.redirect('/yonetim/yonetici_ekle')
    }else{
      const newAdmin = new Admin({
        fullName: fullName,
        telephone: telephone,
        password: md5(password),
      });
      newAdmin.save((err, find_admin) => {
        if (err) {
          console.log(err);
          res.render("error.ejs");
        }
        req.flash('message', ['Yönetici Başarıyla Eklendi.',"alert alert-success mb-4" ])
        res.redirect('/yonetim/yonetici_ekle')
      });
    }
  }
});

router.get("/yoneticiler", verifyToken, (req, res) => {
  Admin.find({}, (err, find_yonetici) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("yoneticiler.ejs", {
      find_yonetici,
      message : req.flash('message')
    });
  });
});

router.get("/yonetici_sil/:_id", verifyToken, (req, res) => {
  Admin.findOneAndDelete({ _id: req.params._id }, (err, find_yonetici) => {
    if (err) {
      return res.render("error.ejs");
    }
    req.flash('message', ['Yönetici Başarıyla Silindi.',"alert alert-success mb-4" ])
    res.redirect('/yonetim/yoneticiler')
  });
});

router.get("/yonetici_sifre_duzenle/:_id", verifyToken, (req, res) => {
  Admin.findOne({ _id: req.params._id }, (err, find_yonetici) => {
    if (err) {
      return res.render("error.ejs");
    }

    res.render("yonetici_sifre_duzenle.ejs", {
      find_yonetici,
      message : req.flash('message')
    });
  });
});

router.post("/yonetici_sifre_duzenle/:_id", verifyToken, (req, res) => {
  const { password, password2 } = req.body;
  const _id = req.params._id;
  if (password != password2) {
    req.flash('message', ['Şifreler Uyuşmadı.',"alert alert-danger mb-4" ])
    "<script> window.location = '../../../yonetim/yonetici_sifre_duzenle/" +
        _id +
        "'; </script>"
  }else if (!password || !password2 || !_id) {
    req.flash('message', ['Lütfen Tüm Alanları Doldurunuz.',"alert alert-danger mb-4" ])
    "<script> window.location = '../../../yonetim/yonetici_sifre_duzenle/" +
        _id +
        "'; </script>"
  }else{
    Admin.updateOne(
      { _id: req.params._id },
      {
        $set: {
          password: md5(password),
        },
      },
      (err, find_admin) => {
        if (err) {
          return res.render("error.ejs");
        }
  
        req.flash('message', ['Yönetici Şifre Değiştirme İşlemi Başarılı.',"alert alert-success mb-4" ])
        res.redirect('/yonetim/yoneticiler')
      }
    );
  }
});

router.get("/ogretmen_duzenle/:_id", verifyToken, (req, res) => {
  Admin.findOne({ _id: req.params._id }, (err, find_ogretmen) => {
    if (err) {
      return res.render("error.ejs");
    }

    res.render("ogretmen_duzenle.ejs", {
      find_ogretmen,
      message : req.flash('message'),
    });
  });
});

router.post("/ogretmen_duzenle/:_id", verifyToken, (req, res) => {
  const { fullName, telephone, mail } = req.body;
  const _id = req.params._id;

  if (!mail || !telephone || !_id || !fullName) {
    req.flash('message', ['Lütfen Tüm Alanları Doldurunuz.',"alert alert-danger mb-4" ])
    res.redirect('/yonetim/ogretmen_duzenle')
  }
  Admin.updateOne(
    { _id: req.params._id },
    {
      $set: {
        mail,
        telephone,
        fullName,
      },
    },
    (err, find_admin) => {
      if (err) {
        return res.render("error.ejs");
      }
      req.flash('message', ['Güncelleme işlemi başarılı.',"alert alert-success mb-4" ])
      res.redirect('/yonetim/ogretmenler')
    }
  );
});

router.get("/ogretmen_sil/:_id", verifyToken, (req, res) => {
  Admin.findOneAndDelete({ _id: req.params._id }, (err, find_admin) => {
    if (err) {
      return res.render("error.ejs");
    }
    req.flash('message', ['Öğretmen Başarıyla Silindi.',"alert alert-success mb-4" ])
    res.redirect('/yonetim/ogretmenler')
  });
});

router.get("/ogrenci_duzenle/:_id", verifyToken, (req, res) => {
  Admin.findOne({ _id: req.params._id }, (err, find_ogrenci) => {
    if (err) {
      return res.render("error.ejs");
    }
    Class.find({}, (err, find_sinif) => {
      console.log(find_sinif);
      if (err) {
        return res.render("error.ejs");
      }
      res.render("ogrenci_duzenle.ejs", {
        find_sinif,
        find_ogrenci,
      });
    });
  });
});

router.post("/ogrenci_duzenle/:_id", verifyToken, (req, res) => {
  const { fullName, telephone, tc, no, classType, className } = req.body;
  const _id = req.params._id;

  if (!tc || !telephone || !_id || !no || !classType || !className) {
    return res.send(
      "<script> alert('Lütfen tüm alanları doldurunuz.'); window.location = '../../../yonetim/ogrenci_duzenle/" +
        _id +
        "'; </script>"
    );
  }
  Admin.updateOne(
    { _id: req.params._id },
    {
      $set: {
        tc,
        telephone,
        fullName,
        no,
        classType,
        className,
      },
    },
    (err, find_admin) => {
      if (err) {
        return res.render("error.ejs");
      }

      return res.send(
        "<script> alert('Güncelleme işlemi başarılı.'); window.location = '../../../yonetim/ogrenciler/'; </script>"
      );
    }
  );
});

router.get("/ogrenciler", verifyToken, (req, res) => {
  Admin.find({ status: 3 }, (err, find_ogrenci) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("ogrenciler.ejs", {
      find_ogrenci,
      message : req.flash('message')
    });
  });
});

module.exports = router;
