/**
 * @description 实现的一个插件,支持链式调用
 * @learn 通过这种方式声明的函数，在函数中调用的时候，可以直接使用$(li).dateZoom()的形式，
 *         ：学习使用each方法返回匹配元素的对象
 *         ：学习hover方法，触发两个函数的声明
 *         ：学习animate方法
 */

(function ($) {
    /*
     * 当鼠标停留在元素之上时放大元素文本的插件，在鼠标指针离开文本时字体恢复正常
     * ：fn相当于对象的prototype属性
     */
    $.fn.dateZoom = function (options) {
        var opts = $.extend($.fn.dateZoom.defaults, options);
        //维护链式调用
        return this.each(function () {
            //保存原始的字体大小
            var originsuzes = $(this).css("font-size");
            //第一个函数在鼠标移到元素之上时触发，第二个函数在鼠标离开时触发
            $(this).hover(function(){
                $.fn.dateZoom.zoon(this,opts.fontsize,opts);
            },
            function(){
                $.fn.dateZoom.zoon(this,originsuzes,opts);
            });
        });
    }

    //定义公开访问的默认值
    $.fn.dateZoom.defaults = {
        "fontsize": "110%",
        "easing": "swing",
        "duration": "600",
        "callback": null
    }

    //定义一个函数，让用户能够在插件之外使用
    $.fn.dateZoom.zoom = function (element, size, opts) {
        $(element).animate({
            "font-size": size,
        },
                {
                    "duration": opts.duration,
                    "easing": opts.easing,
                    "complete": opts.callback
                })
                .dequeque() //防止动画跳跃
                .clearQueue();  //保证同一时间只执行一个动画
    }
})(jQuery)