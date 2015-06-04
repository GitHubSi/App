/**
 * 用到了url, querystring模块
 * version1: 修改了post请求返回全部数据
 *          change the arguments
 */
var querystring = require('querystring');
var url = require('url');

/*
 * 
 * @param {type} {req,key} | {req}
 * @returns {exports.GET.json_param|String}
 */
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

/*
 * 
 * @param {type} {req,callback} | {req,key,callback}
 * @returns {undefined}
 */
exports.POST = function (req) {
    var chunks = [];
    var size = 0;
    var key = arguments[1];
    var callback = arguments[2];
    req.addListener('data', function (chunk) {
        chunks.push(chunk);
        size += chunk.length;
        //postData += decodeURI(postDataChunk);
    });
    req.addListener('end', function () {
        
        //通过拼接buffer
        var buffer = Buffer.concat(chunks, size);
        //var str = iconv.decode(buffer, 'utf8');
        var str = buffer.toString();
        var param = querystring.parse(str);
        if (!callback && typeof key === 'function') {
            callback = key;
            key = '';
        }
        if (key !== '') {
            var value = param[key] ? param[key] : '';
            callback(value);
            return;
        }
        callback(param);
    });
};
/*
 * 
 * @param {type} {req} | {req, key}
 * @returns {Boolean|exports.cookie.httpParam_L60.part|exports.cookie.cookies|String}
 */
exports.COOKIE = function (req) {
    var cookies = {};
    var key = arguments[1];
    if (typeof req.headers.cookie !== 'undefined') {   //判断是否存在cookie
        req.headers.cookie.split(';').forEach(function (cookie) {
            var part = cookie.split('=');
            cookies[part[0].trim()] = (part[1] || '').trim();
        });
    } else {
        return false;
    }
    if (!!key) {
        return cookies[key] ? cookies[key] : '';
    }
    return cookies;
};

/*
 * 
 * @param {type} name   cookie名称
 * @param {type} val    cookie值
 * @param {type} opt    cookie选项{maxAge,domain,path,expires,httpOnly,secure}
 * @returns {String}
 * @example:   res.setHeader('Set-Cookie',serialize('isVisit',1));
 *              res.setHeader('Set-Cookie',[serialize('isVisit',1),serialize('baz',1)]))
 */
exports.serialize = function (name, val, opt) {
    var pairs = [name + '=' + val];
    opt = opt || {};
    if (opt.maxAge)
        pairs.push('Max-Age=' + opt.maxAge);
    if (opt.domain)
        pairs.push('Domain=' + opt.domain);
    if (opt.path)
        pairs.push('Path=' + opt.path);
    if (opt.expires)
        pairs.push('Expires=' + opt.expires.toUTCString());
    if (opt.httpOnly)
        pairs.push('httpOnly');
    if (opt.secure) {
        pairs.push('Secure');
    }
    return pairs.join('; ');
};
/*
 * Q：req 以为可以不进行赋值，只需要引用到某个页面，然后使用全局变量req，但是报错了。之前的写法是function(key)
 * 返回的只是一个方法，方法内部变量为局部变量。需要通过值传递来进行。
 */
