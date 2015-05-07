/**
 * @desc module.exports
 *
 */
var email=require(LIB+"email.js");
var DailyworkModule=require(DATACLASS+"mongodb.js");
var DailyWork = new DailyworkModule();

module.exports=function(){
	 
	this.tableName="today";
	this.init=function(response,request){
		res=response;
		req=request;
	};
	var self=this;
	this.write=function(){
		//console.log(this.tableName); 
		//console.log(self.tableName);
		
		// DailyWork.insert(self.tableName,{'name':'fuhui2','tel':'18311289226'},function(ret){
			// console.log(ret);
		// });
		
		// DailyWork.modify(self.tableName,{'name':'fuhui'},{$set:{'name':'fuhui2'}},function(ret){
			// console.log(ret);
		// });
		// DailyWork.remove(self.tableName,{'name':'fuhui'},function(ret){
			// console.log(ret);
		// });
		// DailyWork.findOneByID(self.tableName,{'name':'fuhui2'},function(ret){
			// console.log(ret);
		// });
                email.sendMail("18311289226@163.com","任何事情都不会那么简单","要坚持和努力的还有很多，还会有很长的一段时间是这种状态，做好打持久战的准备");
		console.log("is can fetch:"+this.tableName);
		console.log("this table name");
		
		// console.log(123);
	};
	this.view=function(){
		DailyWork.select({'and':[],'or':[]},"","","",function(result){
			res.render('dailywite.jade',{'result':result});
		});
	};
 }