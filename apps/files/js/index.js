/**
 * Created by Vico on 2017.06.06.
 */
import lang from './lang.js';
// let localRoot = 'http://localhost/cu_new/cu/index.php/';
let localRoot = 'http://localhost/cu/index.php/';
const URL = {
    // verifycode:localRoot + 'Home/User/verify_create.html',
    // user_login:localRoot + 'Home/User/login.html'
}
const CODE_MSG = {
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
    1001:'暂无可用主机',// 没有可用主机
    1002:'该应用主机无法访问',// 主机不可用
    1003:'服务器错误1003'// 主机重置用户名失败
};

const payModel = {
    bymonth:{
        name:"包月",
        unit:"云币/月"
    },
    bycount:{
        name:"计时",
        unit:"云币/小时"
    },
    byyear:{
        name:"包年",
        unit:"云币/每年"
    }
};

const MOBILE = "MOBILE";
const PC = "PC";

export {
    URL,
    lang,
    CODE_MSG,
    payModel,
    MOBILE,
    PC
}