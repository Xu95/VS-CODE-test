"use strict";

/*设备环境*/
// const deviceEnv = function(){
//     return navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? Common.MOBILE : Common.PC;
// }();

var DEVICE = function () {
    var env = ['Windows', "Android", "iPad", "iPhone", "iPod"];
    var envMap = {
        Windows: "Windows",
        Android: "Android",
        iPad: "IOS",
        iPhone: "IOS",
        iPod: "IOS"
    };
    var userAgent = window.navigator.userAgent;
    for (var i = 0; i < env.length; i++) {
        if (userAgent.indexOf(env[i]) != -1) {
            return envMap[env[i]];
        }
    }
    return "Windows";
}();

//window端设置window.app对象
function setWinAapp() {
    /*连接windows客户端时与其建立通道，获得app对象*/
    if (navigator.userAgent.indexOf('Windows') != -1) {
        var buildChannel = function buildChannel() {
            if (typeof QWebChannel != 'undefined') {
                new QWebChannel(qt.webChannelTransport, function (channel) {
                    window.channel = channel;
                    window.app = channel.objects.app;
                    app.hideHomeButton();
                });
            }
        };
        if (typeof qt != 'undefined') {
            buildChannel();
        }
    }
}

function connectToRemote(str) {
    if (window.app) {
        window.app.openApp && window.app.openApp(str);
    }
}
