/**
 * @description 用户信息的操作类
 */
var MySQL = require("./mysql.js");
var util = require("util");

var UserModule = function () {
    //继承MySQL类
    MySQL.call(this);
    util.inherits(this, MySQL);

    this.tableName = "huser";
    /**
     * @description 判断用户是否存在
     */
    this.checkUser = function (username, password, callback) {
        var sql="select * from "+this.tableName+" where username = '"+username+"' and  password = '"+password+"'";
        this.sqlquery(sql, function (result) {
            callback(result);
        });
    }
}
module.exports = UserModule;

