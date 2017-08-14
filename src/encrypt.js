const crypto = require('crypto');


/**
 * md5加密
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
exports.MD5 = function(str) {
    var hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}


//sha1加密
function sha1(str) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(str);
    var sha1Str = sha1.digest("hex");
    return sha1Str;
}
