//对用户登录的信息进行处理

/*
 * version:2 修改了使用jade模板,修改了上传使用的文件名,
 * version:3 修改了返回数据类型为Class，使用module.exports返回数据 2015-03-30
 */

var fs=require('fs');
var url=require('url');
var querystring=require('querystring');
//var getvalue=require('./getValue');
var formidable=require('formidable');
var util=require('util');
BASE_DIR=__dirname;
UPLOAD_PATH=BASE_DIR+"\\upload\\";

var res;
var req;
var home=function(){
	this.init=function(response,request){
		res=response;
		req=request;
	}
	this.login=function(){
		console.log('game over');
	}
	this.upload=function(){
		var form=new formidable.IncomingForm();
		//设置接收数据的字符编码
		form.encoding='utf-8';
		//应用form对象解析POST数据
		form.parse(req,function(err,fields,files){
			var timestamp=Date.parse(new Date());
			//设置文件的上传
			var target_tmp_path=files.upload.path;
			var target_real_path=UPLOAD_PATH+timestamp+"_"+files.upload.name
			fs.readFile(target_tmp_path,function(error,data){
				fs.writeFile(target_real_path,data,function(error){
					if(error){
						console.log(error);
					}
				})
			})
			//fs.renameSync(files.upload.path,__dirname+"\\upload\\new.jpg");
			//res.writeHead(200,{'Content-Type':'text/plain'});
			//res.write('received upload:\n\n');
			//inspect:将json对象转换成字符串
			//res.end(util.inspect({fields:fields,files:files}));
			res.render('home.jade',{'imgUrl':target_real_path})
		});
	}
	this.view=function(){
		/*
		* 初始化的用户界面
		*/
		// var path=__dirname+'/'+url.parse('home.html').pathname;
		// var indexPage=fs.readFileSync(path);
		// res.end(indexPage);
		res.render('home.jade');
	}
	this.daily=function(){
		res.render('dailywite.jade');
	}
}
module.exports=home;
