/**
 * @desc module.exports 返回
 *
 */

var DailyworkModule=require(DATACLASS+"dailyWork");
var DailyWork=new DailyworkModule();

 module.exports=function(){
	this.init=function(response,request){
		res=response;
		req=request;
	}
	this.write=function(){
		lib.httpParam.POST(req,"",function(value){
			// console.log(value);
			// return false;
			DailyWork.insert(value,function(result){
				console.log("插入成功");
			});
		})
	}
	this.view=function(){
		DailyWork.select({'and':[],'or':[]},"","","",function(result){
			res.render('dailywite.jade',{'result':result});
		});
	}
 }