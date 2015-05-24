/**
 * @desc Class 数据表dailywork相关的操作类
 * @
 */

var Mongodb = require("./mongodb.js");
var util = require("util");

var DailyWork = function () {
    Mongodb.call(this);
    this.tableName = "dailywork";
};
util.inherits(DailyWork, Mongodb);

module.exports = DailyWork;
