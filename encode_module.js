var util=require('util');
var Adapter=require('./include/class/adapter');

exports.encode=function(){
		var encodeModule=arguments[0]?arguments[0]:null;
		var algorithm=arguments[1]?arguments[1]:null;	
		var enstring=arguments[2]?arguments[2]:'';
		var returnType=arguments[3]?arguments[3]:'';	
		var decodeKey=arguments[4]?arguments[4]:'';
		var encodeType=arguments[5]?arguments[5]:'';	//加密时使用的加密编码
		
		var AdapterClass=new Adapter();
		return AdapterClass.encode(encodeModule,algorithm,enstring,returnType,decodeKey,encodeType);
	}
exports.decode=function(){
		var encodeModule=arguments[0]?arguments[0]:null;
		var algorithm=arguments[1]?arguments[1]:null;
		var enstring=arguments[2]?arguments[2]:'';
		var returnType=arguments[3]?arguments[3]:'';
		var decodeKey=arguments[4]?arguments[4]:'';
		var encodeType=arguments[5]?arguments[5]:'';
		
		var AdapterClass=new Adapter();
		return AdapterClass.decode(encodeModule,algorithm,enstring,returnType,decodeKey,encodeType);
	}