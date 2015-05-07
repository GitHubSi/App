//
var querystring=require('querystring');
var dns=require('dns');

exports.parseDns=function(res,req){
	var postData='';
	req.addListener('data',function(postDataChunk){
		postData+=postDataChunk;
	});
	req.addListener('end',function(){
		var dns=getDns(postData,function(domain,addresses){
			res.writeHead(200,{'Content-Type':'text/html'});
			res.end("<html><head><meta http-equiv='content-type' content='text/html;charset=utf-8'></head><body>"+
			"<h1 style='text-align:center'>DNS查询工具</h1>"+
			"<div style='text-align:center'>"+
			"Domain:<span style='color:red' >"+domain+
			"</span>IP:<span style='color:red' >"+addresses.join(',')+"</span></div></body></html>"
			);
		});
	});
}
function getDns(postData,callback){
	var domain=querystring.parse(postData).search_dns;
	dns.resolve(domain,function(err,addresses){
		if(!addresses){
			addresses=['不存在域名'];
		}
		callback(domain,addresses);
	})
}