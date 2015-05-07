/*
 * 
 *顶层文件夹resource
 *静态的网页 创建一个view的文件夹
 *静态的CSS 创建一个style的文件夹
 *静态的图片 创建一个image的文件夹
 */
/** 
 * @description deal with static resource
 * version:2 添加了资源文件的缓存机制
 * version3: 添加了jade处理
 */
var fs = require('fs');
var CACHE_TIME = 24 * 60 * 60 * 1000;

exports.staticManage = function (resourceName, filePath, res, req) {
    fs.exists(filePath, function (exists) {
        if (!exists) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('this resource ' + resourceName + "was not found on this server");
            res.end();
        }
        else {
            //get the last modified time of file
            var fileInfo = lib.fs.statSync(filePath);
            var lastModified = fileInfo.mtime.toUTCString();
            var pointPosition = resourceName.lastIndexOf('.');
            var mmieString = resourceName.substring(pointPosition + 1);
            var mimeType = lib.readConfig.get("mimeType.json","mime");
            //设置缓存
            if (mimeType[mmieString]) {
                var date = new Date();
                //can't set headers after they are sent
                date.setTime(date.getTime() + CACHE_TIME);
                res.setHeader('Expires', date.toUTCString());
                res.setHeader('Cache-Control', 'max-age=' + CACHE_TIME);
            }
            if (req.headers['if-modified-since'] && lastModified == req.headers['if-modified-since']) {
                res.writeHead(304, "Not Modified");
                res.end();
            }
            else {
                /**
                 *这里添加了jade处理
                 */
                if (mmieString == 'jade') {
                    res.render(resourceName);
                    return;
                }
                fs.readFile(filePath, 'binary', function (err, file) {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end(err);
                    }
                    else {
                        res.setHeader('Last-Modified', lastModified);
                        res.writeHead(200, {'Content-Type': mimeType});
                        res.write(file, "binary");
                        res.end();
                    }
                });
            }
        }
    })
}