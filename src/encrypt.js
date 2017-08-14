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
