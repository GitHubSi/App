/**
 * 返回发送邮件的内容
 * 通过邮件码确定发送邮件的类型
 */

var MAIL_CODE = {
    "REGISTER": "0"
};

var MAIL_MSG = {
    "0": "您好，欢迎你注册这么牛X的网站，请点击以下网址完成注册："
};

function getMsg(code) {
    return MAIL_MSG[code];
}

exports.getMsg = getMsg;


