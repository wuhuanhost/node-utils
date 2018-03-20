var express = require('express');
var router = express.Router();
var check = require('../src/utils/check.js');
var aabbcc = require('../src/utils/templateFuncAction.js');
var readTemplate=require('../src/utils/templateRead.js')
//登录后的管理页面
router.get('/admin', check.checkAdminLogin, function(req, res, next) {
    var menu = [{
        name: "测试菜单1",
        href: "/test1.html"
    }, {
        name: "测试菜单2",
        href: "/test2.html"
    }, {
        name: "测试菜单3",
        href: "/test3.html"
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

    //读取模板并且解析模板中的方法和参数
    var templateFuncData=readTemplate.getTemplateFuncDataSync("E:\\渼陂湖\\meibeihu\\views\\admin\\admin.ejs");

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
