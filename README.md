# App
Website write by node.js
简介：程序一直在修改，这里截取的都是核心代码，供说明了解，详细请下载代码。代码主要用于学习了解node语言。
                
网站简单的路由规则
-----
路由文件router.js,路由使用的是自然映射规则。通过MIME对静态文件和逻辑请求进去不同的处理，处理静态文件的请求主要是include/staticManage.js进行处理。静态文件中设置了过期缓存。
路由规则使用的是/module/action?param的方式，第一个分割的是模块名称，第二个是方法名，默认情况下是index/index

                var className = require(APP + module);
                var classObj = new className();
                if (classObj) {
                    classObj.init(res, req);
                    if (classObj[controller]) {
                        classObj[controller].call(classObj);
                    } else {
                        classObj['view'].call(classObj);
                    }
                }

网站的MVC中VIEW
-----
使用的jade模块，方法挂接到了res上，在根目录下的index.js中

                    res.render = function () {
                        var template = arguments[0];
                        var options = arguments[1];
                        template = VIEW + template;
                        var str = lib.fs.readFileSync(template, 'utf8');
                        var fn = lib.jade.compile(str, {filename: template, pretty: true});
                        var page = fn(options);
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(page);
                    };

网站使用的数据库mongodb
----
使用的是mongodb数据库，数据库的基类文件是include/dataClass/mongodb模块，其他的模块都继承它，比如usermodule

                if (!mdbConn) {
                    var server = new mongodb.Server(client.host, client.port);
                    mdb = new mongodb.Db(client.dbNmae, server, {safe: true});
                    mdb.open(function (err, dbObject) {
                        if(err)
                            setTimeout(connection, 2000);
                    });
                }
                else {
                    callback(mdbConn);
                }

网站使用的第三方缓存Redis
----
使用Redis作为缓存，缓存文件是include/dataClass/redis模块，暂时没有搭建redis集群，所以没有缓存负载均衡一说，这方面并不难，包括各个模块介绍，在今后的过程中都会逐步完善。
下面介绍设置过期限制，对于网站的Session

                exports.hmset = function (key, json) {
                    var expires = arguments[2];
                    try {
                        client.hmset(key, json);
                        if (expires) {
                            client.expire(key, expires);
                        }
                        else {
                            client.expire(key, 60 * 30);
                        }
                    }
                }

网站的http参数处理，包括get请求，post请求，cookie
----
