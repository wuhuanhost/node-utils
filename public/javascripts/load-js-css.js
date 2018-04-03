$.extend({
    includePath: '',
    ver: localStorage.getItem("APP_VERSION") || new Date().getTime(),//默认版本号
    include: function (file) {
        var files = typeof file == "string" ? [file] : file;
        for (var i = 0; i < files.length; i++) {
            var name = files[i].replace(/^\s+$/g, "");
            var att = name.split('.');
            var ext = att[att.length - 1].toLowerCase();
            var isCSS = ext == "css";
            var tag = isCSS ? "link" : "script";
            var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
            var link = (isCSS ? "href" : "src") + "='" + $.includePath + name + "?ver=" + $.ver + "'";
            if ($(tag + "[" + link + "]").length == 0) document.write("<" + tag + attr + link + "></" + tag + ">");
        }
    }
});


//导航切换
function myCard(tag) {
    var phone = localStorage.getItem("loginid");
    var uid = localStorage.getItem("uid");
    if (phone == null || phone == '' || phone == 'undefined' || uid == '' || uid == null || uid == 'undefined') {
        window.location.href = "login.html";
    } else {
        if (tag == 0) {
            //localStorage.setItem("vipFlag",false);//专享区红标是否显示
            window.location.href = getVerUrl("vipmall.html");
        } else if (tag == 1) {
            window.location.href = getVerUrl("card_list.html");
        } else if (tag == 2) {
            window.location.href = getVerUrl("user.html");
        } else if (tag == 3) {
            window.location.href = getVerUrl("liuliang.html");
            //layer.tips('请耐心等待一下，我们正在拼命开发中···','#liulId', {tips: 3});
        }

    }
}

//获取带版本号的url链接
function getVerUrl(url) {
    var ver = localStorage.getItem("APP_VERSION") || new Date().getTime();
    return url + "?ver=" + ver;
}

//页面跳转    
function go(str) {
    window.location.href = getVerUrl(str);
}