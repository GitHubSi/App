/* 
 * 处理注册用户的相关信息
 */
var user_register = require(DATACLASS + "userregister");
var digist = require(INCLUDE + "encode_class/crypto.js");
var mailmessage = require(INCLUDE + "mailmessage.js");
var mail = require(LIB + "email.js");

var UserRegister = new user_register();

module.exports = function () {

    this.init = function (response, request) {
        res = response;
        req = request;
    }

    this.index = function () {
        //获取用户提交的数据信息
        lib.httpParam.POST(req, '', function (value) {
            //对用户密码进行加密处理
            value.password = digist.tcrypto(value.password);
            var username = value.username;
            UserRegister.addUser(value, function (ret) {
                if (ret) {
                    //如果用户注册成功，则设置session，并跳转到homepage页面
                    lib.session.setSession(res, req, username);
                    //发送邮箱验证通知
                    if (!!value.email) {
                        var content = mailmessage.getMsg("0");
                        digist.validcode(function (buf) {
                            content += "<span><a href='http://127.0.0.1:3000/register/validEmail?key=" + buf + "&username=" + value.username + "'>验证邮箱</a></span>";
                            mail.sendMail(value.email, "验证网站邮箱", content);
                        });

                    }
                }
                else {
                    console.log("existed ! change name ");
                }
            });
        });
    }

    this.view = function () {
        res.render('register.jade');
    }

    /*
     * 验证邮箱
     */
    this.validEmail = function () {
        /*
         * 为了简单处理，key参数不进行处理了
         * 需要进行修改的还有httpParam模块
         */
        var value = lib.httpParam.GET(req,"");
        if (value.key) {
            UserRegister.updateValid(value.username, function (ret) {
                if (ret) {
                    lib.log.write("maillog/sendmail.log", [value.username, "发送成功"]);
                }
            });
        }
    };
}


