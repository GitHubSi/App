/**
 * @desc linux端的上传图片用户服务器
 * @version 2 修改成了exports的形式
 */
 
var _req=null;
var _res=null;
exports.init=function(response,request){
		//this._res=arguments[0];
		_res=response;
		_req=arguments[1];
	}
	//文件上传web的响应接口
	exports.uploadPage=function(){
		_res.render('udp-img-index.jade');
	}
	exports.view=function(){
		//console.log(this._res);
		_res.render('udp-img-index.jade');
	}
	//文件上传的逻辑处理接口
	exports.uploadAction=function(){
		var now=Date.parse(new Date())/1000;
		var form=new lib.formidable.IncomingForm();
		var fields=[];
		var pathName='/uploadFile/'+now+'_small'+'.png';
		form.on('field',function(field,value){
			//fields.push([field,value]);
			try{  
				fields[field]=value;  
			}
			catch(e){
				console.log('error occur');
			}
		})
		form.parse(_req,function(error,fields,files){
			//设置源文件的保存路径
			//var baseName=BASE_DIR+'/upload/'+files.image.name+now+".png";
			var baseName=BASE_DIR+'/upload/'+now+".png";
			// var newName=BASE_DIR+'/upload/'+files.image.name+now+"_small.png";
			var newName=now+"_small.png";
			//伪装成网络的路径
			var http_img="127.0.0.1:3000/upload/"+now+".png";
			lib.fs.readFile(files.image.path,function(error,data){
				lib.fs.writeFile(baseName,data,function(error){
					if(error){
						console.log(error);
					}
				});
			})
			//type返回的是一个字符类型，不是一个整型
			switch(fields.type){
				case '1':
					// console.log("reach 1");
					imageResize(fields.width,fields.height,http_img,newName,'message');
					break;
				case '2':
					imageResize(fields.width,fields.height,baseName,newName,'crop');
					break;
				default:
					// console.log("reach default");
					imageResize(fields.width,fields.height,baseName,newName,'message');
					break;
			}
			
		})
	}
	/*
	 *@desc 对图片的压缩处理
	 *@parameters width 图片压缩的宽度
	 *@parameters height 图片压缩的高度
	 *@parameters imagePath 图片的源地址
	 *@parameters newName 图片处理后的路径名称
	 */
	function imageResize(width,height,imagePath,newName,type){
		var imageJson={
			'width':width,
			'height':height,
			'url':imagePath,
			'new_name':newName
		};
		var imageJsonStr=JSON.stringify(imageJson);
		var client=lib.dgram.createSocket("udp4");
		var message=new Buffer(imageJsonStr);
		client.send(message,0,message.length,41234,"192.168.187.129",function(){
			client.on(type,function(msg,rinfo){
				var retJson=JSON.parse(msg);
				if(retJson.code==0){
					console.log(retJson.data.name);
					_res.render(VIEW+'main.jade',{'url':retJson.data.name,'err':'ok'});
				}
				else{
					_res.render(VIEW+'main.jade',{'url':'','err':'error'});
				}
			});
		});
	}

