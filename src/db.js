var mysql = require('mysql');
var async = require('async');
var log = require('./log').logger('db.js');
var pool = mysql.createPool({
    host: "192.168.1.100",
    user: "root",
    password: "root",
    database: "db",
    port: 3306,
    connectionLimit: 10
})

//执行sql语句的方法，包括增删改查
exports.execSql = function(sql, param, callback) {
        pool.getConnection(function(err, connection) {
            if (err) {
                log.error("数据库连接超时！");
                return callback(err, null);
            } else {
                connection.query(sql, param, function(error, results) {
                    connection.release(); //关掉连接，释放资源
                    if (error) {
                        log.error(error);
                        callback(error, null);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    }
    /**
     * 事物对象
     * @param {[type]}   sql      [description]
     * @param {[type]}   params   [description]
     * @param {Function} callback [description]
     */
exports.addSqlTask = function(sql, params, callback) {
    if (callback) {
        return callback(null, {
            sql: sql,
            params: params
        });
    }
    return {
        sql: sql,
        params: params
    }
}

//执行事务的方法
exports.execTrans = function(sqlTask, callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            log.error("数据库连接超时！");
            return callback(err, null);
        }
        conn.beginTransaction(function(err) {
            if (err) {
                console.log(err);
                return;
            }
            var sqlTaskFun = [];
            sqlTask.forEach(function(sqlTask) {
                var sql = sqlTask.sql;
                var params = sqlTask.params;
                var tempSqlTaskFun = function(cb) {
                    conn.query(sql, params, function(qerr, result) {
                        if (qerr) {
                            console.log("事务执行失败......");
                            conn.rollback(function() {
                                throw qerr;
                            });
                        } else {
                            return cb(null, "success");
                        }
                    });
                }
                sqlTaskFun.push(tempSqlTaskFun);
            });

            async.series(sqlTaskFun, function(err) {
                if (err) {
                    console.log(err);
                    conn.rollback(function(err) {
                        conn.release();
                        return callback(err, null);
                    })
                } else {
                    conn.commit(function(err, info) {
                        console.log(JSON.stringify(info));
                        if (err) {
                            conn.rollback(function(err) {
                                conn.release();
                                return callback(err, null);
                            })
                        } else {
                            console.log("transaction commit success!!!");
                            conn.release(); //关闭连接，释放资源
                            callback(null, info);
                        }
                    });
                }
            });
        });
    });
}


//执行存储过程的方法
// module.exports = {
//     addSqlTask: addSqlTask,
//     execSql: execSql,
//     execTrans: execTrans
// };
