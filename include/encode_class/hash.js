var crypto=require('crypto');
module.exports=function(){
	this.encode=function(){
		var algorithm=arguments[0]?arguments[0]:null;	
		var enstring=arguments[1]?arguments[1]:'';
		var returnType=arguments[2]?arguments[2]:'';
		var hash=crypto.createHash(algorithm);
		hash.update(enstring);
		var res=hash.digest(returnType);
		return res;
	}
}

