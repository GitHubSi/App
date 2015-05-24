/*
 * promise/deferred模式测试用例
 */
var events = require('events');
var util = require('util');
var http = require('http');

var Promise = function(){
    events.EventEmitter.call(this);
//    util.inherits(this,events.EventEmitter);
};
util.inherits(Promise,events.EventEmitter);
Promise.prototype.then = function(fulfilledHandler,errorHandler,progressHandler){
    if(typeof fulfilledHandler === 'function'){
        this.once("sucess",fulfilledHandler);
    }
    if(typeof errorHandler === 'function'){
        this.once("error",errorHandler);
    }
    if(typeof progressHandler === 'function'){
        this.once("progress",progressHandler);
    }
};
var Deferred = function(){
    this.promise = new Promise();
    this.state = 'unfulfilled';
};
Deferred.prototype.resolve = function(obj){
    this.state = 'fulfilled';
    this.promise.emit("success",obj);
};
Deferred.prototype.reject = function(error){
    this.state = 'failed';
    this.promise.emit("error",error);
};
Deferred.prototype.progress = function(data){
    this.promise.emit("progress",data);
};
//测试用例
var promisify = function(req){
  var deferred = new Deferred();
  var result = '';
  req.on('data',function(chunk){
      result += chunk;
      deferred.progress(chunk);
  });
  req.on('end',function(){
      deferred.resolve(result);
  });
  req.on('error',function(err){
     deferred.reject(err) ;
  });
  return deferred.promise;
};

//创建服务进行验证
var server = http.createServer(function(req, res){
    promisify(req).then(
        function(){
            console.log("success");
        },
        function(err){
            console.log("error information : "+ err);
        },
        function(chunk){
            console.log("chunk data : "+chunk);
        });
}).listen(1000,"127.0.0.1");