window.onload = function(){
    //重载按钮 点击事件
	$('#reloadlink').click(function(){
        check_link()
    })
}
function check_link()
{	
    var userid = $('#uid').html();
    $.ajax({
        url:webconfig.localRoot + "/cos/cmt/update_dir_link.php",
        type:'get',
        data:{
            userid:userid
        },
        success:function(res){
            if(res == 'success'){
                //重新加载当前页面
                location.reload();
            }else if(res == "000"){
                // alert("该用户没有可用网盘");
                layer.open({
                    content:'该用户没有可用网盘'
                })
                window.location.href =webconfig.cuRoot + '/cu/Public/vue/build/index.php' 
            }else{
                // alert("网盘异常，请联系管理员");
                layer.open({
                    content:'网盘异常，请联系管理员'
                })
                window.location.href =webconfig.cuRoot + '/cu/Public/vue/build/index.php' 
            }
        }
    })
}
