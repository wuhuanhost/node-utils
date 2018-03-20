var express = require('express');
var router = express.Router();
var path = require("path");
var XLSX = require('xlsx');


var check = require('../src/filter/check.js');
var aabbcc = require('../src/utils/templateFuncAction.js');
var readTemplate=require('../src/utils/templateRead.js')

console.log(check)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


//生成excel
router.get("/initExcel", function (req, res, next) {

  let downFileUrl = path.resolve(__dirname, "../", "public", "uploads");

  var _data = [{
      id: '1',
      name: 'test1',
      age: '30',
      country: 'China',
      remark: 'hello'
    },
    {
      id: '2',
      name: 'test2',
      age: '20',
      country: 'America',
      remark: 'world'
    },
    {
      id: '3',
      name: 'test3',
      age: '18',
      country: 'Unkonw',
      remark: '备注'
    }
  ];


  genExcel(_data, downFileUrl, function (err, result) {
    setTimeout(() => {
      res.json({
        "downurl": result
      })
    }, 3000);
  })

})


/**
 * 
 * @param 数据 _data 
 * @param 保存地址 path 
 * @param 回调函数 cb 
 */
function genExcel(_data, _path, cb) {
  var _headers = ['id', 'name', 'age', 'country', 'remark']


  var headers = _headers
    // 为 _headers 添加对应的单元格位置
    // [ { v: 'id', position: 'A1' },
    //   { v: 'name', position: 'B1' },
    //   { v: 'age', position: 'C1' },
    //   { v: 'country', position: 'D1' },
    //   { v: 'remark', position: 'E1' } ]
    .map((v, i) => Object.assign({}, {
      v: v,
      position: String.fromCharCode(65 + i) + 1
    }))
    // 转换成 worksheet 需要的结构
    // { A1: { v: 'id' },
    //   B1: { v: 'name' },
    //   C1: { v: 'age' },
    //   D1: { v: 'country' },
    //   E1: { v: 'remark' } }
    .reduce((prev, next) => Object.assign({}, prev, {
      [next.position]: {
        v: next.v
      }
    }), {});

  var data = _data
    // 匹配 headers 的位置，生成对应的单元格数据
    // [ [ { v: '1', position: 'A2' },
    //     { v: 'test1', position: 'B2' },
    //     { v: '30', position: 'C2' },
    //     { v: 'China', position: 'D2' },
    //     { v: 'hello', position: 'E2' } ],
    //   [ { v: '2', position: 'A3' },
    //     { v: 'test2', position: 'B3' },
    //     { v: '20', position: 'C3' },
    //     { v: 'America', position: 'D3' },
    //     { v: 'world', position: 'E3' } ],
    //   [ { v: '3', position: 'A4' },
    //     { v: 'test3', position: 'B4' },
    //     { v: '18', position: 'C4' },
    //     { v: 'Unkonw', position: 'D4' },
    //     { v: '???', position: 'E4' } ] ]
    .map((v, i) => _headers.map((k, j) => Object.assign({}, {
      v: v[k],
      position: String.fromCharCode(65 + j) + (i + 2)
    })))
    .reduce((prev, next) => prev.concat(next))
    .reduce((prev, next) => Object.assign({}, prev, {
      [next.position]: {
        v: next.v
      }
    }), {});

  // 合并 headers 和 data
  var output = Object.assign({}, headers, data);
  // 获取所有单元格的位置
  var outputPos = Object.keys(output);
  // 计算出范围
  var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];

  // 构建 workbook 对象
  var wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      'mySheet': Object.assign({}, output, {
        '!ref': ref
      })
    }
  };

  // 导出 Excel
  XLSX.writeFile(wb, path.join(_path, 'output.xlsx'));
  cb(null, path.join("/uploads/", 'output.xlsx'));

}









//登录后的管理页面
router.get('/admin', check.checkAdminLogin, function(req, res, next) {
    var menu = [{
        name: "测试菜单1",
        href: "/ejs-test/test1.html"
    }, {
        name: "测试菜单2",
        href: "/ejs-test/test2.html"
    }, {
        name: "测试菜单3",
        href: "/ejs-test/test3.html"
    }];
    //模拟request中的参数
    var requestParams = {
        m: 100,
        n: 2
    }; 
    //解析模后的数据结构
    // var templateFuncData = [{
    //     funcName: "getData",
    //     params: ["_m_", "_n_", 1]
    // }, {
    //     funcName: "abx",
    //     params: [20, 10]
    // }];

     var tempPath=path.resolve(__dirname,"../","views","admin","admin.ejs")


    //读取模板并且解析模板中的方法和参数
    //var templateFuncData=readTemplate.getTemplateFuncDataSync("E:\\渼陂湖\\meibeihu\\views\\admin\\admin.ejs");

	  var templateFuncData=readTemplate.getTemplateFuncDataSync(tempPath);

    // 1、解析模板中的方法
    // 2、编译并执行模板中的方法
    // 3、组装数据
    aabbcc.execTemplateFunc(templateFuncData, requestParams, function(err, result) {
        // console.log("============================>");
        console.log(result);
        if (err) {
            res.render('error', err);
        } else {
            res.locals = result;
            res.render('admin/admin', { menu: menu, user: { uid: req.session.uid, token: req.session.token } });
        }
    });
});

//admin登录方法
router.post('/login', function(req, res, next) {
    var account = req.body.account;
    var password = req.body.password;
    if (account === "admin" && password === "123") {
        req.session.account = account;
        req.session.password = password;
        req.session.uid = 1;
        req.session.token = account + password;
        res.redirect('./admin');
    } else {
        res.redirect(301, '/index?msg=account or password error');
    }
});


//后台登录首页
router.get('/index', function(req, res, next) {
    req.session.code = "123456";
    res.render('admin/index', { code: 12 });
});






module.exports = router;