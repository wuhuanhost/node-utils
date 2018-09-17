var express = require('express');
var router = express.Router();

var qiniu = require('qiniu');
var accessKey = '';
var secretKey = '';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

var options = {
    scope: "", //空间名称
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);

//获取七牛token
router.get('/qiniu-upload-token', function(req, res, next) {
    res.json({
        token: uploadToken
    });
});

module.exports = router;