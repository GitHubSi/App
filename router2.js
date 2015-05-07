var param=pathname.substr(2);
var firstParam=pathname.substr(1,1).toUpperCase();
var functionName='res'+firstParam+param;
response=res;
if(pathname=='/'){
	resDefault(res);
}
else if(pathname=='/favicon.ico'){
	return;
}
else{
	eval(functionName+'()');
}
//test the github checkout 
