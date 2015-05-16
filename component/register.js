/* 
 * 处理注册用户的相关信息
 */
var user_register = require(DATACLASS + "usermodule");
var digist = require(INCLUDE + "encode_class/crypto.js");
var mailmessage = require(INCLUDE + "mailmessage.js");
var mail = require(LIB + "email.js");

var UserRegister = new user_register();
var res, req,userId;
module.exports = function () {

    this.init = function (response, request) {
        res = response;
        req = request;
    };

    this.index = function () {
        //获取用户提交的数据信息
        lib.httpParam.POST(req, function (value) {
            //判断用户名是否存在
            if (!value.username || !value.password || !value.email) {
                return;
            }
            //对用户密码进行加密处理
            value.password = digist.tcrypto(value.password);
            UserRegister.addUser(value, function (ret) {
                if (ret === false) {
                    res.render("register.jade", {error: '用户名已经存在'});
                    return;
                }
                if (ret) {
                    UserRegister.findOneByID({'username': value.username}, function (doc) {
                        var userId = doc._id;
                        lib.session.setSession(res, req, userId, function (session) {
                            res.setHeader('Set-Cookie', 'SESSID=' + session.SESSID);
                            res.render('index.jade', {'username': doc.username});
                            //发送邮箱验证通知
                            if (!!value.email) {
                                var content = mailmessage.getMsg("0");
                                digist.validcode(function (buf) {
                                    content += "<span><a href='http://127.0.0.1:3000/register/validEmail?key=" + buf + "&username=" + value.username + "'>验证邮箱</a></span>";
                                    mail.sendMail(value.email, "验证网站邮箱", content);
                                });
                            }
                        });
                    });
                }
            });
        });
    };

    this.view = function () {
        lib.session.isLogin(res, req,function(ret){
            if(ret){
                userId=ret.userId;
            }
        });
        res.render('register.jade');
    };

    /*
     * 验证邮箱
     */
    this.validEmail = function () {
        /*
         * 为了简单处理，key参数不进行处理了
         * 需要进行修改的还有httpParam模块
         */
        var value = lib.httpParam.GET(req, "");
        if (value.key) {
            UserRegister.updateValid(value.username, function (ret) {
                if (ret) {
                    lib.log.write("maillog/sendmail.log", [value.username, "发送成功"]);
                }
            });
        }
    };
};


