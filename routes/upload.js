var express = require("express");
var router = express.Router();
var multer = require("multer");

var path = require("path");

let upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
      var changedName = new Date().getTime() + "-" + file.originalname;
      cb(null, changedName);
    },
  }),
});

//单个文件上传
router.post("/profile", upload.single("avatarImage"), (req, res) => {
  var file = req.files.avatarImage;
  console.log(req.file);
  res.setHeader("Content-Type", "application/json");
  res.send({
    code: "0000",
    type: "single",
    originalname: file.originalname,
    path: file.path,
  });
});

module.exports = router;
