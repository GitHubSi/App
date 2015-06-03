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



网站的主从工作模式（进程管理）
----
    使用 child_process 模块可以灵活的实现进程的创建。通过主进程和子进程之间传递句柄，来实现端口共用。灵活的进程间事件的传递机制，使得实现主从服务简单高效。网站的
    入口文件是 nginx.js ,该文件创建子进程，实现某种意义上的nginx服务器功能，下面简要说明，详细请看nginx和index的源码。

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

            index对 server 的处理：

                process.on('message', function (msg, tcp) {
                    if (msg === 'server') {
                        worker = tcp;
                        tcp.on('connection', function (socket) {
                            server.emit('connection', socket);
                        });
                    }
                });

    