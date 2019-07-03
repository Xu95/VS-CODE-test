'use strict';

(function () {
    var OwnApp = function OwnApp(options) {
        this.initialize(options);
    };

    OwnApp.prototype = {
        userid: null,
        filepath: null,
        appInfo: null,

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
                } else {
                    console.log('请求出错' + res.code);
                }
            }, function (err) {
                console.log('get_app_host_info请求出错');
            });
            // })(appInfo);
        },
        //调用客户端命令，连接到远程应用
        connectToRemote: function connectToRemote(appInfo, hostInfo) {
            var self = this;
            // var promise = new Promise(function (resolve, reject) {
            $.ajax({
                type: 'get',
                url: webconfig.cuRoot + '/cu/index.php/Home/User/getTsGateway',
                beforeSend: function beforeSend(xhr) {
                    xhr.setRequestHeader("owncloudAccsessAction", this.userid);
                },
                success: function success(data) {
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
                    };var jsonStr = JSON.stringify($.extend({
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

                }
            });
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
            if (window.app) {
                if (DEVICE == 'IOS') {
                    window.app.openIOSApp && window.app.openIOSApp(str);
                } else {
                    window.app.openApp && window.app.openApp(str);
                }
            }
        }

    };

    OCA.Files.OwnApp = OwnApp;
})();














'use strict';

(function () {
    var OwnApp = function OwnApp(options) {
        this.initialize(options);
    };

    OwnApp.prototype = {
        userid: null,
        filepath: null,
        appInfo: null,

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
                } else {
                    console.log('请求出错' + res.code);
                }
            }, function (err) {
                console.log('get_app_host_info请求出错');
            });
            // })(appInfo);
        },
        //调用客户端命令，连接到远程应用
        connectToRemote:async function connectToRemote(appInfo, hostInfo) {
            let promise = new Promise((resolve, reject) => {
                $.ajax({
                    type: 'get',
                    url: webconfig.cuRoot + '/cu/index.php/Home/User/getTsGateway',
                    beforeSend: function beforeSend(xhr) {
                        xhr.setRequestHeader("owncloudAccsessAction", this.userid);
                    },
                    success: function success(data) {
                        // tsgateway = data;
                        console.log('data')
                        console.log(data)
                        resolve(data);
                    }
                });
            })

            var queryTsgateway = await promise;
            //对数据进行处理
            var queryTsgateway2 ={
                tsusername:queryTsgateway.data.tsusername,
                tspwd:queryTsgateway.data.tspasswd,
                tsip:queryTsgateway.data.tshost,
                tsport:queryTsgateway.data.tsport,

            }
            var argumentsObj = {
                filepath:this.filepath,
                is_document:1
            }
            //
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
                    username: this.userid }, /*用户名*/
                queryTsgateway2, /*网关信息*/
                hostInfo.docker || {}, /*docker应用的额外信息*/
                hostInfo.extend || {}));

            /*通知客户端链接到远程*/
            //暂时先不执行
            this.clientConnectToRemote(jsonStr);
            console.log(jsonStr);
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
        queryTsgateway:function queryTsgateway() {

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
            if (window.app) {
                if(DEVICE == 'IOS'){
                    window.app.openIOSApp && window.app.openIOSApp(str);
                }else {
                    window.app.openApp && window.app.openApp(str);
                }
            }
        },



    };

    OCA.Files.OwnApp = OwnApp;
})();
