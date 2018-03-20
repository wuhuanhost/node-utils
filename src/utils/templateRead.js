var fs = require('fs');
var rege = /\<%\s?var\s?\w+=(\w+)\((.*?)\);?%\>/gi;

// var html = `<% var list=getData(a,b,c);%>qweqwe<% var list=getData1(d,e);%>`;

// var list = html.match(rege);

// var templateFuncData = [];
// for (var i = 0; i < list.length; i++) {
//     list[i].match(rege);
//     var obj = {
//         funcName: RegExp.$1,
//         params: RegExp.$2.split(",")
//     }
//     templateFuncData.push(obj);
// }

// console.log(templateFuncData)

/**
 * 读取模板并且解析模板中的方法为指定格式
 * @param  {[type]}   templatePath [description]
 * @param  {Function} cb           [description]
 * @return {[type]}                [description]
 */
exports.getTemplateFuncData=function(templatePath, cb) {
    fs.readFile(templatePath, function(err, data) {
        if (err) {
            cb(err, null)
        } else {
            var list = data.toString().match(rege);
            var templateFuncData = [];
            for (var i = 0; i < list.length; i++) {
                list[i].match(rege);
                var obj = {
                    funcName: RegExp.$1,
                    params: RegExp.$2.split(",")
                }
                templateFuncData.push(obj);
            }
            cb(null, templateFuncData);
        }
    });
};

/**
 * 同步的读取模板数据的方法
 * @param  {[type]} templatePath [description]
 * @return {[type]}              [description]
 */
exports.getTemplateFuncDataSync=function(templatePath) {
    var data = fs.readFileSync(templatePath);
    var list = data.toString().match(rege);
    var templateFuncData = [];
    for (var i = 0; i < list.length; i++) {
        list[i].match(rege);
        var obj = {
            funcName: RegExp.$1,
            params: RegExp.$2.split(",")
        }
        templateFuncData.push(obj);
    }
    return templateFuncData;
};

/**
 * 测试方法
 * @param  {[type]} err     [description]
 * @param  {[type]} result) {console.log(err)console.log(result)} [description]
 * @return {[type]}         [description]
 */
// getTemplateFuncData("E:\\渼陂湖\\meibeihu\\views\\admin\\admin.ejs", function(err, result) {
//     console.log(err)
//     console.log(result)
// });
// console.log("================")

// console.log(getTemplateFuncDataSync("E:\\渼陂湖\\meibeihu\\views\\admin\\admin.ejs"))