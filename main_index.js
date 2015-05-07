var fs=require('fs');
var url=require('url');
exports.goIndex=function(res,req){
	// res.writeHead(200,{'Content-Type':'text/html'});
	var readPath=__dirname+'/'+url.parse('index.html').pathname;
	var indexPath=fs.readFileSync(readPath);
	res.end(indexPath);
}