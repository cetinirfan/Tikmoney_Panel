const express = require("express");
const router = express.Router();
require("moment/locale/tr");
const verifyToken = require("../services/middleware/verify-token");
const Task = require("../services/modals/Task");
const TaskRequest = require("../services/modals/TaskRequest")
const Users = require("../services/modals/Users")
var multer = require("multer");
const admin = require("firebase-admin");
const fs = require("fs");
var serviceAccount = require("./tikmoney-a6261-firebase-adminsdk-2dmpm-8455a8abb9.json");

router.get('/send',(req,res)=>{
    

    
});

router.get("/kategoriler", verifyToken, (req, res) => {
    Task.find({}, (err, find_gorev) => {
    if (err) {
      return res.render("error.ejs");
    }
    res.render("gorev_kategori.ejs", {
        find_gorev,
        message : req.flash('message')
    });
  });
});

router.get("/gorevler/:_id", verifyToken, (req, res) => {
  Task.findOne({_id:req.params._id}, (err, find_gorev) => {
    const kategoriId = find_gorev._id;
    const find_list = find_gorev.content;
  if (err) {
    return res.render("error.ejs");
  }
  res.render("gorevler.ejs", {
      find_list,
      kategoriId,
      message : req.flash('message')
  });
});
});

router.get("/gorev_kategori_ekle", verifyToken, (req, res) => {
  res.render("gorev_kategori_ekle.ejs", {
    message : req.flash('message')
  });
});

router.post("/gorev_kategori_ekle", verifyToken, (req, res) => {
  const { title, language } = req.body;
  const newGorev = new Task({
    title,
    language
  });
  newGorev.save((err, find_kategori) => {
    if (err) {
      res.render("error.ejs");
    }else{
      req.flash('message', ['Görev Kategori Başarıyla oluşturuldu.',"alert alert-success mb-4" ])
      res.redirect('/gorev/gorev_kategori_ekle')
    }
  }); 
});



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/task"); // here we specify the destination . in this case i specified the current directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // here we specify the file saving name . in this case i specified the original file name
  },
});

var uploadDisk = multer({ storage: storage });

router.get("/gorev_ekle/:_id", verifyToken, (req, res) => {

  Task.findOne({ _id: req.params._id }, (err, find_gorev) => {
    if (err) {
      return res.render("error.ejs");
    }else{
      res.render("gorev_ekle.ejs", {
        find_gorev,
        message : req.flash('message')
      });
    }
  });

  
});

router.post(
  "/gorev_ekle/:_id",
  uploadDisk.single("image"),
  verifyToken,
  (req, res) => {
    const { description, tikmoney, link , icon ,input,inputDescription} = req.body;
    const _id = req.params._id;
    Task.findOne({_id:_id}).then(data=>{
      const language = data.language
      Task.updateOne(
        { _id: req.params._id },
        {
          $push: {
            content: {
              taskImage: "/uploads/task/" + req.file.filename,
              description,
              tikmoney,
              link,
              icon,
              inputDescription,
              input,
              language
            },
          },
        },
        (err, find_question) => {
          if (err) {
            return res.render("error.ejs");
          }else{
            req.flash('message', ['İçerik Başarıyla Eklendi.',"alert alert-success mb-4" ])
            res.redirect('/gorev/kategoriler')
          }
        }
      );
    })
    
  }
);

router.get("/gorev_sil/:_id/:_gorevId",verifyToken,(req, res) => {
    Task.updateOne(
      { _id: req.params._id },
      {
        $pull: {
          content: {
            _id: req.params._gorevId
          },
        },
      },
      (err, find_question) => {
        if (err) {
          return res.render("error.ejs");
        }else{
          req.flash('message', ['İçerik Başarıyla Silindi.',"alert alert-success mb-4" ])
          res.redirect('/gorev/kategoriler')
        }
      }
    );
  }
);

router.get("/yeni_gorev_talepleri", verifyToken, (req, res) => {
  TaskRequest.find({status:0}, (err, find_gorev) => {
  if (err) {
    return res.render("error.ejs");
  }
  res.render("yeni_gorev_talepleri.ejs", {
      find_gorev,
      message : req.flash('message')
  });
});
});

