# App
Website write by node.js
简介：程序一直在修改，主要用于学习了解node语言。程序暂时实现的功能包括用户的注册，登录，写每日工作计划以及浏览之前的计划内容。数据库采用mongodb存储，第
三方缓存采用了redis。知识内容尽力涵盖node的大部分内容，包括async的异步并发控制，node的多进程架构，Buffere等等等等。

网站的目录结构
-----
    ----nginx   入口文件  通过主进程根据服务器cpu个数创建多个工作进程提供服务
    ----router  路由文件  
    ----conf    网站的配置文件
    ----middleware  网站的中间件  比如封装的专门处理http请求的模块


网站简单的路由规则
-----
路由文件名：router.js, 路由使用自然映射规则。通过MIME将请求分为两个分支进行处理，静态请求和动态请求。处理静态请求的模块名：include/staticManage.js。
动态请求路由规则形如：/module/action?param的方式，分别是模块名称，模块中方法名。任意一个不存在，默认使用：index/index。

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
使用jade模块，程序封装jade转换为res的一个函数。从view中可以了解到jade模板的书写规则，逻辑语句和流程控制语句等。

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

网站的数据存储mongodb
-----
使用mongodb模块，基类文件：include/data/mongodb。学习了解mongodb的CRUD语句的写法，细节。比如更新属性的指定upsert或者multi, find命令中cursor的操作及其他的查询操作符等等。

                    var server = new mongodb.Server(client.host, client.port);
                    mdb = new mongodb.Db(client.dbNmae, server, {safe: true});
                    mdb.open(function (err, dbObject) {
                        if(err)
                            setTimeout(connection, 2000);
                    });

网站缓存存储Redis
----
使用redis模块，封装的模块：include/data/redis。学习使用HASH结构存储，设置key过期时间，来存储网站的SESSION。在以后会搭建redis集群。
如下是设置SESSION的底层函数

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

网站HTTP协议中Get/Post/Cookie处理
----
封装模块：middleware/httpParam。

1. cookie处理
学习了解cookie中的主要参数及如何获取，设置cookie。设置cookie的封装方法：serialize，包括指定Max-Age，Domain，httpOnly等。

            if (typeof req.headers.cookie !== 'undefined') {   //判断是否存在cookie
                req.headers.cookie.split(';').forEach(function (cookie) {
                    var part = cookie.split('=');
                    cookies[part[0].trim()] = (part[1] || '').trim();
                });
            } 

2. get处理

                exports.GET = function (req) {
                    var key = arguments[1];
                    var param = url.parse(req.url).query;
                    var json_param = querystring.parse(param);
                    if (arguments.length === 1) {
                        return json_param;
                    }
                    if (!!key) {
                        return json_param[key] ? json_param[key] : '';
                    }
                    return json_param;
                };

3. post处理
学习了解Post通过监听data和end事件获取请求的数据

                    req.addListener('end', function () {
                           //拼接buffer
                           var buffer = Buffer.concat(chunks, size);
                           var str = buffer.toString();
                           var param = querystring.parse(str);
                           if (!callback && typeof key === 'function') {
                               callback = key;
                               key = '';
                           }
                           callback(param);
                   });


网站主从工作模式（进程管理）
-----
使用child_process模块。学习了解child_process灵活实现子进程的创建，管理；通过主进程和子进程之间传递句柄，实现端口共用；实现网站服务的主从模式，稳定的多进程架构等等。
网站入口文件： nginx.js ,模块创建子进程，实现nginx分发请求功能。

            var createServer = function () {
                var sub = fork('./index.js');
                //监听进程间的通讯
                sub.on('message', function (msg) {
                    if (msg.act === 'suicide') {
                        createServer();
                    }
                });
                //子进程退出时触发该事件
                sub.on('exit', function () {
                    console.log('sub server ' + sub.pid + ' exited');
                    delete workers[sub.pid];
                });
                sub.send('server', server);
                workers[sub.pid] = sub;
                console.log('create sub server pid :' + sub.pid);
            };







    