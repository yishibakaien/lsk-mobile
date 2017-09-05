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
    },
    detail: {
        // 获取花型详情
        getProduct: '/product/getProduct/',
        // 新增获取色卡
        getColorCards: '/productColor/getColorCards',
        // 新增采购登记
        askPurchase: '/enquiry/askPurchase'
    },
    company: {
        // 获取档口OR工厂信息
        getCompanyInfo: '/company/getCompanyInfo',
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
// 获取花型详情
export function getProduct(data, cb, err) {
    let _data = data;
    let url = API.detail.getProduct.toString() + _data.id.toString();
    return _fetch('GET', {}, url, cb, err);
}
// 获取花型详情色卡
export function getColorCards(data, cb, err) {
    return _fetch('GET', data, API.detail.getColorCards, cb, err);
}
// 采购登记
export function askPurchase(data, cb, err) {
    return _fetch('POST', data, API.detail.askPurchase, cb, err);
}
// 获取公司信息(详细)
export function getCompanyInfo(data, cb, err) {
    return _fetch('GET', data, API.company.getCompanyInfo, cb, err);
}

