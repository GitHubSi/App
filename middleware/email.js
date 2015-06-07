/**
 * 
 * @type modules
 * @description 邮件发送
 * @version 2015-04-11
 */
var config = require(INCLUDE + "configRead.js");
var nodeMailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

var emailConf = config.get("email.json", "qq");

var mail = nodeMailer.createTransport(smtpTransport({
    host: emailConf["host"],//"smtp.qq.com"
    port: emailConf["post"],
    secure: true,
    auth: {
        "user": emailConf["user"],
        "pass": emailConf["pass"]
    }
}));

/**
 * 
 * @param {type} emailAddress
 * @param {type} title
 * @param {type} content
 * @returns {undefined}
 */
exports.sendMail = function (emailAddress, title, content) {
    mail.sendMail({
        from: emailConf["user"],
        to: emailAddress,
        subject: title,
        html: content
    }, function (error, success) {
        if (!error) {
            //日志记录
            console.log('message success');
        } else {
            lib.log.write("maillog/sendmail.log",[error]);
            console.log('failed' + error);
        }
    });
};

