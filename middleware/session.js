/**
 * 
 * @type @exp;session
 * @description 用户登录之后，设置用户的session
 */
var httpParam = require('./httpParam.js');
var sessions = {};
/**
 * @description 获取用户header.cookie头中的session信息
 * @param {type} res
 * @param {type} req
 * @returns {boolean} 失败返回false，成功返回当前的cookie中的SessionID
 */
var getCookieSession = function (res, req) {
    var cookie = httpParam.COOKIE(req, 'SESSID');
    if (cookie) {
        var SessionID = cookie;
        return SessionID;
    }
    return false;
};
exports.getSessionId = getCookieSession;

/*
 * 
 * @param {type} sessionId "fetch a session from redis"
 * @returns {false | session}
 */
var getSession = function (sessionId, callback) {
    lib.redis.exist(sessionId, function (err, ret) {
        if (err) {
            callback(err);
            return;
        }
        if (ret === 1) {
            lib.redis.hgetall(sessionId, function (session) {
                callback(null, session);
            });
        }
    });
};

/**
 * @description 获取当前session的状态信息,记录获取登录到网站的用户id
 * @param {type} res
 * @param {type} req
 * @returns {newSession.session|sessions|session}
 */
exports.sessionStatus = function (res, req) {
    var sessionID = getCookieSession(res, req);
    lib.redis.exist(sessionID, function (existflg) {
        if (existflg) {
            var sessionJson = lib.redis.hgetall(sessionID);
            if (sessionJson.expires < Date()) {
                lib.redis.del(sessionID);
                global.userId = 0;
            }
            else {
                var dt = new Date();
                dt.setMinutes(dt.getMinutes + 30);
                sessionJson.expires = dt;
                lib.redis.hset(sesionID, sessionJson);
                global.userId = sessionJson.userId
            }
        }
    });
}
/**
 * @description 当用户登录 or register 时，设置用户的session信息
 * @param {type} res
 * @param {type} req
 * @returns {newSession.session|sessions|session}
 */
exports.setSession = function (res, req, userid, callback) {
    newSession(res, userid, function (session) {
        saveSession(session, function (session) {
            callback(session);
        });
    });
};

/**
 * @description 为用户创建一个session
 * @param {objetc} res
 * @param {string} id session在服务器端的标志
 * @returns {json} 
 */
function newSession(res, userId, callback) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz";
    var SESSID = '';
    for (var i = 0; i < 40; i++) {
        var num = Math.floor(Math.random() * chars.length); //获取0-39之间的一个数
        SESSID += chars.substring(num, num + 1);
    }
    lib.redis.exist(SESSID, function (existflg) {
        if (existflg) {
            SESSID = new newSession(res, userId);
        }
        var dt = new Date();
        dt.setMinutes(dt.getMinutes() + 30);
        var session = {
            SESSID: SESSID,
            expires: dt,
            userId: userId
        };
        callback(session);
    });
}
;

exports.delSession = function (sessionId) {
    lib.redis.exist(sessionId, function (ret) {
        if (ret) {
            lib.redis.del(sessionId);
        }
    });
}
/**
 * save the session to redis
 * @param {sessions} newSession创建的对象
 * @param {type} 服务器标志用户的id
 * @returns {undefined}
 */
function saveSession(session, callback) {
    lib.redis.hmset(session.SESSID, {
        "expires": session.expires,
        "userId": session.userId
    });
    callback(session);
}
;
/*
 * if user has logined
 */
exports.isLogin = function (res, req, callback) {
    //if SESSID in cookie existed
    var sessionId = getCookieSession(res, req);
    if (sessionId === false) {
        callback(false);
        return;
    }
    getSession(sessionId, function (err, session) {
        if (err) {
            callback(true);
        }
        callback(null, session);
    });
};