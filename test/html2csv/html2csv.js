var path = require("path");
var fs = require("fs");
// var XLSX = require('xlsx');
var cheerio = require('cheerio');
const Json2csvParser = require('json2csv').Parser;

//转换好的csv在wps中打开，然后另存为excel（.xltx）csv不能直接使用excel打开，需要在数据->自文本
//参考资料：https://www.zhihu.com/question/21869078
//测试html 文件名去前0

/**
 * 读取html
 */
function readHtml(path, cb) {
    var html = fs.readFile(path, function(err, data) {
        if (!err) {
            cb(data.toString());
        } else {
            console.error(err);
        }
    });
};

/**
 * 解析需要的数据
 */
function parseHtml(html) {
    const $ = cheerio.load(html);
    var jsonArr = [];
    var title = "";
    var leve = "";
    $("#vul_detail>table>tbody>tr").each(function(index, element) {
        var tr = $(element).html();
        if ($(element).attr("class") === "even") { //奇数
            // console.log($(element).attr("data-id") + "      " + $(element).find("span").html() )
            title = $(element).find("span").html();
            leve = $(element).find("span").attr("class");
        } else if ($(element).attr("class") === "odd") {
            // console.log($(element).attr("data-id") + "      " + $(element).find("span").html())
            title = $(element).find("span").html();
            leve = $(element).find("span").attr("class");
        } else if ($(element).attr("class") === "solution") {


            var leveRemark = "";
            if (leve === "level_danger_high") {
                leveRemark = "高危险";
            } else if (leve === "level_danger_middle") {
                leveRemark = "中危险";
            } else if (leve === "level_danger_low") {
                leveRemark = "低风险";
            }


            var obj = {
                "漏洞标题": UTFTranslate.ReChange(title),
                "漏洞等级": leveRemark,
                "漏洞": parseContent(element)
            }
            jsonArr.push(obj);
            // console.log(index);
        }

    });
    console.log(jsonArr[0])
    fs.writeFileSync('./a.json', JSON.stringify(jsonArr[0]), { encoding: 'utf8' });
    // console.log(json)

    //转换为cvs
    const fields = ['漏洞标题', '漏洞等级', '漏洞.详细描述', '漏洞.解决办法', '漏洞.威胁分值', '漏洞.危险插件', '漏洞.发现日期', '漏洞.CVE编号', '漏洞.BUGTRAQ', '漏洞.NSFOCUS', '漏洞.CNNVD编号', '漏洞.CNCVE编号', '漏洞.CNVD编号'];
    // var jsonArr = {
    //     '漏洞标题': 'PHP Calendar扩展数字错误漏洞(CVE-2015-1353)',
    //     '漏洞等级': '高危险',
    //     '漏洞': {
    //         '详细描述': 'PHP（PHP：HypertextPreprocessor，PHP：超文本预处理器）是PHPGroup和开放源代码社区共同维护的一种开源的通用计算机脚本语言。 calendar是其中的一个基于Web的日历事务系统扩展插件。\ r\ nPHP5 .6 .7 及之前版本的calendar扩展中存在整数溢出漏洞， 该漏洞源于gregor.c文件中的 & aposGregorianToSdn & apos函数和julian.c文件中的 & aposJulianToSdn & apos函数没有充分过滤特制的 & aposyear & apos值。 远程攻击者可利用该漏洞造成拒绝服务。 ',
    //         '解决办法': '厂商补丁:\r\n目前厂商已经发布了升级补丁以修复此安全问题，补丁获取链接：\r\nhttp://php.net/ChangeLog-5.php',
    //         '威胁分值': '7.0',
    //         '危险插件': '否',
    //         '发现日期': '2015-03-30',
    //         'CVE编号': '编号：CVE-2015-1353\r\n\r\n参考链接：http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-1353',
    //         BUGTRAQ: '编号：95151\r\n\r\n参考链接：http://www.securityfocus.com/bid/95151',
    //         NSFOCUS: '编号：35760\r\n\r\n参考链接：http://www.nsfocus.net/vulndb/35760',
    //         'CNNVD编号': '编号：CNNVD-201501-606\r\n\r\n参考链接：http://www.cnnvd.org.cn/vulnerability/show/cv_cnnvdid/CNNVD-201501-606',
    //         'CNCVE编号': 'CNCVE-20151353',
    //         'CNVD编号': '编号：CNVD-2015-02111\r\n\r\n参考链接：http://www.cnvd.org.cn/flaw/show/CNVD-2015-02111'
    //     }
    // }

    const myCars = jsonArr;
    const json2csvParser = new Json2csvParser({ fields, unwind: 'content', unwindBlank: true, encoding: 'utf-8' });
    const csv = json2csvParser.parse(myCars);

    // console.log(csv);
    fs.writeFileSync('./a.csv', csv, { encoding: 'utf8' });
};


var rege_match_a = /\<a target="_blank" href="(.+?)"\>(.+?)\<\/a\>/g;
/**
 * 解析bug详情
 */
function parseContent(html) {
    const $ = cheerio.load(html);
    var content = {};
    $("tbody").find("tr").each(function(index, tr) {
        // var obj = {};
        var th = $(tr).find("th").html(); //表头
        // console.log(th)
        var td = $(tr).find("td").html(); //内容
        // console.log(UTFTranslate.ReChange(td))

        if (UTFTranslate.ReChange(td).replace(/[\r\n]/g, "").match(rege_match_a)) { //如果内容是a标签
            var $a = cheerio.load(UTFTranslate.ReChange(td));
            var ahref = $a("a").attr("href");
            var acontent = $a("a").html();
            content[trim(UTFTranslate.ReChange(th))] = "编号：" + acontent + "\r\n\r\n参考链接：" + ahref;
        } else {
            // console.log(UTFTranslate.ReChange(td).replace(/[\r\n]/g, ""));
            content[trim(UTFTranslate.ReChange(th))] = trim(UTFTranslate.ReChange(td)).replace(/\<br\>/g, "\r\n");
        }
        // content.push(obj);
    });
    // console.log(content)
    return content;

}

readHtml('C:\\Users\\admin\\Desktop\\漏洞报告\\host\\117.34.70.140.html', function(data) {

    // console.log(data);
    parseHtml(data);

});


/**************************************************************************************/
/**************************************************************************************/
/**************************************************************************************/
//中文转utf-8字符串，中文字符串转utf编码
var UTFTranslate = {
    Change: function(pValue) {
        return pValue.replace(/[^\u0000-\u00FF]/g, function($0) { return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;") });
    },
    ReChange: function(pValue) {
        return unescape(pValue.replace(/&#x/g, '%u').replace(/\\u/g, '%u').replace(/;/g, ''));
    }
};


function trim(str) {
    return str.replace(/\s+/g, "");
};