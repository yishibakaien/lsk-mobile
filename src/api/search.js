'use strict';

const _fetch = require('./fetch/fetch');

const METHODS = {
    post: 'POST',
    get: 'GET'
};

const API = {
    search: {
        pic: {
            // 文本搜索
            search: '/product/search',
            // 图片搜索会返回阿里云url 
            encoded: '/search/encoded',
            // 图片搜索发起后像客户端 轮询 搜索结果
            polling: '/search/polling/',
            // 通过url 搜索图片
            url: '/search/url',
            // 获取最终的结果
            getResult: '/search/getResult'
        },
        text: {
            searchLace: '/product/searchLace',
            // 文本搜花-公司搜索
            searchCompany: '/company/search'
        },
        // 获取蕾丝控商家入驻地
        settledLand: {
            getSettledLands: '/common/getSettledLands'
        }
    }
};
// =========
// 图片搜索
// =========
export function search(data, cb, err) {
    return _fetch(METHODS.post, data, API.search.pic.search, cb, err);
}
// 图片搜索
export function encoded(data, cb, err) {
    return _fetch(METHODS.post, data, API.search.pic.encoded, cb, err);
}
// 图片搜索结果 轮询
export function polling(data, cb, err) {
    let _data = data;
    let url = API.search.pic.polling.toString() + _data.searchKey.toString();
    return _fetch(METHODS.get, {}, url, cb, err);
}
// 通过url搜索 图片
export function urlSearch(data, cb, err) {
    return _fetch(METHODS.post, data, API.search.pic.url, cb, err);
}

// 获取搜索结果 图片
export function getResult(data, cb, err) {
    return _fetch(METHODS.get, data, API.search.pic.getResult, cb, err);
}

// 获取蕾丝控商家入驻地点
export function getSettledLands(data, cb, err) {
    return _fetch(METHODS.get, data, API.search.settledLand.getSettledLands, cb, err);
}

// =========
// 文本搜索
// =========
export function searchLace(data, cb, err) {
    return _fetch(METHODS.post, data, API.search.text.searchLace, cb, err);
}
// 文本搜花-公司搜索
// searchCompany: '/company/search'
export function searchCompany(data, cb, err) {
    return _fetch(METHODS.post, data, API.search.text.searchCompany, cb, err);
}