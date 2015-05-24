/**
 * version1: 该对象仅仅验证了是read方法
 */

var res;
var req;

exports.init = function (response, request) {
    res = response;
    req = request;
};

exports.del = function () {
    var file = lib.httpParam.GET(req, 'file');
    lib.fs.exists(BASE_DIR + '/' + file, function (existBool) {
        if (existBool) {
            var ret = '';
            lib.fs.unlink(BASE_DIR + '/' + file, function (err) {
                if (err) {
                    ret = err;
                }
                else {
                    ret = "delete file success !";
                }
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(ret);
            });
        }
        else {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('not exist file');
        }
    });
};

exports.read = function () {
    var folder = lib.httpParam.GET(req, 'folder');
    console.log('there');
    lib.fs.exists(BASE_DIR + '/' + folder, function (existBool) {
        if (existBool) {
            var ret = '';
            lib.fs.readdir(BASE_DIR + '/' + folder, function (err, files) {
                if (err) {
                    ret = err;
                }
                else {
                    ret = JSON.stringify(files);
                }
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(ret);
            });
        }
        else {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('404 not found');
        }
    });
};