/**
 * @desc Class 数据表dailywork相关的操作类
 * @
 */

var Mysql = require("./mysql.js");
var util = require("util");

var DailyWork = function () {
    Mysql.call(this);
    util.inherits(this, Mysql);

    this.tableName = "dailywork";
}
module.exports = DailyWork;
