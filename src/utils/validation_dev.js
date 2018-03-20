/**
 * @author dreamer.wuhuan
 * @date 2017-03-16
 * @desc node中使用的数据校验的中间件
 */

//数据校验框架
function NodeValidation() {
    this.count = 0; //处理规则计数
    this.filedCount = 0; //字段数统计
    this.validationData; //待校验的数据对象，第一个参数
    this.validationRules; //用户配置的校验规则，第二个参数
    this.callback; //校验完成后的回调函数，第三个参数
    this.customFunc = [];
    this.actionRulesList = []; //待执行校验规则数组
    this.actionCustomRulesList = []; //待执行的自定义校验规则
    this.rulesList = { //默认规则集
        required: true, //必须输入的字段，不能为空，不能为undefined
        maxLen: 8, //字段最大长度
        minLen: 6, //字段最小长度
        email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //必须是正确的email格式
        mobile: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, //必须是正确的大陆手机号码
        url: /[a-zA-z]+:\/\/[^s] */, //必须是合法的网址
        accept: "*.jpg|*.png", //过滤后缀名
        digits: true, //必须是整数
        number: true, //必须数字类型
        chinese: /^[\u4e00-\u9fa5]{0,}$/, //必须是汉字
        ipv4: /\d+\.\d+\.\d+\.\d+/, //必须是ip地址
        ipv6: /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/
    }; //默认规则数组
    this.rulesMsg = { //默认规则对应的提示消息
        required: "字段值不能为空",
        maxLen: "字段最大长度不能大于`${rule}`位",
        minLen: "字段最小长度不少于`${rule}`位",
        email: "email格式不正确",
        mobile: "手机号码格式不正确",
        url: "url格式不正确",
        accept: "后缀名不合法",
        digits: "字段值不是整数",
        number: "字段值不是数字类型",
        chinese: "字段值不是中文汉字",
        ipv4: "ipv4地址格式不正确",
        ipv6: "ipv6地址格式不正确"
    };
};

/**
 * 初始话方法
 * @param  {[type]} validation [description]
 * @return {[type]}            [description]
 */
