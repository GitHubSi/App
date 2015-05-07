var DailyWorkModule=require('./dailywork.js');
var DailyWork=new DailyWorkModule();
// console.log(db);
DailyWork.insert({ 
	'content':'mysql的使用',
	'play':'完成mysql的基类'
},function(result){
	console.log(result);
})