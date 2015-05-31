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
var async = require('async');

module.exports = function () {

    this.init = function (response, request) {
        res = response;
        req = request;
    };

    /**
     * 
     * @description 对用户登录的信息进行验证
     */
    this.login = function () {
        async.waterfall([
            //1. 判断用户是否登录
            function (callback) {
                lib.session.isLogin(res, req, function (err, ret) {
                    if (err) {
                        callback(err);
                    }
                    if (ret) {
                        userId = ret.userId;
                        if (userId) {
                            res.render('login.jade', {'error': "用户已经登录，请退出后重新登录"});
                            callback(true);
                        }
                    } else {
                        callback(false);
                    }
                });
            },
            //2. 根据回调函数的值进行用户登录
            function (callback) {
                lib.httpParam.POST(req, function (value) {
                    value.password = digist.tcrypto(value.password);
                    callback(false, value);
                });
            },
            //3. 查看用户是否存在数据库
            function (args, callback) {
                UserModuleRead.checkUser(args, function (result) {
                    if (result) {
                        lib.session.setSession(res, req, result._id, function (session) {
                            res.setHeader('Set-Cookie', lib.httpParam.serialize('SESSID=', session.SESSID, {path: '/'}));
                            res.render('index.jade', {'username': result.username});
                            callback(false);
                        });
                    } else {
                        res.render('login.jade', {'error': "用户名或者密码错误"});
                        callback(false);
                    }
                });
            }
        ], function (err, content) {
            if (err) {
                console.log("having something break program");
            }
            else {
                console.log('***');
            }
        });
    };

    this.chk = function () {
        //验证curl接口
        console.log(curl);
        curl.curl_method.curl_post('http://service.weibo.com/share/share.php', function (result) {
            console.log('there');
            console.log("sina return result is" + result);
        });
        //获取用户传递的参数
        var name;
        var pwd;
    };
    /*
     * initialize login ui
     */
    this.view = function () {
        lib.session.isLogin(res, req, function (ret) {
            if (ret) {
                userId = ret.userId;
            }
        });
        res.render('login.jade');
    };

    this.logout = function () {
        var sessid = lib.session.getSessionId(res, req);
        lib.session.delSession(sessid);
        res.render('index.jade');
    };
};