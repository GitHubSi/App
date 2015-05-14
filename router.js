/**
 *version1: 使用decodeURI解析url中的特殊字符和中文
 *version2: 修改路由规则，现在修改的规则为/module/action?param,判断若存在module/action则为请求非资源文件
 *	    静态资源文件添加了jade处理； 区分资源文件请求和数据请求是通过文件路径是否带有后缀来是实现的。
 *version3: 修改exports返回的对象成为返回module.exports.2015-03-26 
 *			请求的资源都修改成返回类的形式
 */
/*
 * 网站的路由模块
 * 默认请求的路径只有一个，类似于Server_path,用于module模块
 * 请求的参数中第一个为请求的方法
 */
//路由模块
var ParseDns = require('./parse_dns.js');
var MainIndex = require('./main_index.js');
var staticManage = require('./include/staticManage');

//定义全局常量变量,避免暴露路径
var STYLE = BASE_DIR + '/resource/style/';
var IMAGE = BASE_DIR + '/resource/image/'
var JS = BASE_DIR + '/resource/js/';
var S_VIEW = BASE_DIR + '/view/';

exports.router = function (res, req) {
    //get the path of request
    var pathname = decodeURI(lib.url.parse(req.url).pathname);
    var requirepath = pathname.slice(1);

    if (pathname == '/favicon.ico') {
        return false;
    }
    else if (pathname == '/') {
        //res.render('index.jade');
        res.writeHead(302, {'Location': '/index'});
        res.end();
        return;
    }
    //get the suffix of path
    var extname = lib.path.extname(pathname);
    extname = extname ? extname.slice(1) : '';
    //logical processing
    if (!extname) {
        var pathArr = requirepath.split('/');
        var module = pathArr.shift();
        var controller = pathArr.shift();
        try {
            var className = require(APP + module);
            var classObj = new className();
        }
        catch (err) {
            console.log('chdir:' + err);
            return false;
        }
        if (classObj) {
            classObj.init(res, req);
            if (classObj[controller]) {
                classObj[controller].call(classObj);
            } else {
                classObj['view'].call(classObj);
            }
        }
        else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end("can not find source");
            return false;
        }
    }
    //resource request
    else {
        var realPath = '';
        switch (extname) {
            case 'css':
                realPath = STYLE;
                break;
            case 'js':
                realPath = JS;
                break;
            case 'jade':
                realPath = VIEW;
                break;
            default:
                realPath = IMAGE;
        }
        var part = requirepath.split('/');
        realPath += part.pop();
        //deal with the static resource
        staticManage.staticManage(requirepath, realPath, res, req);
    }
    return true;
}