NodeValidation.prototype = {
    init: function(data, validationRules, callback) {
        this.validationData = data;
        for (var vd in data) {
            this.filedCount++;
        }
        this.validationRules = validationRules;
        this.callback = callback;
        this.actionRules(this.validationRules);
    },
    actionRules: function(vr) { //处理规则数据
        for (var i = 0, len = vr.length; i < len; i++) {
            if (vr[i].myRules) { //如果有自定义规则
                this.parseCustomRules(vr[i].filed, vr[i].myRules);
            };
            if (vr[i].rules) {
                this.parseRules(vr[i].filed, vr[i].rules);
            };
            if (typeof vr[i].myFunc === "function") { //自定义函数
                this.customFunc.push({
                    filed: vr[i].filed,
                    func: vr[i].myFunc
                });
            };
        }
        this.process(this.customFunc, this.actionCustomRulesList, this.actionRulesList);
    },
    process: function(cf, acrl, acl) { //总处理流程
        var filed; //当前处理的字段
        var filedValue; //当前处理的字段的值

        //自定义函数校验
        for (var i = 0, len = cf.length; i < len; i++) {
            filed = cf[i].filed;
            filedValue = this.validationData[filed];
            if (!filedValue) {
                throw filed + "字段无效!";
            };
            var flag = cf[i].func(filedValue);
            this.count++;
            if (!flag) {
                return this.callback(false, {
                    success: false,
                    filed: filed,
                    fileVal: filedValue,
                    rule: cf[i].func,
                    ruleDesc: "自定义函数校验",
                    msg: "自定义函数校验失败"
                });
            }
        };

        //处理自定义规则数组
        var acrl = acrl;
        for (var i = 0, len = acrl.length; i < len; i++) {
            filed = acrl[i].filed;
            filedValue = this.validationData[filed];
            if (!filedValue) {
                throw filed + "字段无效!";
            };
            for (var j = 0, rlen = acrl[i].rules.length; j < rlen; j++) {
                var flag = this.execRegExp(filedValue, acrl[i].rules[j].rule);
                this.count++;
                if (!flag) {
                    return this.callback(false, {
                        success: false,
                        filed: filed,
                        fileVal: filedValue,
                        rule: acrl[i].rules[j].rule,
                        ruleDesc: "规则为正则表达式",
                        msg: acrl[i].rules[j].msg
                    });
                }
            }
        };

        //处理默认规则数组
        var acl = acl;
        for (var i = 0, len = acl.length; i < len; i++) {
            filed = acl[i].filed;
            filedValue = this.validationData[filed];
            if (!filedValue) {
                throw filed + "字段无效!";
            };
            for (var j = 0, rlen = acl[i].rules.length; j < rlen; j++) {
                var flag = this.rulesFunc()[acl[i].rules[j].rule](filedValue, acl[i].rules[j].rule, acl[i].rules[j].desc);
                this.count++;
                if (!flag) {
                    return this.callback(false, {
                        success: false,
                        filed: filed,
                        fileVal: filedValue,
                        rule: acl[i].rules[j].rule,
                        ruleDesc: "规则为系统预设",
                        msg: this.rulesMsg[acl[i].rules[j].rule].replace('`${rule}`', acl[i].rules[j].desc)
                    });
                }
            }
        };

        //执行到这里说明全部通过，就返回success
        this.callback(true, {
            success: "success",
            msg: "恭喜你！" + this.filedCount + "个字段，" + this.count + "条校验规则全部通过！"
        });
    },
    vaild: function(data, validationRules, callback) { //校验方法，调用方使用的方法
        this.init(data, validationRules, callback);
    },
    parseCustomRules: function(filed, rules) { //解析自定义规则
        var cr = {
            filed: filed,
            rules: []
        };
        for (var i = 0, len = rules.length; i < len; i++) {
            cr.rules.push(rules[i]);
        };
        this.actionCustomRulesList.push(cr);
        // console.log(JSON.stringify(this.actionCustomRulesList));
    },
    parseRules: function(filed, rules) { //解析默认规则
        var cr = {
            filed: filed,
            rules: []
        };
        for (var r in rules) {
            cr.rules.push({ rule: r, desc: rules[r] });
        };
        this.actionRulesList.push(cr);
        // console.log(JSON.stringify(this.actionRulesList));
    },
    execRegExp: function(val, rege) { //执行正则的方法，校验自定义规则
        if (rege.test(val)) {
            return true;
        } else {
            return false;
        }
    },
    rulesFunc: function() {
        var _this = this;
        return {
            required: function(val, rule, ruleParam) {
                if (val !== "" && val != undefined) {
                    return true;
                } else {
                    return false;
                }
            },
            maxLen: function(val, rule, ruleParam) {
                var valLen = val.length;
                if (valLen <= parseInt(ruleParam)) {
                    return true;
                } else {
                    return false;
                }
            },
            minLen: function(val, rule, ruleParam) {
                var valLen = val.length;
                if (valLen >= parseInt(ruleParam)) {
                    return true;
                } else {
                    return false;
                }
            },
            email: function(val, rule, ruleParam) {
                if (!ruleParam) {
                    return true;
                }
                var rege = _this.rulesList[rule];
                return _this.execRegExp(val, rege);
            },
            mobile: function(val, rule, ruleParam) {
                if (!ruleParam) {
                    return true;
                }
                var rege = _this.rulesList[rule];
                return _this.execRegExp(val, rege);
            },
            url: function(val, rule, ruleParam) {
                if (!ruleParam) {
                    return true;
                }
                var rege = _this.rulesList[rule];
                return _this.execRegExp(val, rege);
            },
            chinese: function(val, rule, ruleParam) {
                if (!ruleParam) {
                    return true;
                }
                var rege = _this.rulesList[rule];
                return _this.execRegExp(val, rege);
            },
            ipv4: function(val, rule, ruleParam) {
                if (!ruleParam) {
                    return true;
                }
                console.log(val + "  " + rule);
                var rege = _this.rulesList[rule];
                return _this.execRegExp(val, rege);
            },
            ipv6: function(val, rule, ruleParam) {
                if (!ruleParam) {
                    return true;
                }
                var rege = _this.rulesList[rule];
                return _this.execRegExp(val, rege);
            }
        }
    }
};

/**
 **使用方法
 **/

//需要校验的数据
var data = {
    name: "1123",
    password: "122",
    path: "www@da.com"
};

//1、书写校验规则
var validationRule = [{
    filed: "name",
    rules: {
        required: true,
        maxLen: 9,
        minLen: 3
    },
    myRules: [{ //自定义规则
        rule: /^(\-|\+)?\d+(\.\d+)?$/, //规则描述，使用正则表达式
        msg: "字段必须为数字类型" //错误提示消息
    }],
    myFunc: function(val) { //字段的值
        return true;
    }
}, {
    filed: 'path',
    rules: {
        email: true
    }
}];


//框架使用方法
//2、实例化
var nv = new NodeValidation();
//3、数据校验
nv.vaild(data, validationRule, function(result, message) {
    // console.log(result);
    console.log(message);
});


//思考：
//1、两个字段如何使用相同的校验规则
//2、如何让调用方使用简单
//3、自定义异步函数如何处理
