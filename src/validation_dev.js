/**
 * @author dreamer.wuhuan
 * @date 2017-03-16
 * @desc node中使用的数据校验的中间件
 */
var validation = {
    fileValue: "1",
    rules: {
        required: true,
        maxLen: 9,
        minLen: 3
    },
    customRules: [{ //自定义规则
        rule: "\\d", //规则描述，使用正则表达式
        msg: "字段必须为数字类型" //提示消息
    }]
};


//数据校验框架
function NodeValidation() {
    this.fileValue = "";
    this.customRules = []; //自定义规则数组
    this.errMsg = {}; //错误消息
    this.rules = {}; //用户选择的规则的集合
    this.rulesList = { //默认规则集
        required: true, //必须输入的字段，不能为空，不能为undefined
        maxLen: 8, //字段最大长度
        minLen: 6, //字段最小长度
        email: true, //必须是正确的email格式
        mobile: true, //必须是正确的大陆手机号码
        url: true, //必须是合法的网址
        accept: "*.jpg|*.png", //过滤后缀名
        digits: true, //必须是整数
        number: true, //必须数字类型
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
        number: "字段值不是数字类型"
    };
    this.successMsg = { //校验争取返回的消息
        success: "ok",
        msg: "校验通过",
    }
};

/**
 * 初始话方法
 * @param  {[type]} validation [description]
 * @return {[type]}            [description]
 */
NodeValidation.prototype = {
    init: function(validation) {
        this.fileValue = validation.fileValue;
        this.customRules = validation.customRules;
        this.rules = validation.rules;
    },
    //校验自定义规则
    checkCustomRules: function(val, customRules) {
        var rege;
        for (var i = 0, len = customRules.length; i < len; i++) {
            rege = eval('/' + customRules[i].rule + '/'); //创建正则表达式
            msg = customRules[i].msg;
            result = rege.test(val);
            if (!result) { //发现错误就停止下面的运行，返回消息给调用方
                this.errMsg = {
                    success: "failed",
                    fileVal: val,
                    rule: "自定义规则-" + customRules[i].rule,
                    msg: msg,
                }
                break;
            } else {
                this.errMsg = this.successMsg;
            }
        }
        return this.errMsg;
    },
    //校验默认规则
    checkRules: function(val, customRules) {
        for (var key in this.rules) {
            console.log(key + " ===== " + this.rules[key]);
            var result = this.rulesFunc()[key](val, this.rules[key]);
            if (result.success === "failed") {
                this.errMsg = result;
                break;
            } else {
                this.errMsg = this.successMsg;
            }
        }
        return this.errMsg;
    },
    rulesFunc: function() {
        var _this = this;
        return {
            required: function(val, rule) {
                console.log("required");
                if (val !== "" && val != undefined) {
                    return _this.successMsg;
                } else {
                    return {
                        success: "failed",
                        fileVal: val,
                        rule: "required-" + rule,
                        msg: _this.rulesMsg.required
                    }
                }
            },
            maxLen: function(val, rule) {
                var valLen = val.length;
                if (valLen <= parseInt(rule)) {
                    return _this.successMsg;
                } else {
                    return {
                        success: "failed",
                        fileVal: val,
                        rule: "maxLen-" + rule,
                        msg: _this.rulesMsg.maxLen.replace(/`\${rule}`/, "{ " + rule + " }") + ",校验字符串长度{ " + valLen + " }",
                    }
                }
            },
            minLen: function(val, rule) {
                var valLen = val.length;
                if (valLen >= parseInt(rule)) {
                    return _this.successMsg;
                } else {
                    return {
                        success: "failed",
                        fileVal: val,
                        rule: "minLen-" + rule,
                        msg: _this.rulesMsg.minLen.replace(/`\${rule}`/, "{ " + rule + " }") + ",校验字符串长度{ " + valLen + " }",
                    }
                }
            },
            email: function() {

            },
            mobile: function() {

            }
        }
    }
};


//测试
var nvasd = new NodeValidation();
nvasd.init(validation);
console.log(nvasd.checkRules(nvasd.fileValue, nvasd.customRules));

/**
**使用方法
**/

//需要校验的数据
var data={
	name:"root",
	password:"12312312321"
};

//校验规则
var validationRule = [{
    filed: "name",
    rules: {
        required: true,
        maxLen: 9,
        minLen: 3
    },
    customRules: [{ //自定义规则
        rule: "\\d", //规则描述，使用正则表达式
        msg: "字段必须为数字类型" //提示消息
    }],
	customFunc:function(){//自定义处理函数
		console.log("自定义处理函数，用于调用其它函数或者接口进行数据校验");
	}
},{
    filed: "password",
    rules: {
        required: true,
        maxLen: 9,
        minLen: 3
    }
}];


//框架使用方法
var nv = new NodeValidation()
nv.vaild(data,validationRule,function(result){
	console.log("校验结果返回值");
});


//思考：
//1、两个字段如何使用相同的校验规则
//2、如何让调用方使用简单