/**
 * @desc linux端的上传图片用户服务器
 * @version 2
 */
module.exports=function(){
	var _res=arguments[0];
	var _req=arguments[1];
	
	//文件上传web的响应接口
	this.uploadPage=function(){
		_res.render(VIEW+'udp-img-index.jade');
	}
	//文件上传的逻辑处理接口
	this.uploadAction=function(){
		var now=Date.parse(new Date())/1000;
		var form=new lib.formidable.IncomingForm();
		var fields=[];
		var pathName='/uploadFile/'+now+'_small'+'.png';
		form.on('field',function(field,value){
			fields.push([field,value]);
		})
		form.parse(_req,function(error,fields,files){
			//设置源文件的保存路径
			var baseName=BASE_DIR+'/uploadFile/'+files.upload.name+now+".png";
			var newName=BASE_DIR+'/uploadFile/'+files.upload.name+now+"_small.png";
			fs.readFile(files.upload.path,function(error,data){
				fs.writeFile(baseName,data,function(error){
					if(error){
						console.log(error);
					}
				});
			})
			switch(fields.type){
				case 1:
					imageResize(fields.width,fields.height,baseName,newName);
					break;
				case 2:
					imageCroop(fields.width,fields.height,baseName,newName);
					break;
				default:
					imageResize(fields.width,fields.height,baseName,newName);
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
	function imageResize(width,height,imagePath,newName){
		var imageJson={
			'width':width,
			'height':height,
			'url':imagePath,
			'new_name':newName
		};
		var imageJsonStr=JSON.stringify(imageJson);
		var client=lib.dgram.createSocket("udp4");
		var message=new Buffer(imageJsonStr);
		client.send(message,0,message.length,41234,"127.0.0.1",function(){
			client.on("message",function(msg,rinfo){
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
}
