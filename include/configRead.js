/**
 * @type module
 * @author fuhui
 * @time 2014-03-29
 * @description 默认读取conf目录下的文件
 */
var fs = require('fs');
exports.get = function (filename, key) {
    var configJson = {};
    try {
        var str = fs.readFileSync(CONF + filename, 'UTF-8');
        var configJson = JSON.parse(str);
    }
    catch (e) {
        console.log("JSON parse failed" + e);
    }
    return configJson[key];
}