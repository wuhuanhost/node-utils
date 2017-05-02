var request = require('request');
// const url = "http://v.showji.com/Locating/showji.com2016234999234.aspx?m=" + phoneNumber + "&output=json&callback=querycallback&timestamp=" + Date.now();
var url = "http://showphone.market.alicloudapi.com/6-1?num=";
/**
 *通过淘宝手机接口获取手机号信息
 * @return {[type]} [description]
 */
exports.queryPhoneByAliyun = function(phoneNumber, cb) {
    url = url + phoneNumber;
    request({
        url: url,
        headers: {
            'Authorization': 'APPCODE df4da77aab474060aa2ba22c9cb8bce7'
        },
        encoding: null // 关键代码
    }, function(err, res, body) {
        if (err || res.statusCode != 200) {
            console.error(err);
            console.error('抓取该页面失败，重新抓取该页面..');
            cb(err, null);
        } else {
            var html = body.toString();
            console.log(html);
            cb(null, JSON.parse(html));
        }
    });
};
