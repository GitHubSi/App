/**
 * @desc module.exports 返回
 *
 */
var DailyworkModule = require(DATACLASS + "dailyWork");
var DailyWork = new DailyworkModule();

module.exports = function () {
    this.init = function (response, request) {
        res = response;
        req = request;
    };

    this.write = function () {
        lib.httpParam.POST(req, function (value) {
            // return false;
            var plan = {
                title: value.title,
                content: value.content,
                time: new Date().getTime()
            };
            DailyWork.insert(plan, {safe: true}, function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.render("todayplan.jade", {'result': plan});
            });
        });
    };
    
    this.completeState = function(){
         lib.httpParam.POST(req, function (value) {
             var extra = {
                sleeptime: value.sleeptime,
                completeState: value.completeState
            };
            var where = {
                _id : null
            };
         });
    };
    
    this.view = function () {
        var where = {
            time: {
                $gt: new Date().setHours(0, 0, 0),
                $lt: new Date().setHours(23, 59, 59)
            }
        };
        DailyWork.select(where, null, null, {}, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            if(result){
                res.render('todayplan.jade', {'result': result[0]});
            }
            else{
                res.render('todayplan.jade', {'result': 0});
            }
        });
    };
};