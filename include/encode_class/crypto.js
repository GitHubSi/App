var crypto = require('crypto');
exports.tcrypto = function (value) {
    var salt = "fuhui";
    /*
     this.encode = function () {
     var algorithm = arguments[0] ? arguments[0] : null;
     var enstring = arguments[1] ? arguments[1] : '';
     var returnType = arguments[2] ? arguments[2] : '';
     var encodeKey = arguments[3] ? arguments[3] : '';
     var sign = crypto.createSign(algorithm);
     sign.update(enstring);
     var res = sign.sign(returnType);
     return res;
     }
     this.decode = function () {
     console.log('it has not decode function');
     }
     */
    var hash = crypto.createHash("md5");
    hash.update(new Buffer(salt + value, "binary"));
    var encode = hash.digest("hex");
    return encode;
}

/**
 * 获取一个随机的10位数
 */
exports.validcode =function(callback){
    crypto.randomBytes(10,function(ex,buf){
        if (ex) throw ex;
        callback(buf);
    });
}