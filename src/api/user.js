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

        // 获取最新用户信息
        getUserInfo: '/user/getUserInfo',

        // 更新用户信息
        updateUser: '/user/updateUser'
    },
    main: {
        // 我的求购列表
        myProductBuys: '/productBuy/myProductBuys',
        // 删除求购
        deleteProductBuy: '/productBuy/deleteProductBuy',
        // 发布求购
        releaseProductBuy: '/productBuy/releaseProductBuy',
        // 获取求购单接单人列表
        listBuyTaskUserByBuyId: '/buyTask/listBuyTaskUserByBuyId',
        // 获取收藏供应列表
        listSupply: '/favorite/listSupply',
        // 获取厂家供应列表
        listCompany: '/favorite/listCompany',
        // 获取收藏花型列表
        listProduct: '/favorite/listProduct',
        // 收藏或取消
        favoriteBus: '/favorite/favoriteBus',
        // 获取供应详情
        getCompanySupply: '/companySupply/getCompanySupply/'
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
    },
    consignee: {
        // 删除收货地址
        deleteConsignee: '/consignee/deleteConsignee',
        // 新增收货地址
        addConsignee: '/consignee/addConsignee',
        // 编辑收货地址
        editorConsignee: '/consignee/editorConsignee',
        // 获取收货地址列表
        listConsignee: '/consignee/listConsignee',
        // 获取收货地址详情
        getConsignee: '/consignee/getConsignee/',
        // 设置默认
        setDefault: '/consignee/setDefault/'
    },
    area: {
        allAreas: '/front/area/allAreas'
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
// 供应详情
export function getCompanySupply(data, cb, err) {
    let _data = data;
    let url = API.main.getCompanySupply.toString() + _data.id.toString();
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
// 删除收货地址
export function deleteConsignee(data, cb, err) {
    return _fetch('POST', data, API.consignee.deleteConsignee, cb, err);
}
// 新增收货地址
export function addConsignee(data, cb, err) {
    return _fetch('POST', data, API.consignee.addConsignee, cb, err);
}
// 编辑收货地址
export function editorConsignee(data, cb, err) {
    return _fetch('POST', data, API.consignee.editorConsignee, cb, err);
}
// 获取收货地址列表
export function listConsignee(data, cb, err) {
    return _fetch('GET', data, API.consignee.listConsignee, cb, err);
}
// 获取收货地址详情
export function getConsignee(data, cb, err) {
    let _data = data;
    let url = API.consignee.getConsignee.toString() + _data.id.toString();
    return _fetch('GET', {}, url, cb, err);
}
// 设置默认
export function setDefault(data, cb, err) {
    let _data = data;
    let url = API.consignee.setDefault.toString() + _data.id.toString();
    return _fetch('GET', {}, url, cb, err);
}
// 我的求购列表
export function myProductBuys(data, cb, err) {
    return _fetch('POST', data, API.main.myProductBuys, cb, err);
}
// 发布求购
export function releaseProductBuy(data, cb, err) {
    return _fetch('POST', data, API.main.releaseProductBuy, cb, err);
}
// 获取求购单接单人列表
export function listBuyTaskUserByBuyId(data, cb, err) {
    return _fetch('GET', data, API.main.listBuyTaskUserByBuyId, cb, err);
}
// 删除求购
export function deleteProductBuy(data, cb, err) {
    return _fetch('POST', data, API.main.deleteProductBuy, cb, err);
}
// 获取所有的省市区信息
export function allAreas(data, cb, err) {
    return _fetch('GET', data, API.area.allAreas, cb, err);
}

// 获取用户最新信息
export function getUserInfo(data, cb, err) {
    return _fetch('POST', data, API.user.getUserInfo, cb, err);
}
// 获取收藏供应列表
export function listSupply(data, cb, err) {
    return _fetch('POST', data, API.main.listSupply, cb, err);
}
// 获取收藏厂家列表
export function listCompany(data, cb, err) {
    return _fetch('POST', data, API.main.listCompany, cb, err);
}
// 获取收藏花型列表
export function listProduct(data, cb, err) {
    return _fetch('POST', data, API.main.listProduct, cb, err);
}
//收藏或取消
export function favoriteBus(data, cb, err) {
    return _fetch('POST', data, API.main.favoriteBus, cb, err);
}

export function updateUser(data, cb, err) {
    return _fetch('POST', data, API.user.updateUser, cb, err);
}