/**
 * 分页对象
 * @param {[type]} totalRows   数据总条数
 * @param {[type]} currentPage 当前显示的第几页
 * @param {[type]} pageSize    每页显示的条数
 */
function PagingUtil(totalRows, currentPage, pageSize) {
    this.currentPage = currentPage === undefined ? 1 : currentPage; //当前是第几页,默认为第一页
    this.totalPages = 1; //最多能分多少页
    this.totalRows = totalRows === undefined ? 0 : totalRows; //总数据条数
    this.hasNextPage = false; //是否有下一页
    this.hasPrevPage = false; //是否有上一页
    this.pageSize = pageSize === undefined ? 10 : pageSize; //每页显示几条数据，默认为10条
    this.startRow = 0; //起始行
    // this.endRow = 0; //结束行
    this.listData = null; //当前页的分页数据
}

/**
 * 设置查询数据
 * @param {[type]} result [description]
 */
PagingUtil.prototype.setListData = function(result) {
    this.listData = result;

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
    this.pageSize = pageSize;

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
    this.currentPage = currentPage;
}

/**
 * 分页
 * @return {[type]} [description]
 */
PagingUtil.prototype.paging = function() {
    this.setTotalPages();
    if (this.currentPage === 1) { //第一页
        this.startRow = 0; //设置起始条数
        this.hasPrevPage = false;
        this.hasNextPage = true;
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
 * 设置总条数
 * @param {[type]} totalRows [description]
 */
PagingUtil.prototype.setTotalRows = function(totalRows) {
    this.totalRows = totalRows;
}


module.exports = PagingUtil;
