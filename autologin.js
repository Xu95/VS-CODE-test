"use strict";

window.onload = function () {
    check_link();
};
document.getElementById('btn-back').onclick = function () {
    window.history.back();
};

function getXhr() {

    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHttp");
    }
    return xhr;
}

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 30);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) 
        return unescape(arr[2]);
    else return null;
}

function check_link() {
    var sign = null;
    var xhr = getXhr();
    var url = webconfig.localRoot + "/cos/cmt/update_dir_link.php";
    var b64data = window.location.search.slice(1);
    var info = atob(b64data).split('&');
    var userid = info[0];
    var cuurl = webconfig.localRoot + '/cu';
    setCookie('user_app_key', info[2]);
    url = url + "?userid=" + userid;
    xhr.open('get', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            sign = xhr.responseText;
            if (sign == "success") {
                var b64data = window.location.search.slice(1);
                var info = atob(b64data).split('&');
                document.getElementById('user').value = info[0];
                document.getElementById('password').value = info[1];
                //  document.getElementById('codename').value = getCookie('code');
                document.getElementById('login-form').submit();
            } else {
                if (sign == "000") {
                    layer.open({
                        content:'该用户没有可用网盘'
                    })
                    //alert("该用户没有可用网盘");
                    setTimeout(function(){
                        window.location.assign(webconfig.cuRoot+'/cu');
                    },500)

                } else {
                    layer.open({
                        content:'网盘异常，请联系管理员'
                    })
                    //alert("网盘异常，请联系管理员");
                    setTimeout(function(){
                        window.location.assign(webconfig.cuRoot+'/cu');
                    },500)

                }
            }
        }
    };
    xhr.send(null);
}
