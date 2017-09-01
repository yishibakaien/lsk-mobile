'use strict';

const _fetch = require('./fetch/fetch');

const API = {
    user: {
        // 检查手机号码是否存在
        checkPhone: '/front/user/checkPhone',
        // 用户登录
        login: '/front/user/login',
        // 获取图片验证码
        getVerifyCode: '/front/user/getVerifyCode',
    }
};

// 检查手机号码，此接口没有跨域问题
export function checkPhone(data, cb, err) {
    return _fetch('GET', data, API.user.checkPhone, cb, err);
}
//用户登录
export function login(data, cb, err) {
    return _fetch('POST', data, API.user.login, cb, err);
}
// 获取图片验证码
export function getVerifyCode(data, cb, err) {
    return _fetch('POST', data, API.user.getVerifyCode, cb, err);
}