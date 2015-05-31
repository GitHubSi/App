# App
Website write by node.js
                
#2015-05-31
使用async模块中waterfall方法简化login.js中的login方法，因为方法体比较常，嵌套看起来复杂，方法体如下：
        
        this.login = function () {
                lib.session.isLogin(res, req, function (ret) {
                    if (ret) {
                        //has logined 
                        userId = ret.userId;
                        if (userId) {
                            res.render('login.jade', {'error': "用户已经登录，请退出后重新登录"});
                            return false;
                        }
                    }
                    else {
                        //login
                        lib.httpParam.POST(req, function (value) {
                            value.password = digist.tcrypto(value.password);
                            UserModuleRead.checkUser(value, function (result) {
                                if (result !== false) {
                                    lib.session.setSession(res, req, result._id, function (session) {
                                        res.setHeader('Set-Cookie', 'SESSID=' + session.SESSID + ";path = /");
                                        res.render('index.jade', {'username': result.username});
                                    });
                                }
                                else {
                                    res.render('login.jade', {'error': "用户名或者密码错误"});
                                }
                            });
                        });
                    }
                });
            };
下面是修改后的代码，因为用于测试waterfall方法使用，修改的有些牵强。而且方法体中回调函数第一个参数可能不是err参数，主要是没有及时完全修改，看得时候请注意。

waterfall方法适用范围：调用前一个异步的结果是后一个异步调用的输入。方法体参数中的回调函数，为数组最后定义的函数。参数严格遵守规范，第一个为异常，第二个为传递的参数。
后续的匿名方法参数中第一个参数为异步见传递的参数，第二个为定义的回调

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
                                    res.setHeader('Set-Cookie', 'SESSID=' + session.SESSID + ";path = /");
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


在httpParam模块中添加cookie构造的方法
        exports.serialize = function (name, val, opt) {
            var pairs = [name + '=' + encode(val)];
            opt = opt || {};
            if(opt.maxAge)
                pairs.push('Max-Age='+opt.maxAge);
            if(opt.domain)
                pairs.push('Domain='+opt.domain);
            if(opt.path)
                pairs.push('Path='+opt.path);
            if(opt.expires)
                pairs.push('Expires='+opt.expires.toUTCString());
            if(opt.httpOnly)
                pairs.push('httpOnly');
            if(opt.secure){
                pairs.push('Secure');
            }
            return pairs.join('; ');
        };           

