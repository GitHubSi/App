/**
 * dialog plauage
 */
//模态对话框函数
var fx = {
    //初始化模态对话框窗口
    "initModal" : function(){
        if($(".modal_window").length==0){
            return $("<div>").adClass("modal_window").appendTo("body");
        }
        else{
            return $(".modal_window");
        }
    },
    //将窗口添加到标记文件并让他淡入
    "boxin":function(){
        
    },
    //淡出窗口并从DOM中移除
    "boxout":function(){
        
    }
}

