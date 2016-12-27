var db=require('../src/db');//封装的数据库操作的类
var PagingUtil=require('../src/paging_util');

//使用方法一
exports.test1 = function(cb) {
    var sql = "select count(*) as count from books";
    db.execSql(sql, [], function(err, result) {
        console.log("总记录条数:" + result[0].count);
		//1、实例化分页对象
        var pageing = new PagingUtil(result[0].count, 3, 2); 
        //2、分页
        pageing.paging();
        var sql1 = "select * from books limit ?,?";
        var params = [pageing.startRow, pageing.pageSize];
        db.execSql(sql1, params, function(err, res) {
			//3、设置数据
            pageing.setListData(res);
            cb(null, pageing);
        });
    })
}

//使用方法二
exports.test2 = function(cb) {
    var sql = "select count(*) as count from books";
    db.execSql(sql, [], function(err, result) {
        console.log("总记录条数:" + result[0].count);
		//1、实例化分页对象
        var pageing = new PagingUtil(); 
        //1、设置总条数，必须设置
        pageing.setTotalRows(result[0].count);
        //2、设置当前页
        pageing.setCurrentPage(2);
		//设置每页显示的条数，不设置的时取默认值10
        pageing.setPageSize(2);
        //3、分页
        pageing.paging();
        var sql1 = "select * from books limit ?,?";
        var params = [pageing.startRow, pageing.pageSize];
        db.execSql(sql1, params, function(err, res) {
			//4、设置数据
            pageing.setListData(res);
            cb(null, pageing);
        });
    })
}