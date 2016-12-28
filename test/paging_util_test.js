var db=require('../src/db');//封装的数据库操作的类
var PagingUtil=require('../src/paging_util');

//使用方法一
exports.test1 = function(cb) {
    var pageing = new page(); //实例化分页对象
    pageing
        .setDebug(true)//开启调试模式,打印分页sql语句
        .setCurrentPage(2)//设置需要第几页的数据
        .setPageSize(2)//每页显示的条数
        .setTable("books")//查询的表
        .setOrderBy("id")//按照id排序
        .paging(function(err, result) {//分页回调函数
            console.log(result)
            cb(null, result)
        })
}

