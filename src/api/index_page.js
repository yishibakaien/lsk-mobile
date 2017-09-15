'use strict';

const _fetch = require('./fetch/fetch');

const METHODS = {
    post: 'POST',
    get: 'GET'
};

const API = {
    // 最新入驻商家
    newSettled: {
        listLSKHomeUnSettledCompany: '/company/listLSKHomeUnSettledCompany'
    },
    patterns: {
        listLSKHomeProduct: '/product/listLSKHomeProduct'
    },
    supplyAndBuy: {
        getSupplyAndBuy: '/companySupply/getSupplyAndBuy'
    },
    clothes: {
        listHomeClothes: '/clothes/listHomeClothes'
    },
    good: {
        listLSKHomeSettledCompany: '/company/listLSKHomeSettledCompany'
    }

};

// 最新入驻商家(新闻轮播)
export function listLSKHomeUnSettledCompany(data, cb, err) {
    return _fetch('GET', data, API.newSettled.listLSKHomeUnSettledCompany, cb, err);
}
// 首页花型列表
export function listLSKHomeProduct(data, cb, err) {
    return _fetch('GET', data, API.patterns.listLSKHomeProduct, cb, err);
}

// 获取供应&求购列表
export function getSupplyAndBuy(data, cb, err) {
    return _fetch('GET', data, API.supplyAndBuy.getSupplyAndBuy, cb, err);
}

// 首页版衣列表
export function listHomeClothes(data, cb, err) {
    return _fetch('GET', data, API.clothes.listHomeClothes, cb, err);
}

// 首页优质厂家
export function listLSKHomeSettledCompany(data, cb, err) {
    return _fetch('GET', data, API.good.listLSKHomeSettledCompany, cb, err);
}

