//question：输出内容中存在undefined属性，不知道为什么
exports.name='duang';
exports.showName=function(){
	console.log('my name is exports');
};
module.exports.sex='test for module.exports ignore';
console.log(module.exports);