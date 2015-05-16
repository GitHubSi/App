/**
 * 返回发送邮件的内容
 * 通过邮件码确定发送邮件的类型
 */

var MAIL_CODE = {
    "0": "REGISTER"
};

var MAIL_MSG = {
    "0": "您好，欢迎你注册这么牛X的网站，请点击以下网址完成注册："
};

//return mail's type and msg
function getMsg(code) {
    var codeType = MAIL_CODE[code];
    var codeMsg = MAIL_MSG[code];
    return " [ " + codeType + " : " + codeMsg + " ] ";
}

exports.getMsg = getMsg;


