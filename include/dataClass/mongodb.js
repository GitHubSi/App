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

    this.tableName = "";
    _self = this;
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
     * @param {type} whereJson
     * @param {type} option
     * @param {type} callback
     * @returns {undefined}t
     */
    this.insert = function (rowInfo, option, callback) {
        connection(function (mdbConn) {
            mdbConn.collection(_self.tableName, function (err, collection) {
                if (err) {
                    callback(err, false);
                }
                collection.insert(rowInfo, option, function (err, objects) {
                    if (err) {
                        //write log
                        callback(err, false);
                        return;
                    }
                    else {
                        callback(null, objects);
                    }
                });
            });
        });
    };


    /*
     * 查找符合条件的documents
     * @param {type} tableName 表名
     * @param {type} whereJson 查询条件
     * @param {type} orderByJson 排序条件
     * @param {type} limitJson 限制返回
     * @param {type} fieldJson 返回的字段类型
     * @param {type} callback 回调函数
     * @returns {undefined}
     */
    this.select = function (whereJson, orderByJson, limitJson, fieldJson, callback) {
        connection(function (mdbConn) {
            mdbConn.collection(_self.tableName, function (err, collection) {
                if (err) {
                    callback(err);
                }
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
                        callback(err);
                    }
                    else {
                        if(docs.length == 0){
                            callback(null, null);
                        }
                        else{
                            callback(null, docs);
                        }
                    }
                });
                cursor.rewind();
            });
        });
    };

    /*
     * 查找单条数据,并不通过系统的mongodb进行查找,change: use findOne to replace find method;
     * @param {type} whereJson
     * @param {type} callback
     * @returns {undefined}
     */
    this.findOneByID = function (whereJson, callback) {
        connection(function (mdbConn) {
            mdbConn.collection(_self.tableName, function (err, collection) {
                if (err) {
                    return;
                }
                collection.findOne(whereJson, function (err, item) {
                    if (item) {
                        callback(item);
                    } else {
                        callback(false);
                    }
                });
            });
        });
    };

    /*
     * 更新用户的操作,该方法更新了option参数，之前使用默认值{safe: true}
     * @param {type} tableName
     * @param {type} whereJson
     * @param {type} rowInfo
     * @param {type} option
     * @param {type} callback
     * @returns {undefined}
     */
    this.modify = function (tableName, whereJson, rowInfo, option, callback) {
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
            });
        });
    };

    /**
     * delet a document form collection
     * @param {type} tableName
     * @param {type} whereJson
     * @param {type} callback
     * @returns {undefined}
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
    };
};
