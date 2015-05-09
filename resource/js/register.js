$(document).ready(
    $("#submit").click(function(e){
        e.preventDefault();
        $(".empty").length>0 ? $(".empty").remove():null;
        var _submit =true;
        $(".textInput").each(function(index,element){
            if(!$(this).val()){
                $(this).after("<span class='empty' style='color:red'>*</span>");
                _submit = false;
            }
        });
        if(_submit){
            $(".form").submit();
        }
    })
);