router.get("/reddedilen_talepler", verifyToken, (req, res) => {
  TaskRequest.find({status:2}, (err, find_gorev) => {
  if (err) {
    return res.render("error.ejs");
  }
  res.render("reddedilen_talepler.ejs", {
      find_gorev,
      message : req.flash('message')
  });
});
});

router.get("/onaylanan_talepler", verifyToken, (req, res) => {
  TaskRequest.find({status:1}, (err, find_gorev) => {
  if (err) {
    return res.render("error.ejs");
  }
  res.render("onaylanan_talepler.ejs", {
      find_gorev,
      message : req.flash('message')
  });
});
});

router.get("/gorev_detay/:_id", verifyToken, (req, res) => {
  TaskRequest.findOne({ _id: req.params._id }, (err, find_gorev) => {
    if (err) {
      return res.render("error.ejs");
    }

    res.render("gorev_detay.ejs", {
      find_gorev,
      message : req.flash('message')
    });
  });
});

router.post("/gorev_reddet/:_id", verifyToken, (req, res) => {
  const {rejectDescription} = req.body;
  if (rejectDescription.length<1) {
    req.flash('message', ['Lütfen Tüm Alanları Doldurunuz.',"alert alert-danger mb-4" ])
    res.redirect(`http://localhost:7092/gorev/gorev_detay/${req.params._id}`)
  }else{
    TaskRequest.findOne({ _id: req.params._id }, (err, find_task) => {
      const userId = find_task.userId;
      const taskId = find_task.taskId;
      if (err) {
        return res.render("error.ejs");
      }else{
        TaskRequest.updateOne({ _id: req.params._id },
          {
            $set: {
              status:2,
              rejectDescription:rejectDescription
            },
          },
          (err, find_admin) => {
            if (err) {
              return res.render("error.ejs");
            }else{
              Users.findOneAndUpdate(
                { _id: userId },
                {
                  $pull: {
                    userTasks:taskId
                  },
                  $push:{
                    rejectedTask:taskId
                  },
                },
                (err, find_user) => {
                  const NotToken = find_user.FirebaseToken
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
                    req.flash('message', ['Görev Talebi Reddedildi.',"alert alert-success mb-4" ])
                    res.redirect('/gorev/yeni_gorev_talepleri')
                  }).catch(function(err){
                      res.json('err')
                  })
                  }else{
                    req.flash('message', ['Görev Talebi Reddedildi.',"alert alert-success mb-4" ])
                    res.redirect('/gorev/yeni_gorev_talepleri')
                  }
                });
            }
      
          }
         
        );
      }
    });
  }
  
});

router.post("/gorev_onayla/:_id", verifyToken, (req, res) => {
  TaskRequest.findOne({ _id: req.params._id }, (err, find_task) => {
    const userId = find_task.userId;
    const taskId = find_task.taskId;
    if (err) {
      return res.render("error.ejs");
    }else{
      TaskRequest.updateOne({ _id: req.params._id },
        {
          $set: {
            status:1,
          },
        },
        (err, find_admin) => {
          if (err) {
            return res.render("error.ejs");
          }else{
            Users.findOne(
              { _id: userId },
              (err, find_user) => {
                const NotToken = find_user.FirebaseToken
                if (err) {
                  return res.render("error.ejs");
                }else{
                  if (!admin.apps.length) {
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount)
                      });
                }
                let payload = {
                    notification:{
                        title: 'Tikmoney',
                        body: 'Tikmoney Panel',
                    }
                };
                admin.messaging().sendToDevice(NotToken,payload).then(function(ressponse){
                  req.flash('message', ['Görev Talebi Kabul Edildi.',"alert alert-success mb-4" ])
                  res.redirect('/gorev/yeni_gorev_talepleri')
                }).catch(function(err){
                    res.json('err')
                })
                  
                }
              });
          }
    
        }
       
      );
    }
  });
});

module.exports = router;
