/**
 * 
 * @description 日志的记录文件
 * @type Date
 */

//获取操作的时间
var date = new Date();
var time = [];
time.push(date.getFullYear());
time.push(date.getMonth() + 1);
time.push(date.getDate());
var logtime = time.join("/");
var times = [];
times.push(date.getHours());
times.push(date.getMinutes());
times.push(date.getSeconds());
var format_time = time.join("/") + " " + times.join(":");

//日志记录
exports.write = function (file, infor) {
    var file_path = LOG + file;
    lib.fs.open(file_path, "a", function (err, fd) {
        if (err){
            console.log(err);
            return ;
        }
//        if (typeof infor != 'array')
//            throw new Error("type failed");
        var data = format_time + " , " + infor.join(" , ") + "\r\n";
        lib.fs.writeSync(fd, data, function (err, writen, str) {
        });
        lib.fs.closeSync(fd);
    });
}

