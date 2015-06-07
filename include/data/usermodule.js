/**
 * @Path: \App\include\dataClass\userregister.js
 * user register class
 */
var baseMongodB = require("./mongodb.js");
var util = require("util");

module.exports = function () {
    //inhert from baseMongodB
    baseMongodB.call(this);
    util.inherits(this, baseMongodB);
    this.tableName = "user";
    _self = this;

    /**
     * 逻辑：如果用户名不存在，则向数据表中插入数据
     * @param {json} userData
     * @returns {undefined}
     * @callback (err,ret)
     */
    this.addUser = function (userData, callback) {
        //用户名不能重复
        var usernameJson = {"username": userData.username};
        this.findOneByID(usernameJson, function (err, ret) {
            //查询发生错误，并不代表没有查找到数据
            if (err) {
                err.self_msg = "system error";
                err.self_code = "500";
                callback(err);
                return;
            }
            //如果查找到了数据，也返回
            if (ret) {
                ret.self_msg = "data has existed";
                ret.self_code = "400";
                callback(ret);
                return;
            }
            //如果用户名不存在，则添加用户
            _self.insert(userData, {}, function (err, ret2) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null);
            });
        });
    };

    /**
     * @description 判断用户是否存在
     */
    this.checkUser = function (value, callback) {
        _self.findOneByID(value, callback);
    };

    /**
     * @description 更新用户的邮箱信息
     */
    this.updateValid = function (username, callback) {
        var query = {
            "username": username
        };
        var update = {
            $set: {
                "isValid": 1
            }
        };
        var option = {
            "upsert": true,
            "safe": true
        };
        _self.modify(_self.tableName, query, update, option, function (ret2) {
            if (ret2) {
                callback(true);
            }
        });
    };
};


