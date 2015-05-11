/**
 * @description redis操作的基类
 * @version 测试功能实现版; hash
 */
var redis = require("redis");
var configRead = require(INCLUDE + 'configRead.js');

/*
 * hash algorithm need to be added
 */
var redisConfig = configRead.get('dbconfig.json', 'redis');
var client = redis.createClient(redisConfig["port"], redisConfig["host"]);

client.on("connect", function () {
    setInterval(client.ping(), 1000 * 60 * 30);
});
client.on("error", function (err) {
    console.log(err);
});

/**
 * @description 存储一个键值对
 */
exports.set = function (key, value) {
    client.set(key, value);
}

/**
 * @description 存储hash结构的数据，同时设置数据的过期时间
 * @param {string} 键的名称
 * @param {json} 对应的值
 * @returns {undefined}
 */
exports.hmset = function (key, json) {
    var expires = arguments[2];
    try {
        client.hmset(key, json);
        if (expires) {
            client.expire(key, expires);
        }
        else {
            client.expire(key, 60 * 30);
        }
    }
    catch (err) {
        console.log("redis error:" + err);
    }
}

/**
 * 删除redis中的键值
 */
exports.del = function (key) {
    client.del(key, function (err, reply) {
        if (err) {
            //暂时不处理
        }
    })
}

/**以下的读取内容之后会单独跟设置内容的文件分开，主库用来操作数据，从库专门用于数据读取**/

/**
 * @description 读取hash中指定的键值的内容
 * @param {type} key
 * @returns {undefined}
 */
exports.hgetall = function (key, callback) {
    client.hgetall(key, function (err, value) {
        if (!err) {
            callback(value);
        }
        else {
            callback(false);
        }
    });
}

/**
 * @description 判断key是否存在
 * if key existed, update the key's expire again
 */
exports.exist = function (key, callback) {
    client.exists(key, function (err, reply) {
        if (reply === 1) {
            client.expire(key, 60 * 30);
            callback(true);
        }
        callback(false);
    });
}