/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var TASK_ARR = [];
/**
 * crontab.js
 */
module.exports = {
    /**
     * timing task
     */
    time_task: function () {
        var time = arguments[0];
        var task = arguments[1];
        var splitArr = time.split(":");
        var hour = splitArr[0];
        var minute = splitArr[1];
        var sec = splitArr[2] ? splitArr[2] : "00";
        var taskObj = {
            "hour": parseInt(hour),
            "minute": parseInt(minute),
            "sec": parseInt(sec),
            "task": task
        };
        TASK_ARR[TASK_ARR.length].taskObj;
    },
    /*
     * interval timing task
     */
    circle_task: function () {
        var sec = arguments[0];
        var task = arguments[1];
        if (!sec || !task) {
            callback(-1);
        }
        // task is function
        if (typeof task == "function") {
            setTnterval(function () {
                task.call();
            }, sec);
        }
        //task is string type
        if (typeof task == "string") {
            setInterval(function () {
                var spawn = require("child_process").spawn;
                var shell = spawn(task);
                shell.stdout.on("data", function (data) {
                    console.log("stdout:" + data);
                })
            }, sec)
        }
    }
}
setInterval(function () {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    for (var i = 0; i < TASK_ARR.length; i++) {
        var timeTask = TASK_ARR[i];
        if (timeTask["hour"] == hour && timeTask["minute"] == minute && timeTask["sec"] == second) {
            if (typeof timeTask["task"] == "function") {
                timeTask["task"].call();
            }
            else {
                if (typeof timeTask["task"] == "string") {
                    var spawn = require("child_process").spawn;
                    var shell = spawn(timeTask["task"]);
                    shell.stdout.setEncoding("utf8");
                    shell.stdout.on("data", function (data) {
                        console.log("stdout:" + data);
                    });
                }
            }
        }
    }
}, 1000);
