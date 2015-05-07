var util=require('util');
var Target=require('../driver/target');

function Adapter(){
	Target.call(this);
	this.encode=function(){
		var encodeModule=arguments[0]?arguments[0]:null;
		var algorithm=arguments[1]?arguments[1]:null;	
		var enstring=arguments[2]?arguments[2]:'';
		var returnType=arguments[3]?arguments[3]:'';	
		var decodeKey=arguments[4]?arguments[4]:'';
		var encodeType=arguments[5]?arguments[5]:'';	//加密时使用的加密编码
		
		var AdapterClass=require("../encode_class/"+encodeModule);
		var AdapterObj=new AdapterClass();
		return AdapterObj.encode(algorithm,enstring,returnType,decodeKey,encodeType);
	}
	this.decode=function(){
		var encodeModule=arguments[0]?arguments[0]:null;
		var algorithm=arguments[1]?arguments[1]:null;
		var enstring=arguments[2]?arguments[2]:'';
		var returnType=arguments[3]?arguments[3]:'';
		var decodeKey=arguments[4]?arguments[4]:'';
		var encodeType=arguments[5]?arguments[5]:'';
		
		var AdapterClass=require(""+encodeModule);
		var AdapterObj=new AdapterClass();
		return AdapterObj.decode(algorithm,enstring,returnType,decodeKey,encodeType);
	}
}
module.exports=Adapter;