var fork = require('child_process').fork;
var os = require('os').cpus();

var server = require('net').createServer();
server.listen(3000);

//创建服务器队列
var workers = [];
var createServer = function () {
    var sub = fork('./index.js');
    //监听进程间的通讯
    sub.on('message', function (msg) {
        if (msg.act === 'suicide') {
            createServer();
        }
    });

    //子进程退出时触发该事件
    sub.on('exit', function () {
        console.log('sub server ' + sub.pid + ' exited');
        delete workers[sub.pid];
    });
//    console.log(server);
    sub.send('server', server);
    workers[sub.pid] = sub;
    console.log('create sub server pid :' + sub.pid);
};

//创建主从结构,根据cpu个数分配
for (var i = 0; i < os.length - 3; i++) {
    createServer();
}

//进程退出时，让所有服务器停止运行
process.on('exit', function () {
    for (var pid in workers) {
        workers[pid].kill();
    }
});

