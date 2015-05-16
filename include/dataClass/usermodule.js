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
     */
    this.addUser = function (userData, callback) {
        //用户名不能重复
        var usernameJson = {"username": userData.username};
        this.findOneByID(usernameJson, function (ret) {
            if (!ret) {
                //如果用户名不存在，则添加用户
                _self.insert(_self.tableName, userData, function (ret2) {
                    if (ret2) {
                        callback(true);
                    } else {
                        callback(0);
                    }
                });
            }
            else {
                callback(false);
            }
        });
    };

    /**
     * @description 判断用户是否存在
     */
    this.checkUser = function (value, callback) {
        _self.findOneByID(value,callback);
    };

    /**
     * @description 更新用户的邮箱信息
     */
    this.updateValid = function (username, callback) {
        var query ={
            "username": username
        };
        var update = {
            $set: {
                "isValid": 1
            }
        };
        var option ={
            "upsert":true,
            "safe":true
        };
         _self.modify(_self.tableName,query, update, option,function (ret2) {
             if(ret2){
                 callback(true);
             }
         });
    };
};


