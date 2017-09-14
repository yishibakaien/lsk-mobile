'use strict';

const Ajax = require('./ajax');

const Toast = require('plugins/toast/Toast');

const headers = require('config/headers');

const baseURL = require('config/domain').url;

const METHODS = {
    get: 'GET',
    post: 'POST'
};

function _formatData(method, data) {

    if (!data) {
        return '';
    }
    if (method === METHODS.get) {
        return data;
    } else if (method === METHODS.post) {
        return JSON.stringify(data);
    }
}

function _fetch(method = METHODS.get, data, url, cb, err) {

    if (localStorage['x-token']) {
        headers['x-token'] = localStorage['x-token'];
    }
    let param = {
        method: method,
        url: baseURL + url,
        headers: headers,
        data: _formatData(method, data),
        success: function(res, status, xhr) {
            // if (res.code !== 0) {
            //     Toast.info('请求错误:' + res.message, 2100);
            //     return;
            // }
            if (res.code !== 0) {
                // 用户未登录，清空缓存
                if (res.code === 210018) {
                    localStorage.clear();
                    Toast.info({
                        text: '用户未登录',
                        duration: 2100,
                        complete: function() {
                            location.replace('./login.html?from=' + location.href);
                        }
                    });
                    // Toast.info('用户未登录', 2100, function() {
                    //     location.href = './login.html';
                    // });
                }
            } 
            if (typeof cb === 'function') {

                cb(res, status, xhr);
            }
        },
        error: function(res) {
            Toast.info('请检查网络');
            if (typeof err === 'function') {
                err(res);
            }
        }
    };
    Ajax(param);
}

module.exports = _fetch;
