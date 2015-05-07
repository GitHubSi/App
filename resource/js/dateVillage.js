/**
 * 日期验证
 * 使用下面的这种方式，其实没有什么实质性的用途，主要是调用的方式更加符合JQuery的要求
 * 需要学习的是对象的扩展方法以及jQuery避免冲突的方式
 */
//使用下面的方式，调用JQuery来避免冲突
(function ($) {   //这里的$可以是任何合法的变量名
    //使用挂接的方式，声明函数,同时允许配置选项
    $.validDate = function (date, options) {
        //正则表达式的默认值
        var defaults = {
            "pattern" : /^\d{4}-\d{2}-d{2} \d{2}:\d{2}:\d{2}/
        };
        //扩展用户的默认选项
        var opts = $.extend(defaults,options);
        return date.match(opts.pattern) != null;
    }
})(iQuery);


