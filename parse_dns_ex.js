
var http=require('http');//服务器创建
var dns=require('dns');//DNS查询
var fs=require('fs');
var url=require('url');
var querystring=require('querystring');

//1.创建服务
var sev=http.createServer(function(req,res){
	// res.writeHead(200,{'Content-Type':'text/html'});
	// var readPath=__dirname+'/'+url.parse('index.html').pathname;
	// var indexPage=fs.readFileSync(readPath);
	// res.end(indexPage);
	var pathname=url.parse(req.url).pathname;
	req.setEncoding('utf-8');
	res.writeHead(200,{'Content-Type':'text/html'});
	router(res,req,pathname);
});
sev.listen(3000,'127.0.0.1');

//路由 显示index.html
function goindex(req,res){
	// res.writeHead(200,{'Content-Type':'text/html'});
	var readPath=__dirname+'/'+url.parse('index.html').pathname;
	var indexPath=fs.readFileSync(readPath);
	res.end(indexPath);
}

function router(res,req,pathname){
	switch(pathname){
		case '/parse':
			parseDns(res,req);
			break;
		default:
			goindex(req,res);
	}
}

function parseDns(res,req){
	var postData='';
	req.addListener('data',function(postDataChunk){
		postData+=postDataChunk;
	});
	req.addListener('end',function(){
		var retData=getDns(postData,function(domain,addresses){
			res.writeHead(200,{'Content-Type':'text/html'});
			res.end("<html><head><meta http-equiv='content-type' content='text/html;charset=utf-8'></head><body>"+
			"<h1 style='text-align:center'>DNS查询工具</h1>"+
			"<div style='text-align:center'>"+
			"Domain:<span style='color:red' >"+domain+
			"</span>IP:<span style='color:red' >"+addresses.join(',')+"</span></div></body></html>"
			);
		});
		return;
	});
}

function getDns(postData,callback){
	var domain=querystring.parse(postData).search_dns;
	dns.resolve(domain,function(err,addresses){
		if(!addresses){
			addresses=['不存在域名'];
		}
		callback(domain,addresses);
	});
}