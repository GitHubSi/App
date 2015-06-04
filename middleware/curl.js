/**
 * curl模块
 */
var querystring = require('querystring');
var request = require('request');

var method = {
    curl_get: function () {
        //获取get方法的参数url,请求参数，callback
        var url = arguments[0];
        var getData = arguments[1];
        var callback = arguments[2];
        if (!callback && typeof getData == 'function') {
            getData = {};
            callback = arguments[1];
        }
        if (!url) {
            //callback('');
            return;
        }
        var params = {};
        //为url后缀添加？或者&符号
        if (getData) {
            if (url.indexOf('?') > -1) {
                url += '&';
            }
            else {
                url += '?';
            }
        }
        //将json格式的数据转换成HTTP的参数字符串，中间用&连接
        url += querystring.stringify(getData);
        //使用数组的方式为json对象赋值
        params['url'] = url;
        params['json'] = true;
        //调用request请求资源, 给get方法传递了一个数组
        request.get(params, function (error, response, result) {
            if (error) {
                console.log(error);
                callback(result);
            }
            else {
                callback(result);
            }
        })
    },
    curl_post: function () {
        var url = arguments[0];
        var postData = arguments[1];
        var callback = arguments[2];
        if (!callback && typeof postData == 'function') {
            postData = {};
            callback = arguments[1];
        }
        if (!url) {
            return false;
        }
        var params = {};
        params['url'] = url;
        params['json'] = true;
        params['form'] = postData;
        request.post(params, function (error, response, result) {
            if (error) {
                console.log(error);
                callback(result);
            }
            else {
                callback(result);
            }
        })
    },
    form_post:function(){
        var url=arguments[0];
        var data=arguments[1];
        var callback = arguments[2];
        if (!callback && typeof postData == 'function') {
            postData = {};
            callback = arguments[1];
        }
        if (!url) {
            return false;
        }
        ///i can not understand the variable request
        var requset = request.post(url);
        var form = request.form();
        for(var key in data){
            form.append(key,data[key]);
        }
    }
}

exports.curl_method = method;
