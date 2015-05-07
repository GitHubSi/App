/**
 * @type class BaseModule
 * @author fuhui
 * @time 2014-03-29
 * @version 1
 * @desc mysql数据库操作的基类
 */

//全局的mysql连接句柄
db = null;
module.exports = function () {

    this.tableName = '';

    __constructor();
    function __constructor() {
        var configRead = require(INCLUDE + 'configRead.js');
        var dbConfig = configRead.get('dbconfig.json', 'db');
        client = {};
        client.host = dbConfig['host'];
        client.port = dbConfig['port'];
        client.user = dbConfig['user'];
        client.password = dbConfig['password'];
        var mysql = require('mysql');
        db = mysql.createConnection(client);
        db.connect(function (err) {
            if (err) {
                console.log('error when connecting to db:', err);
                setTimeout(__constructor, 2000);
            }
        });
        db.on('error', function (err) {
            console.log('db error', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                __constructor();
            } else {
                throw err;
            }
        });
        db.query('use ' + 'hdaily', function (err, result) {
            if (err) {
                console.log('ClientConnectionReady Error:' + err.message);
                db.end();
            }
        })
    }

    //数据库的插入方法
    this.insert = function (rowInfo, callback) {
        db.query('insert into ' + this.tableName + " set ?", rowInfo, function (err, result) {
            if (err)
                throw err;
            callback(result);
        });
    };

    //数据库条件查询
    this.select = function (whereJson, orderByJson, limitArr, fieldArr, callback) {
        var andWhere = whereJson['and'];
        var orWhere = whereJson['or'];
        var andArr = [];
        var orArr = [];
        var flg = false;
        var andStr = "";
        var orStr = "";
        var selectSql = "";
        for (var i = 0; i < andWhere.length; i++) {
            andArr.push(andWhere[i]['key'] + andWhere[i]['opt'] + andWhere[i]['value']);
            if (andArr.length > 0) {
                andStr = andArr.join(' and ');
                flg = true;
            }
        }
        for (var i = 0; i < orWhere.length; i++) {
            orArr.push(orWhere[i]['key'] + orWhere[i]['opt'] + orWhere[i]['value']);
            if (orArr.length > 0) {
                orStr = ' or ' + orArr.join(' or ');
                flg = true;
            }
        }
        var fieldStr = fieldArr.length > 0 ? fieldArr.join(',') : " * ";
        var limitStr = limitArr > 0 ? ' limit ' + limitArr.join(',') : '';
        var orderStr = orderByJson ? ' order by ' + orderByJson['key'] + ' ' + orderByJson['type'] : '';
        if (flg == true) {
            selectSql = 'select ' + fieldStr + ' from ' + this.tableName + orderStr + limitStr;
        } else {
            selectSql = 'select ' + fieldStr + ' from ' + this.tableName + andStr + orStr + orderStr + limitStr;
        }
        db.query(selectSql, function (err, result) {
            if (err) {
                throw err;
            }
            callback(result);
        });
    }

    /**
     * 根据条件查询数据库中的一条记录
     *
     */
    this.findOne = function (whereJson, callback) {
        
        db.query('select * from ' + this.tableName + ' where ?', whereJson, function (err, result) {
            if (err) {
                console.log('GetData Error:' + err.message);
                db.end();
                callback(false);
            }
            else {
                if (result) {//如果查到数据则返回一条数据，否则返回空数据
                    callback(result.shift());
                } else {
                    callback(result)
                }
            }
        });
    }
    
    /**
     * @description 用于构造sql语句进行数据库查询
     * @param {type} sql
     * @param {type} callback
     * @returns {undefined}
     */
    this.sqlquery = function(sql,callback){
        db.query(sql, false, function (err, result) {
            if (err) {
                console.log('GetData Error:' + err.message);
                db.end();
                callback(false);
            }
            else {
                if (result) {//如果查到数据则返回一条数据，否则返回空数据
                    callback(result.shift());
                } else {
                    callback(result)
                }
            }
        });
    }

    /**
     * 修改数据库中的一条数据
     *
     */
    this.modify = function (whereJson, rowInfo, callback) {
        db.query('update ' + this.table + ' set ? where ?', [rowInfo, whereJson], function (err, result) {
            if (err) {
                console.log('ClientReady Error: ' + err.message);
                callback(false);
            }
            else {
                callback(result);
            }
        });
    }

    /**
     *  删除数据库记录
     *
     */
    this.remove = function (whereJson, callback) {
        db.query('delete from ' + this.tableName + ' where ?', whereJson);
        if (err) {
            console.log('ClientReady Error: ' + err.message);
            db.end();
            callback(false);
        }
        else {
            callback(result);
        }
    }
}