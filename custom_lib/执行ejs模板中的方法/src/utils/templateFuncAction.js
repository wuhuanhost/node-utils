//模拟模板中对应的业务层方法
// function getData(a, b, c, cb) {
//     setTimeout(function() {
//         // console.log(a);
//         // console.log(b);
//         // console.log(cb);
//         cb(null, a + b + c);
//     }, 3000);
// }

// function abx(a, b, cb) {
//     setTimeout(function() {
//         // console.log(a);
//         // console.log(b);
//         // console.log(cb);
//         cb(null, a + b);
//     }, 3000);
// }

var services = require("../biz/openCommFunc.js");


//测试字符串函数的执行
// var fun = `function test(cb){
//  abc(1,2,function(r){
//      cb(r);
//  });
// };
// test(function(result){
//  console.log(result);
// });`;

// // eval(fun);

// //解析函数
// var templateHtml = "<%var abc=abc(m,2);%>";

// //解析模板后的数据结构
// var testTemplateData = [{
//     funcName: "getData",
//     params: ["_m_", "_n_", 1]
// }, {
//     funcName: "abx",
//     params: [20, 10]
// }]




/**
 * 生成执行函数
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
function genFunction(_params, cb) {
    // return new funcBB(params.params[0],params.params[1], function(result) {
    //     console.log(result);
    //     cb(result)
    // });
    //方法一，所有的业务方法必须在此文件中
    // var func = eval(params.funcName);
    // params.params.push(cb);
    // services[params.funcName].apply(null, params.params); //调用这个函数并且把参数传递进去
    //方法2，所有的业务方法可以放在其它文件中
    _params.params.push(cb);
    services[_params.funcName].apply(null, _params.params); //调用这个函数并且把参数传递进去
}



// var p1= new Promise((resolve, reject) => {
//     //执行函数获取结果
//     genFunction(params, function(result) {
//         params.result = result;
//         console.log(params)
//         var data = {};
//         var argument = ["x", "y"]; //根据参数个数动态生成
//         data[params.funcName] = new Function(argument, "return " + params.result + ";");
//         data.m = 1;
//         console.log(data[params.funcName]())
//     })
// });


//执行时候的匿名函数
// var str1 = `new Promise((resolve, reject) => {
//     //执行函数获取结果
//     genFunction(params, function(err,result) {
//        if(err){
//          reject(err);
//        }else{
//          params.result = result;
//          console.log(params)
//          var data = {};
//          var argument = []; //根据参数个数动态生成
//          for(var i=0;i<params.params.length-1;i++){
//              argument.push("params"+i);
//          }
//          data[params.funcName] = new Function(argument, "return " + params.result + ";");
//          data.m = 1;
//          //console.log(data[params.funcName]())
//          resolve(data);
//        }
//     })
// });
// `

/**
 * 处理前端传过来的占位符参数
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
function actionParam(requestParams, _params) {
    for (var i = 0; i < _params.params.length; i++) {
        if (/^_.*?_$/.test(_params.params[i])) { //是占位符参数
            _params.params[i] = requestParams[_params.params[i].replace(/_/g, "")]
        }
    }
    return _params;
}

/**
 * 执行模板中的方法并且返回数据
 * @param  {[type]}   templateFuncData  [description]
 * @param  {[type]}   requestParams [description]
 * @param  {Function} cb            [description]
 * @return {[type]}                 [description]
 */
exports.execTemplateFunc = function(templateFuncData, requestParams, cb) {
    var list = []; //字符串方法数组
    for (var i = 0; i < templateFuncData.length; i++) {
        // var params1 = actionParam(params1);
            let funcParams = copyArr(templateFuncData[i].params); //方法的参数
            let params1 = actionParam(requestParams, templateFuncData[i]);
            //    console.log("++++++++++++++++++++++++");
            // console.log(params1);
            //       console.log("------------------------");
            var str = new Promise((resolve, reject) => {
                //执行函数获取结果
                genFunction(params1, function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        // console.log(result)
                        params1.result = result;
                        // console.log(params1.result);
                        var data = {};
                        var argument = []; //根据参数个数动态生成
                        for (var j = 0; j < params1.params.length - 1; j++) {
                            argument.push("params" + j);
                            // console.log(funcParams[j]+"   "+j)
                            if (/^_.*_$/.test(funcParams[j])) { //是占位符参数
                                var temp = funcParams[j].replace(/_/g, "");
                                data["_" + temp + "_"] = requestParams[funcParams[j].replace(/_/g, "")];
                            }
                        }
                        // if (typeof(result) === "string") {
                            data[params1.funcName] = new Function(argument, "return " + JSON.stringify(params1.result) + ";");
                        // } else {
                        //     console.log("===============================");
                        //     console.log(typeof(params1.result))
                        //     var dadasdasd = JSON.stringify(result);
                        //     data[params1.funcName] = new Function(argument, "return" + result);
                        // }
                        // console.log(data[params1.funcName]())
                        resolve(data);
                    }
                })
            });
            list.push(str);
    }
    //执行所有的异步方法获取数据
    Promise.all(list).then(values => {
        // console.log(values);
        var list = {};
        for (var i = 0; i < values.length; i++) {
            list = deepCopy(list, values[i]);
        }
        // console.log("------------------------");
        // console.log(list)
        cb(null, list);
    }).catch(function(reason) {
        // console.log(reason);
        cb(reason, null);
    });
}

//执行函数获取结果
// genFunction(params, function(result) {
//     params.result = result;
//     console.log(params)
//     var data = {};
//     var argument = ["x", "y"]; //根据参数个数动态生成
//     data[params.funcName] = new Function(argument, "return " + params.result + ";");
//     data.m = 1;
//     console.log(data[params.funcName]())
// })

// //组装数据
// var data = {};
// // data[params.funcName] = new Function(params.params[0], params.params[1], "return " + params.result + "");

/**
 * 数组拷贝
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function copyArr(arr) {
    let res = []
    for (let i = 0; i < arr.length; i++) {
        res.push(arr[i])
    }
    return res
}


/**
 * 对象深拷贝
 * @param  {[type]} p [description]
 * @param  {[type]} c [description]
 * @return {[type]}   [description]
 */
function deepCopy(p, c) {　　　　
    var c = c || {};　　　　
    for (var i in p) {　　　　　　
        if (typeof p[i] === 'object') {　　　　　　　　
            c[i] = (p[i].constructor === Array) ? [] : {};　　　　　　　　
            deepCopy(p[i], c[i]);　　　　　　
        } else {　　　　　　　　　
            c[i] = p[i];　　　　　　
        }　　　　
    }　　　　
    return c;　　
}
