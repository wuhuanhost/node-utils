var fs = require('fs');
var path = require('path');
var request = require('request');
var crypto = require('crypto');

var readWXConfig = function() {
    var wxConf = fs.readFileSync(path.resolve(__dirname, '../', 'config/', 'weixin_config.json'));
    return wxConf;

}

var writeWXConfig = function(wxConf) {
    fs.writeFileSync(path.resolve(__dirname, '../', 'config/', 'weixin_config.json'), JSON.stringify(wxConf, null, 4));
}

/**
 * 获取微信的access_token,微信access_token临时保存地方，7200秒刷新一次，修改本文件里面新获取到的access_token相关的值
 * @return {[type]} [description]
 */
var getAccessToken = function() {
    console.log("获取access_token");
    var wxConf = JSON.parse(readWXConfig());
    var APPID = wxConf.appid;
    var APPSECRET = wxConf.secret;
    var getAccessTokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + APPID + "&secret=" + APPSECRET;
    request.get(getAccessTokenUrl, function(err, response, body) {
        if (!err && response.statusCode == 200) { //成功
            var accessToken = JSON.parse(body).access_token;
            wxConf.access_token = accessToken;
            console.log("access_token  success!!!");
            getJsapiTicket(wxConf, accessToken);
        }
    });
    var timer = null;
    if (timer === null) {
        setTimeout(function() {
            clearTimeout(timer);
            timer = null;
            getAccessToken();
        }, 10000)
    }

}

/**
 * 根据access_token获取签名所需要的jsapi_ticket
 * @param  {[type]} access_token [description]
 * @return {[type]}              [description]
 */
var getJsapiTicket = function(wxConf, accessToken) {
    console.log("获取jsapi_ticket");
    var getTicketUrl = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + accessToken + "&type=jsapi";
    request.get(getTicketUrl, function(err, response, body) {
        wxConf.jsapi_ticket = JSON.parse(body).ticket;
        writeWXConfig(wxConf);
    });

}

//sha1加密
function sha1(str) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(str);
    var sha1Str = sha1.digest("hex");
    return sha1Str;
}


/**
 * 获取随机数
 * @return {[type]} [description]
 */
var createNonceStr = function() {
    return Math.random().toString(36).substr(2, 15);
};


/**
 * 获取时间戳
 * @return {[type]} [description]
 */
var createTimestamp = function() {
    return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function(args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function(key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

/**
 * @synopsis 签名算法 
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
 *
 * @returns
 */
var sign = function(url) {
    var ret = {
        jsapi_ticket: JSON.parse(readWXConfig()).jsapi_ticket,
        nonceStr: createNonceStr(),
        timestamp: createTimestamp(),
        url: url
    };
    var string = sha1(raw(ret));
    ret.signature = string;
    ret.appid = JSON.parse(readWXConfig()).appid
    return ret;
};



module.exports = {
    sha1: sha1,
    readWXConfig: readWXConfig,
    getAccessToken: getAccessToken,
    sign: sign
};
