/**
 * @type class BaseModule
 * @author fuhui
 * @time 2014-04-04
 * @version 1
 * @desc mongodb数据操作
 */

var mdb = null;
var mdbConn = null;
var mongodb = require('mongodb');

module.exports = function () {

    function connection(callback) {
        if (!mdbConn) {
            var configRead = require(INCLUDE + 'configRead.js');
            var dbConfig = configRead.get('dbconfig.json', 'mdb');
            client = {};
            client.host = dbConfig['host'];
            client.port = dbConfig['port'];
            client.dbNmae = dbConfig['dbName'];
            var server = new mongodb.Server(client.host, client.port);
            mdb = new mongodb.Db(client.dbNmae, server, {safe: true});
            mdb.open(function (err, dbObject) {
                mdbConn = dbObject;
                callback(mdbConn);
                if (err) {
                    console.log('error when connecting to db:', err);
                    setTimeout(connection, 2000);
                }
            });
        }
        else {
            callback(mdbConn);
        }
    }

    /*
     * insert data to database 如果成功，返回插入的objectId
     * @param {type} tableName
     * @param {type} whereJson
     * @param {type} callback
     * @returns {undefined}
     */
    this.insert = function (tableName, rowInfo, callback) {
        connection(function (mdbConn) {
            mdbConn.collection(tableName, function (err, collection) {
                collection.insert(rowInfo, function (err, objects) {
                    if (err) {
                        //write log
                        callback(false);
                    }
                    else {
                        callback(objects);
                    }
                });
            });
        });
    };


    //????????????
    this.select = function (tableName, whereJson, orderByJson, limitJson, fieldJson, callback) {
        connection(function (mdbConn) {
            mdbConn.collection(tableName, function (err, collection) {
                var cursor = collection.find(whereJson, fieldJson);
                if (orderByJson) {
                    cursor.sort(orderByJson);
                }
                if (limitJson) {
                    var skip = limitJson['skip'] ? limitJson['skip'] : 0;
                    cursor.limit(limitJson['num']).skip(skip);
                }
                cursor.toArray(function (err, docs) {
                    if (err) {
                        callback(true);
                    }
                    else {
                        callback(docs);
                    }
                });
                cursor.rewind();
            });
        });
    }

    /**
     * 查找单条数据
     * 并不通过系统的mongodb进行查找
     * change: use findOne to replace find method;
     */
    this.findOneByID = function (tableName, whereJson, callback) {
        connection(function (mdbConn) {
            mdbConn.collection(tableName, function (err, collection) {
                if(err){
                    return;
                }
                var document = collection.findOne(whereJson);
                if(document){
                    callback(document);
                }else{
                    callback(false);
                }
            });
        });
    };

    /**
     * 更新用户的操作
     * 该方法更新了option参数，之前使用默认值{safe: true}
     */
    this.modify = function (tableName, whereJson, rowInfo,option, callback) {
        connection(function (mdbConn) {
            mdbConn.collection(tableName, function (err, collection) {
                collection.update(whereJson, rowInfo, option, function (err) {
                    if (err) {
                        console.log(err);
                        callback(false);
                    }
                    else {
                        callback(true);
                    }
                });
            })
        });
    }

    /**
     *  ??????????
     *
     */
    this.remove = function (tableName, whereJson, callback) {
        connection(function (mdbConn) {
            mdbConn.collection(tableName, function (err, collection) {
                collection.remove(whereJson, function (err) {
                    if (err) {
                        callback(false);
                    }
                    else {
                        callback(true);
                    }
                });
            });
        });
    }
}