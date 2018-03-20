var mysql = require('mysql');
var async = require('async');
var log = require('./log').logger('db.js');
var pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "shangyang",
    port: 3306,
    charset: 'UTF8MB4_GENERAL_CI',
    connectionLimit: 10,
    dateStrings: true,
    multipleStatements: true, //同时可以多表查询
    debug: ["ComQueryPacket"] //输出查询语句
});

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
};
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
                return callback(err, null);
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
                                // throw qerr;//抛出异常
                                conn.release();
                                return callback(qerr, null);
                            });
                        } else {
                            // return cb(null, "success");
                            return cb(null, result);//将每次执行结果返回
                        }
                    });
                }
                sqlTaskFun.push(tempSqlTaskFun);
            });

            async.series(sqlTaskFun, function(err, result) {
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
                            // callback(null, info);
                            callback(null, result);//返回给调用方执行结果
                        }
                    });
                }
            });
        });
    });
}

