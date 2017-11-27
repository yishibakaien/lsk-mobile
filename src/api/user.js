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
        updateUser: '/user/updateUser',
        // 校验密码
        checkPasswd: '/user/checkPasswd',
        // 修改手机号码
        changeMobile: '/user/changeMobile',
        // 修改用户密码
        restPasswd: '/user/restPasswd',
        // 获取注册短信
        // getRegSMSCode: '/front/user/getRegSMSCode',
        // 用户注册
        reg: '/front/user/reg',
        // 获取修改手机短信
        changeSMSCode: '/user/changeSMSCode'
    },
    main: {
        // 获取求购单接单人列表
        // listBuyTaskUserByBuyId: '/buyTask/listBuyTaskUserByBuyId',
        // 获取收藏供应列表
        listSupply: '/favorite/listSupply',
        // 获取厂家供应列表
        listCompany: '/favorite/listCompany',
        // 获取收藏花型列表
        listProduct: '/favorite/listProduct',
        // 收藏或取消
        favoriteBus: '/favorite/favoriteBus',
        // 获取供应详情
        getCompanySupply: '/companySupply/getCompanySupply/',
        // 获取求购详情
        getProductBuy: '/productBuy/getProductBuy/',
        // 首页求购列表
        listHomeProductBuys: '/productBuy/listHomeProductBuys',
        // 首页供应列表
        listHomeCompanySupplys: '/companySupply/listHomeCompanySupplys',
        // 获取版衣列表
        listClothes: '/clothes/listClothes',
        // 发布供应
        releaseCompanySupply: '/companySupply/releaseCompanySupply',
        // 我的求购列表
        myProductBuys: '/productBuy/myProductBuys',
        // 删除求购
        deleteProductBuy: '/productBuy/deleteProductBuy',
        // 发布求购
        releaseProductBuy: '/productBuy/releaseProductBuy',
        // 定制版衣
        customClothes: '/clothes/customClothes',
        // 定制花型
        customProduct: '/clothes/customProduct',
        // 关闭供应
        closeCompanySupply: '/companySupply/closeCompanySupply',
        // 关闭求购
        closeProductBuy: '/productBuy/closeProductBuy',
        // 完成接单
        // finishProductBuy: '/productBuy/finishProductBuy'
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
// 获取求购详情
export function getProductBuy(data, cb, err) {
    let _data = data;
    let url = API.main.getProductBuy.toString() + _data.id.toString();
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
// export function listBuyTaskUserByBuyId(data, cb, err) {
//     return _fetch('GET', data, API.main.listBuyTaskUserByBuyId, cb, err);
// }
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
// 更新用户信息
export function updateUser(data, cb, err) {
    return _fetch('POST', data, API.user.updateUser, cb, err);
}
// 首页求购列表
export function listHomeProductBuys(data, cb, err) {
    return _fetch('GET', data, API.main.listHomeProductBuys, cb, err);
}
// 首页供应列表
export function listHomeCompanySupplys(data, cb, err) {
    return _fetch('GET', data, API.main.listHomeCompanySupplys, cb, err);
}
// 获取版衣列表
export function listClothes(data, cb, err) {
    return _fetch('POST', data, API.main.listClothes, cb, err);
}
//发布供应
export function releaseCompanySupply(data, cb, err) {
    return _fetch('POST', data, API.main.releaseCompanySupply, cb, err);
}
//定制版衣
export function customClothes(data, cb, err) {
    return _fetch('POST', data, API.main.customClothes, cb, err);
}
//定制花型
export function customProduct(data, cb, err) {
    return _fetch('POST', data, API.main.customProduct, cb, err);
}
// 关闭供应
export function closeCompanySupply(data, cb, err) {
    return _fetch('POST', data, API.main.closeCompanySupply, cb, err);
}
//关闭求购
export function closeProductBuy(data, cb, err) {
    return _fetch('POST', data, API.main.closeProductBuy, cb, err);
}
//完成接单
// export function finishProductBuy(data, cb, err) {
//     return _fetch('POST', data, API.main.finishProductBuy, cb, err);
// }

// 校验密码
export function checkPasswd(data, cb, err) {
    return _fetch('POST', data, API.user.checkPasswd, cb, err);
}
// 修改手机号码
export function changeMobile(data, cb, err) {
    return _fetch('POST', data, API.user.changeMobile, cb, err);
}
// 修改用户密码
export function restPasswd(data, cb, err) {
    return _fetch('POST', data, API.user.restPasswd, cb, err);
}
// 获取注册短信
// export function getRegSMSCode(data, cb, err) {
//     return _fetch('POST', data, API.user.getRegSMSCode, cb, err);
// }
// 用户注册
export function reg(data, cb, err) {
    return _fetch('POST', data, API.user.reg, cb, err);
}
// 获取修改手机短信
export function changeSMSCode(data, cb, err) {
    return _fetch('POST', data, API.user.changeSMSCode, cb, err);
}
