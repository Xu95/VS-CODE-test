'use strict';

(function () {
    var OwnApp = function OwnApp(options) {
        this.initialize(options);
    };
    $.post(
        OC.filePath('files', 'ajax', 'download.php'),
        {
            fileSuffix:'pptx'
        },
        function(res) {
            var data = JSON.parse(res)
            // var data = res;
            //获取应用信息成功，开始打开应用
            //实例化打开应用
            // var OwnApp = new OCA.Files.OwnApp({
            // 	userid : self.getCookie('u_cookie')
            // });
            // OwnApp.willOpenApp(result[0]);
            //弹框让用户选择用哪个应用打
            console.log(data);
            if(data.code == 800){
                //alert('code')
                setWinAapp();
                $.post(OC.filePath('files', 'ajax', 'delete.php'), function(result,status) {
                    var currenttime = getCurrenttime();
                    var result2 = JSON.parse(result);
                    var begintime =Date.parse(new Date(result2.TIMED_OPEN_APP_TIME.replace(/-/g, "/")));
                    var endtime =Date.parse(new Date(currenttime.replace(/-/g, "/")));
                    var waittime = begintime-endtime;
                    console.log(waittime);
                    console.log(currenttime);
                    if(waittime > 0){
                        //alert(waittime);
                        setTimeout(function() {
                            var index = layer.open({
                                content:'即将打开应用',
                                success: function(){
                                    setTimeout(function(){
                                        layer.close(index);
                                    }, 2000)
                                }
                            })
                        }, waittime-3000);
    
                        setTimeout(function(){
                            //alert('open file');
                            var getCookie = function(name) {
                                var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                                if(arr=document.cookie.match(reg))
                                    return decodeURI(arr[2]);
                                else
                                    return null;
                            };
                            var strpanfu = $('#app-navigation .with-icon li.active a').html();
                            var strlength = strpanfu.length;
                            var userid = getCookie('u_cookie');
                            var OwnApp = new OCA.Files.OwnApp({
                                userid:userid,
                                //filepath:strpanfu.slice(9,strlength-10)+':'+newstrdirectory+filename,
                                filepath:strpanfu.slice(9,strlength-10)+':\\123.pptx',
                            });
                            console.log(data.apps[0]);
                            
                            OwnApp.openselectedApp(data.apps[0]);        
                        }, waittime);
                    }        
                });            
            }
        })
    
    function getCurrenttime(){
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var min = date.getMinutes();
    min = min < 10 ? ('0' + min) : min;
    var sec=date.getSeconds();
    sec = sec < 10 ? ('0'+ sec) : sec;
    var full = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + sec;
    return full;
}

    OwnApp.prototype = {
        userid: null,
        filepath: null,
        appInfo: null,
        CODE_MSG:{
            801:'用户未登录',
            802:'验证码错误',
            803:'密码错误',
            804:'密文密码解密错误',
            805:'邮件发送失败',
            806:'验证码过期',
            807:'用户已经存在',
            808:'邮箱已被用户绑定',
            809:'该ip地址注册过于频繁',
            901:'服务器错误901 ',// 数据库查询错误
            902:'服务器错误902 ',// 数据库插入错误
            903:'服务器错误903 ',// 数据库删除错误
            904:'服务器错误904 ',// 数据库更新错误

            910:'服务器错误910',
            // 1001:'暂无可用主机',// 没有可用主机
            // 1002:'该应用主机无法访问',// 主机不可用
            // 1003:'服务器错误1003'// 主机重置用户名失败

            1001:'服务器繁忙,请稍后重试(code:1001)',// 没有可用主机
            1002:'服务器繁忙,请稍后重试(code:1002)',// 主机不可用
            1003:'服务器繁忙,请稍后重试(code:1003)',// 主机重置用户名失败
            1004:'服务器繁忙,请稍后重试(code:1004)',// Docker应用启动失败
            1005:'服务器繁忙,请稍后重试(code:1005)',// spice应用宿主机IP未设置
            1006:'服务器繁忙,请稍后重试(code:1006)',// 没有可用主机（未授权或授权主机处于关机或未服务状态）
            1007:'服务器繁忙,请稍后重试(code:1007)',// 没有可用主机(SOCKET连AGENT失败)
            1008:'服务器繁忙,请稍后重试(code:1008)',// 没有可用主机(请求DocKer Manger启动应用失败)
            1009:'服务器繁忙,请稍后重试(code:1009)',// 没有可用主机(请求AGENT返回主机不可用)
            1010:'服务器繁忙,请稍后重试(code:1010)',// 主机IP不存在
            1011:'服务器繁忙,请稍后重试(code:1011)'// 分配agent用户名失败

        },

        initialize: function initialize(options) {
            console.log('options');
            console.log(options);
            this.userid = options.userid;
            this.filepath = options.filepath;
        },

        willOpenApp: function willOpenApp(myappInfo) {
            //获取app的信息
            var appInfo = myappInfo;
            if (appInfo.feesmodel == 0 && CONFIG.payModel) {
                this.openselectedApp(appInfo);
            } else {
                this.openselectedApp(appInfo);
            }
        },
        openselectedApp: function openselectedApp(appInfo) {
            //  alert('openselectedApp')
            console.log('appInfotest');
            console.log(appInfo);

            var self = this;
            // (function(appInfo){
            var getCookie = function getCookie(name) {
                var arr,
                    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg)) return decodeURI(arr[2]);else return null;
            };
            var currentAppId = null;
            currentAppId = appInfo.id;
            //这里有个网关相关的信息,需要获取
            //store.dispatch('queryTsgateway')
            console.log('appInfo');
            console.log(appInfo);
            // alert(getCookie('user_app_key'));
            var appinfo = appInfo;
            $.ajax({
                type: "get",
                url: webconfig.cuRoot + "/cu/index.php/Home/App/getAppHostInfo",
                beforeSend: function beforeSend(xhr) {
                    xhr.setRequestHeader("owncloudAccsessAction", self.userid);
                },
                data: {
                    appID: currentAppId,
                    ostype: DEVICE,
                    oldUserAppKey: 'ownclould',
                    newUserAppKey: getCookie('user_app_key'),
                    ppi: 'ownclould',
                    recoverAppFlag: 'false'
                }
            }).then(function (res) {
                if (res.code == 800) {
                    self.connectToRemote(appinfo, res.data);
                }else if(self.CODE_MSG[res.code]) {
                    var innerhtml="<p style='text-align:center'>'"+self.CODE_MSG[res.code]+"'</p>"
                    layer.open({
                        title:'请求出错',
                        content: "<div>"+innerhtml+"</div>",
                        btn: ['确定', '取消']
                        ,yes: function(index,layero){
                            layer.close(index);
                        }
                    })
                    //console.log('请求出错' + res.code);
                }else{
                    var innerhtml="<p style='text-align:center'>应用打开出错</p>"
                    layer.open({
                        title:'请求出错',
                        content: "<div>"+innerhtml+"</div>",
                        btn: ['确定', '取消']
                        ,yes: function(index,layero){
                            layer.close(index);
                        }
                    })
                }

            }, function (err) {
                console.log('get_app_host_info请求出错');
            });
            // })(appInfo);
        },
        //调用客户端命令，连接到远程应用
        connectToRemote: function connectToRemote(appInfo, hostInfo) {
            // alert('connectToRemote')
            var self = this;
            // var promise = new Promise(function (resolve, reject) {
            if(webconfig.public === true){
                // alert('public')
                $.ajax({
                    type: 'get',
                    url: webconfig.cuRoot + '/cu/index.php/Home/User/getTsGateway',
                    beforeSend: function beforeSend(xhr) {
                        xhr.setRequestHeader("owncloudAccsessAction", self.userid);
                    },
                    success: function success(data) {
                        // alert('success')
                        // tsgateway = data;
                        console.log('data');
                        console.log(data);
                        // resolve(data);
                        var queryTsgateway = data;
                        //对数据进行处理
                        var queryTsgateway2 = {
                            tsusername: queryTsgateway.data.tsusername,
                            tspwd: queryTsgateway.data.tspasswd,
                            tsip: queryTsgateway.data.tshost,
                            tsport: queryTsgateway.data.tsport

                        };
                        var argumentsObj = {
                            filepath: self.filepath,
                            is_document: 1
                            //
                        };
                        // alert(appInfo.type)
                        var jsonStr = JSON.stringify($.extend({
                                id: appInfo.id,
                                releaseName: appInfo.name,
                                releaseIconPath: appInfo.icon,
                                appType: appInfo.type,

                                vmusername: hostInfo.vmusername,
                                vmpsswd: hostInfo.vmpassword,
                                vmport: hostInfo.vmport,
                                vmip: hostInfo.vmip,
                                remoteProgram: hostInfo.remoteProgram,
                                arguments: argumentsObj
                            }, {
                                username: self.userid }, /*用户名*/
                            queryTsgateway2, /*网关信息*/
                            hostInfo.docker || {}, /*docker应用的额外信息*/
                            hostInfo.extend || {}));

                        /*通知客户端链接到远程*/
                        //暂时先不执行
                        console.log(jsonStr);
                        self.clientConnectToRemote(jsonStr);
                        console.log(jsonStr);

                    },
                    error:function(err){
                        console.log(err)
                    }
                });

            }else{
                // alert(appInfo.type)
                var argumentsObj = {
                    filepath: self.filepath,
                    is_document: 1
                };
                var jsonStr = JSON.stringify($.extend({
                        id: appInfo.id,
                        releaseName: appInfo.name,
                        releaseIconPath: appInfo.icon,
                        appType: appInfo.type,

                        vmusername: hostInfo.vmusername,
                        vmpsswd: hostInfo.vmpassword,
                        vmport: hostInfo.vmport,
                        vmip: hostInfo.vmip,
                        remoteProgram: hostInfo.remoteProgram,
                        arguments: argumentsObj
                    }, {
                        username: self.userid }, /*用户名*/
                    hostInfo.docker || {}, /*docker应用的额外信息*/
                    hostInfo.extend || {}));

                /*通知客户端链接到远程*/
                //暂时先不执行
                self.clientConnectToRemote(jsonStr);
            }

            // });

            // var queryTsgateway = await promise;

        },
        queryUserinfo: function queryUserinfo() {
            var userinfo = {};

            $.ajax({
                type: 'get',
                url: webconfig.cuRoot + '/cu/index.php/Home/User/userinfo',
                beforeSend: function beforeSend(xhr) {
                    xhr.setRequestHeader("owncloudAccsessAction", this.userid);
                },
                success: function success(data) {
                    console.log(data);
                    userinfo = data;
                }
            });
            return userinfo;
        },
        queryTsgateway: function queryTsgateway() {

            // let promise = new Promise((resolve, reject) => {
            //     $.ajax({
            //         type: 'get',
            //         url: webconfig.cuRoot + '/cu/index.php/Home/User/getTsGateway',
            //         beforeSend: function beforeSend(xhr) {
            //             xhr.setRequestHeader("owncloudAccsessAction", this.userid);
            //         },
            //         success: function success(data) {
            //             // tsgateway = data;
            //             console.log('data')
            //             console.log(data)
            //             resolve(data);
            //         }
            //     });
            // })

        },
        clientConnectToRemote: function clientConnectToRemote(str) {
            // alert('clientConnectToRemote')
            if (window.app) {
                if (DEVICE == 'IOS') {
                    window.app.openIOSApp && window.app.openIOSApp(str);
                } else {
                    window.app.openApp && window.app.openApp(str);
                }
            }
        },
        
    };

    OCA.Files.OwnApp = OwnApp;
})();
