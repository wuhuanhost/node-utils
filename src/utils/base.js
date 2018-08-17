/**
** 计算字符串的长度，中文每个字符长度为2英文每个字符长度为1
**/
var GetWordLength = function (str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};

//中文转utf-8字符串，中文字符串转utf编码
var UTFTranslate = {
    Change: function(pValue) {
        return pValue.replace(/[^\u0000-\u00FF]/g, function($0) { return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;") });
    },
    ReChange: function(pValue) {
        return unescape(pValue.replace(/&#x/g, '%u').replace(/\\u/g, '%u').replace(/;/g, ''));
    }
};
