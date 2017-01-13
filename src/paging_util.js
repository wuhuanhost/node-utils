var db = require('./db');
var async = require('async');
/**
 * 分页对象
 * @param {[type]} totalRows   数据总条数
 * @param {[type]} currentPage 当前显示的第几页
 * @param {[type]} pageSize    每页显示的条数
 */
function PagingUtil(currentPage, pageSize) {
    this.currentPage = currentPage === undefined ? 1 : parseInt(currentPage); //当前是第几页,默认为第一页
    this.totalPages = 1; //最多能分多少页
    this.totalRows = 0; //总数据条数
    this.hasNextPage = false; //是否有下一页
    this.hasPrevPage = false; //是否有上一页
    this.pageSize = pageSize === undefined ? 10 : parseInt(pageSize); //每页显示几条数据，默认为10条
    this.startRow = 0; //起始行
    // this.endRow = 0; //结束行
    this.table = ""; //要查询的表
    this.queryFiled = ""; //要查询的字段
    this.condition = ""; //查询条件
    this.orderBy = ""; //排序
    this.countSql = ""; //查询总条数的sql
    this.pagingSql = ""; //分页sql
    this.sortBy = ""; //排序类型
    this.debug = false; //是否开启调试模式
}

/**
 * 排序类型
 * @param {[type]} sortBy [description]
 */
PagingUtil.prototype.setSortBy = function(sortBy) {
    this.sortBy = sortBy;
    return this;
}


/**
 * 设置按照什么字段排序
 * @param {[type]} orderBy [description]
 */
PagingUtil.prototype.setOrderBy = function(orderBy) {
    this.orderBy = orderBy;
    return this;
}


/**
 * 设置要查询的字段
 * @param {[type]} filed [description]
 */
PagingUtil.prototype.setQueryFiled = function(queryFiled) {
    this.queryFiled = queryFiled;
    return this;
}



/**
 * 设置查询条件
 * @param {[type]} condition [description]
 */
PagingUtil.prototype.setCondition = function(condition) {
    this.condition = condition;
    return this;
}



/**
 * 设置要查询的表
 * @param {[type]} table [description]
 */
PagingUtil.prototype.setTable = function(table) {
    this.table = table;
    return this;

}



/**
 * 获取分页sql
 * @return {[type]} [description]
 */
PagingUtil.prototype.getPagingSql = function() {
    this.queryFiled = this.queryFiled || "*";
    this.condition = this.condition || "";
    this.sortBy = this.sortBy || "ASC";
    var orderBy = "";
    if (this.orderBy === "" && this.sortBy === "") {
        orderBy = "";
    } else {
        if (this.orderBy === "") {
            orderBy = "";
        } else {
            orderBy = "ORDER BY " + this.orderBy + " " + this.sortBy;
        }
    }
    this.pagingSql = "SELECT " + this.queryFiled + " FROM " + this.table + " " + this.condition + " " + orderBy + " LIMIT ?,?";
    return this;
}



/**
 * 获取计算总条数的sql
 * @return {[type]} [description]
 */
PagingUtil.prototype.getCountSql = function() {
    this.condition = this.condition || "";
    this.countSql = "SELECT COUNT(1) AS count FROM " + this.table + " " + this.condition;
    return this;
}


/**
 * 获取数据
 * @return {[type]} [description]
 */
PagingUtil.prototype.getListData = function() {
    return this.listData;
}

/**
 * 设置每页需要显示的条数
 */
PagingUtil.prototype.setPageSize = function(pageSize) {
    this.pageSize = parseInt(pageSize);
    return this;

}

/**
 * 数据一共能分多少页
 * @param {[type]} num [description]
 */
PagingUtil.prototype.setTotalPages = function() {
    var totalPages = 0;
    totalPages = parseInt((this.totalRows - 1) / this.pageSize) + 1;
    this.totalPages = totalPages;
};


/**
 * 设置当前第几页
 * @param {[type]} currentPage [description]
 */
PagingUtil.prototype.setCurrentPage = function(currentPage) {
    this.currentPage = parseInt(currentPage);
    return this;
}

/**
 * 是否打印sql语句
 * @param {[type]} boolean [description]
 */
PagingUtil.prototype.setDebug = function(boolean) {
    this.debug = boolean;
    return this;

}

/**
 * 计算起始行
 * @return {[type]} [description]
 */
PagingUtil.prototype.computedStartRow = function() {
    if (this.currentPage === 1) { //第一页
        this.startRow = 0; //设置起始条数
        this.hasPrevPage = false;
        if (this.totalPages > 1) {
            this.hasNextPage = true;
        } else {
            this.hasNextPage = false;
        }
    } else if (1 < this.currentPage && this.currentPage < this.totalPages) { //中间页
        this.hasNextPage = true;
        this.hasPrevPage = true;
        this.startRow = (this.currentPage - 1) * this.pageSize;
    } else if (this.currentPage === this.totalPages) { //最后一页
        this.startRow = (this.currentPage - 1) * this.pageSize;
        this.hasNextPage = false;
        this.hasPrevPage = true;
    }
}


/**
 * 分页方法
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
PagingUtil.prototype.paging = function(cb) {
    //获取计算总条数的sql;
    var sql1 = this.getCountSql().countSql;
    var _this = this;
    async.series([function(callback) {
        db.execSql(sql1, null, function(err, result) {
            _this.totalRows = result[0].count; //总条数
            _this.setTotalPages(); //总页数
            _this.computedStartRow(); //计算起始行
            callback();
        });
    }, function(callback) {
        //分页sql语句
        var sql2 = _this.getPagingSql().pagingSql;
        var sqlParam = [_this.startRow, _this.pageSize];
        if (_this.debug) {
            console.warn("分页sql语句>>>:::::::::::::::::::::::::::::::::");
            console.log(sql2);
            console.warn("sql语句参数>>>:::::::::::::::::::::::::::::::::");
            console.log(sqlParam)
        }
        db.execSql(sql2, sqlParam, callback);
    }], function(err, results) {
        if (_this.debug) {
            console.warn("分页数据>>>:::::::::::::::::::::::::::::::::");
            console.log(results[1])
        }
        if (err) {
            cb(err, null)
        } else {
            var pagingData = {
                pagingData: results[1],
                currentPage: _this.currentPage,
                totalPages: _this.totalPages,
                totalRows: _this.totalRows,
                hasNextPage: _this.hasNextPage,
                hasPrevPage: _this.hasPrevPage,
                pageSize: _this.pageSize,
                startRow: _this.startRow
            };
            cb(null, pagingData)
        }
    });
}

module.exports = PagingUtil;
