'use strict';

const _fetch = require('./fetch/fetch');

const METHODS = {
    post: 'POST',
    get: 'GET'
};

const API = {
    search: {
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
    }
};

// 搜索
export function search(data, cb, err) {
    return _fetch(METHODS.post, data, API.search.search, cb, err);
}
// 图片搜索
export function encoded(data, cb, err) {
    return _fetch(METHODS.post, data, API.search.encoded, cb, err);
}
// 图片搜索结果 轮询
export function polling(data, cb, err) {
    let _data = data;
    let url = API.search.polling.toString() + _data.searchKey.toString();
    return _fetch(METHODS.get, {}, url, cb, err);
}
// 通过url搜索 图片
export function urlSearch(data, cb, err) {
    return _fetch(METHODS.post, data, API.search.url, cb, err);
}

// 获取搜索结果 图片
export function getResult(data, cb, err) {
    return _fetch(METHODS.get, data, API.search.getResult, cb, err);
}