/*
 * 网站的入口文件index.js
 * 初始阶段返回的数据类型text/html
 * 通过路由找到要申请的文件
 */
/*
 *version:2,添加了jade模板，注销了接收数据编码
 *version:3,添加了session模块
 *version:4,修改了view的路径,加载了encode_module模块
 *vsesion:5,设置路径全局变量,全局modules引入
 */

//服务器创建模块
var encodeModule = require('./encode_module.js');

//设置路径全局变量
global.BASE_DIR = __dirname;
global.VIEW = BASE_DIR + "/view/";
global.LIB = BASE_DIR + "/middleware/";
global.APP = BASE_DIR + "/component/";
global.STATIC = BASE_DIR + "/resource/";
global.CONF = BASE_DIR + "/conf/";
global.INCLUDE = BASE_DIR + "/include/";
global.DATACLASS = INCLUDE + "data/";
global.LOG = BASE_DIR + "/log/";

/**
 *modules引入
 */
global.lib = {
    http: require('http'),
    fs: require('fs'),
    jade: require('jade'),
    url: require('url'),
    socket: require('socket.io'),
    path: require('path'),
    querystring: require('querystring'),
    util: require('util'),
    router: require(BASE_DIR + '/router'),
    httpParam: require(LIB + 'httpParam'),
    session: require(LIB + 'session'),
    formidable: require('formidable'),
    dgram: require("dgram"),
    redis: require(DATACLASS + 'redis'),
    readConfig: require(INCLUDE + 'configRead'),
    log: require(LIB + 'log')
};
/**
 *引入全局变量，存储socket连接用户信息
 */
global.onlineList = [];

/**
 * @description  引入全局记录当前用户的登录
 */
global.userId = 0;

var server = lib.http.createServer(function (req, res) {
    /**
     * @description 获取当前请求的用户的登录信息
     * @returns {undefined}
     */
    req.usestatus = function () {
        var sessonID = lib.session.getSession();
        if (!!sessonID) {

        }
    };
    /**
     * @description 加载模板文件，默认加载的路径为VIEW
     */
    res.render = function () {
        var template = arguments[0];
        var options = arguments[1];

        template = VIEW + template;
        //同步读取jade模板文件数据
        var str = lib.fs.readFileSync(template, 'utf8');
        //获取jade模板编译处理函数
        var fn = lib.jade.compile(str, {filename: template, pretty: true});
        //调用fn函数，将jade模板转化为html文件数据字符
        var page = fn(options);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(page);
    };
    //global.session=Session.start(res,req);
    //var cs=encodeModule.encode('hash','md5','fuhui','hex');
    //console.log(cs);
    //设置接收数据编码格式为UTF-8
    //req.setEncoding('utf-8');
    //res.writeHead(200,{'Content-Type':'text/html'});
    lib.router.router(res, req);
});
server.listen(3000);
/*
//监听服务器端口
var worker;
process.on('message', function (msg, tcp) {
    if (msg === 'server') {
        worker = tcp;
        tcp.on('connection', function (socket) {
            server.emit('connection', socket);
        });
    }
});

//服务出现异常时，结束进程
process.on('uncaughtException', function (err) {
    console.log(err);
    process.send({act: 'suicide'});

    //服务停止接收新的连接
    worker.close(function () {

        //所有连接退出后，结束进程
        process.exit(1);
    });

    //异常触发时，设置一个超时处理
    setTimeout(function () {
        process.exit(1);
    }, 5000);
});

/**
 *创建socket服务对象
 */
/**
 global.io = lib.socket.listen(server);
 
 var time = 0;
 io.sockets.on('connection', function (socket) {
 var username = sessionLib.username;
 if (!onlineList[username]) {
 onlineList[username] = socket;
 }
 var refresh_online = function () {
 var n = [];
 for (var i in onlineList) {
 n.push(i);
 }
 var message = lib.fs.readFileSync(BASE_DIR + '/live.txt', 'utf8');
 socket.emit('live_data', message);
 io.sockets.emit('online_list', n);	//n是一个数组
 }
 refresh_online();
 if (time > 0) {
 return;
 }
 socket.on('public', function (data) {
 var insertMsg = "<li><span>[fuhui]</span><span>" + data.msg + "</span></li>";
 writeFile({'msg': insertMsg, 'data': data}, function () {
 io.sockets.emit('msg', data);
 });
 });
 socket.on("disconnect", function () {
 delete onlineList[username];
 refresh_online();
 });
 time++;
 })
 
 function writeFile(data, callback) {
 var message = lib.fs.readFileSync(BASE_DIR + '/live.txt', 'utf8');
 lib.fs.writeFile(BASE_DIR + 'live.txt', message + data.msg, function (err) {
 if (err) {
 throw err;
 }
 callback(data.data);
 });
 }
 **/
