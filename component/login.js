/**
 * @description 对用户登录的信息进行处理
 * @version:2,修改了使用jade模板
 * @version:3 转化为module.exports方式
 */

var res;
var req;
var UserModule = require(DATACLASS + "usermodule");
var UserModuleRead = new UserModule();

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
        lib.httpParam.POST(req, '', function (value) {
            var username = value.username;
            var password = value.pwd;
            UserModuleRead.checkUser(username, password, function (result) {
                if (result !== false) {
                    lib.session.setSession(res, req, username);
//                    res.render('home.jade', {'username': username});
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
        //Q.这个方法没有调用全局变量
        //Q.如何调用这个模块其他的方法
        // getvalue.POST(req,'name',function(value){
        // name=value;
        // console.log(value);
        // });
        // getvalue.POST(req,'pwd',function(value){
        // pwd=value;
        // console.log(value);
        // });
        // console.log(name+':'+pwd);
    }
    /*
     * initialize login ui
     */
    this.view = function () {
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