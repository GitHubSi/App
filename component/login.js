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
        lib.httpParam.POST(req, function (value) {
            value.password = digist.tcrypto(value.password);
            UserModuleRead.checkUser(value, function (result) {
                if (result !== false) {
                    lib.session.setSession(res, req, result._id, function (session){
                        res.setHeader('Set-Cookie', 'SESSID=' + session.SESSID);
                        res.render('index.jade', {'username': result.username});
                    });
                }
                else{
                    res.render('login.jade', {'error': "用户名或者密码错误"});
                }
            });
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
    }
    /*
     * initialize login ui
     */
    this.view = function () {
        lib.session.isLogin(res, req,function(ret){
            if(ret){
                userId=ret.userId;
            }
        });
        res.render('login.jade');
    };

    this.register = function () {
        var param = lib.httpParam.POST(req, '', function (value) {
            //向文件中写数据
            var file = lib.fs.readFileSync(CONF + "passwd.txt", 'utf8');
            lib.fs.writeFile(CONF + "passwd.txt", value.username + " " + value.pwd, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }

            })
            //跳转到home.jade页面
            res.render('home.jade', {'username': value.username});
        })
    }
}