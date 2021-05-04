const express = require("express");
const router = express.Router();
require("moment/locale/tr");
const verifyToken = require("../services/middleware/verify-token");
const Store = require("../services/modals/Store");
const StoreRequest = require("../services/modals/StoreRequest");
const Users = require("../services/modals/Users");
var multer = require("multer");
const admin = require("firebase-admin");
const fs = require("fs");
var serviceAccount = require("./tikmoney-a6261-firebase-adminsdk-2dmpm-8455a8abb9.json");

router.get("/kategoriler", verifyToken, (req, res) => {
    Store.find({}, (err, find_kategori) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("kategoriler.ejs", {
        find_kategori,
        message : req.flash('message')
    });
  });
});

router.get("/icerikler/:_id", verifyToken, (req, res) => {
  Store.findOne({_id:req.params._id}, (err, find_icerik) => {
    const find_list = find_icerik.content;
  if (err) {
    return res.render("error.ejs");
  }
  res.render("icerikler.ejs", {
      find_list,
      message : req.flash('message')
  });
});
});

router.get("/tikmoney", verifyToken, (req, res) => {
    Store.find({}, (err, find_support) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("tikmoney.ejs", {
      find_support,
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

router.get("/kategori_ekle", verifyToken, (req, res) => {
  res.render("kategori_ekle.ejs", {
    message : req.flash('message')
  });
});

router.post("/kategori_ekle", verifyToken, (req, res) => {
  const { title, language } = req.body;
  const newKategori = new Store({
    title,
    language
  });
  newKategori.save((err, find_kategori) => {
    if (err) {
      res.render("error.ejs");
    }else{
      req.flash('message', ['Kategori Başarıyla oluşturuldu.',"alert alert-success mb-4" ])
      res.redirect('/magaza/kategori_ekle')
    }
  });
});



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/store"); // here we specify the destination . in this case i specified the current directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // here we specify the file saving name . in this case i specified the original file name
  },
});

var uploadDisk = multer({ storage: storage });

router.get("/icerik_ekle/:_id", verifyToken, (req, res) => {

  Store.findOne({ _id: req.params._id }, (err, find_content) => {
    if (err) {
      return res.render("error.ejs");
    }else{
      res.render("icerik_ekle.ejs", {
        find_content,
        message : req.flash('message')
      });
    }
  });

  
});

router.post(
  "/icerik_ekle/:_id",
  uploadDisk.single("image"),
  verifyToken,
  (req, res) => {
    const { description, tikmoney, purchased,input } = req.body;
    const _id = req.params._id;
    Store.updateOne(
      { _id: req.params._id },
      {
        $push: {
          content: {
            contentImage: "/uploads/store/" + req.file.filename,
            description,
            tikmoney,
            purchased,
            input,
          },
        },
      },
      (err, find_question) => {
        if (err) {
          return res.render("error.ejs");
        }else{
          req.flash('message', ['İçerik Başarıyla Eklendi.',"alert alert-success mb-4" ])
          res.redirect('/magaza/kategoriler')
        }
      }
    );
  }
);

router.get("/yeni_odul_talepleri", verifyToken, (req, res) => {
  StoreRequest.find({status:0}, (err, find_magaza) => {
  if (err) {
    return res.render("error.ejs");
  }
  res.render("yeni_odul_talepleri.ejs", {
    find_magaza,
      message : req.flash('message')
  });
});
});

router.get("/odul_talep_detay/:_id", verifyToken, (req, res) => {
  StoreRequest.findOne({ _id: req.params._id }, (err, find_odul) => {
    if (err) {
      return res.render("error.ejs");
    }

    res.render("odul_detay.ejs", {
      find_odul,
      message : req.flash('message')
    });
  });
});

router.post("/odul_iade/:_id", verifyToken, (req, res) => {
  StoreRequest.findOne({ _id: req.params._id }, (err, find_odul) => {
      const userId = find_odul.userId;
      const incTikmoney = find_odul.tikmoney;
      if (err) {
        return res.render("error.ejs");
      }else{
              Users.findOneAndUpdate(
                { _id: userId },
                {
                  $inc: { tikmoney: incTikmoney}
                },
                (err, find_user) => {
                  const NotToken = find_user.FirebaseToken
                  StoreRequest.findOneAndUpdate({ _id: req.params._id },{
                    $set: { status: 1}
                  }, (err, find_kullanici) => {
                    if (err) {
                      return res.render("error.ejs");
                    }else{
                      if(find_user.notStatus===1){
                        if (!admin.apps.length) {
                          admin.initializeApp({
                              credential: admin.credential.cert(serviceAccount)
                            });
                      }
                      let payload = {
                          notification:{
                              title: 'Tikmoney',
                              body: 'mesaj tikmoney panel deneme',
                          }
                      };
                      admin.messaging().sendToDevice(NotToken,payload).then(function(ressponse){
                        req.flash('message', ['Ürün Talebi Onaylandı.',"alert alert-success mb-4" ])
                        res.redirect('/magaza/yeni_odul_talepleri')
                      }).catch(function(err){
                          res.json('err')
                      })
                      }else{
                        req.flash('message', ['Tikmoney İade Edildi.',"alert alert-success mb-4" ])
                        res.redirect('/magaza/yeni_odul_talepleri')
                      }
                    }
                  });
                  
                });
      }
  });
});

router.post("/odul_onayla/:_id", verifyToken, (req, res) => {
  StoreRequest.findOne({ _id: req.params._id }, (err, find_odul) => {
    const userId = find_odul.userId;
    if (err) {
      return res.render("error.ejs");
    }else{
            Users.findOne(
              { _id: userId },
              (err, find_user) => {
                const NotToken = find_user.FirebaseToken
                StoreRequest.findOneAndUpdate({ _id: req.params._id },{
                  $set: { status: 2}
                }, (err, find_kullanici) => {
                  if (err) {
                    return res.render("error.ejs");
                  }else{
                    if(find_user.notStatus===1){
                      if (!admin.apps.length) {
                        admin.initializeApp({
                            credential: admin.credential.cert(serviceAccount)
                          });
                    }
                    let payload = {
                        notification:{
                            title: 'Tikmoney',
                            body: 'mesaj tikmoney panel deneme',
                        }
                    };
                    admin.messaging().sendToDevice(NotToken,payload).then(function(ressponse){
                      req.flash('message', ['Ürün Talebi Onaylandı.',"alert alert-success mb-4" ])
                      res.redirect('/magaza/yeni_odul_talepleri')
                    }).catch(function(err){
                        res.json('err')
                    })
                    }else{
                      req.flash('message', ['Ödül Gönderimi Onaylandı.',"alert alert-success mb-4" ])
                      res.redirect('/magaza/yeni_odul_talepleri')
                    }
                  }
                });
                
              });
    }
});
});
module.exports = router;
