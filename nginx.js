var fork = require('child_process').fork;
var sub1 = fork('./index.js');
var sub2 = fork('./index.js');

var server = require('net').createServer();
server.listen(3000, function () {
    sub1.send('server', server);
    sub2.send('server', server);
    server.close();
});
