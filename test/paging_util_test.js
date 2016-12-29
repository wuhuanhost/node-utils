var db=require('../src/db');//封装的数据库操作的类
var PagingUtil=require('../src/paging_util');

//使用方法一
exports.test = function(cb) {
    var pageing = new page(); //实例化分页对象
    pageing
        .setDebug(true) //开启调试模式
        .setCurrentPage(2) //显示第2页
        .setPageSize(2) //每页显示2条
        .setTable("books") //books表
        .setOrderBy("ID") //排序字段
        .setSortBy("ASC") //升序排列
        .paging(function(err, result) {
            console.log(result)
            cb(null, result)
        })
}
