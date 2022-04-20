var express = require("express");
var router = express.Router();
var multer = require("multer");

var path = require("path");

/**
 * 判断目录是否存在
 * @param {路径} path
 * @returns
 */
var isDirectory = function (path) {
  try {
    return fs.existsSync(path);
  } catch (e) {
    return false;
  }
};

/**
 * 文件上传过滤（图片过滤）
 * @param {*} req
 * @param {*} file
 * @param {*} cb
 */
var imageFilter = function (req, file, cb) {
  var acceptableMime = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  if (acceptableMime.indexOf(file.mimetype) !== -1) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var t = new Date();
    // 接收到文件后输出的保存路径（若不存在则需要创建)
    var directory = "";
    // 检查某个目录是否存在
    var dir = path.join(
      __dirname,
      "public",
      "uploads",
      "avatar",
      t.getFullYear() + "-" + (t.getMonth() + 1)
    );
    if (!isDirectory(dir)) {
      // 不存在目录，则异步创建目录
      fs.mkdir(dir, (err) => {
        if (err) return err;
        console.log("目录创建成功");
      });
    }
    cb(null, directory);
  },
  filename: function (req, file, cb) {
    // cb(null, file.originalname);
    cb(null, uuid.v1());
  },
});

var limits = {
  fields: 16, //非文件字段的数量
  fileSize: 50 * 1024 * 1024, //文件大小 50M
  files: 3, //上传文件数量
};

var upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: limits,
});

//单个文件上传
router.post("/profile", upload.single("file"), (req, res) => {
  console.log(req.files.file);
  return res.send({ data: req.files });
});

module.exports = router;
