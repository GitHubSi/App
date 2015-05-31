/**
 * @description 对用户登录的信息进行处理
 * @version:2,修改了使用jade模板
 * @version:3 转化为module.exports方式
 */

var res;
var req;
var userId;
var UserModule = require(DATACLASS + "usermodule");
var UserModuleRead = new UserModule();
var digist = require(INCLUDE + "encode_class/crypto.js");
var ObjectID = require('mongodb').ObjectID;

module.exports = function () {

    this.init = function (response, request) {
        res = response;
        req = request;
    };

    /*
     * initialize login user
     */
    this.view = function () {
        lib.session.isLogin(res, req, function (err, ret) {
            if (ret) {
                userId = ret.userId;
                var search = {_id: ObjectID(userId)};
                UserModuleRead.findOneByID(search, function (ret) {
                    if (ret) {
                        res.render('index.jade', {'username': ret.username});
                    }
                });
            }
            else {
                res.render('index.jade');
            }
        });
    };
};
