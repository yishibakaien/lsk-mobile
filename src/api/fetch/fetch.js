'use strict';

const Ajax = require('./ajax');

const Toast = require('cbui-toast');

const headers = require('config/headers');

const baseURL = require('config/domain');

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

    let _headers = headers;

    let param = {
        method: method,
        url: baseURL + url,
        headers: _headers,
        data: _formatData(method, data),
        success: function(res) {
            if (res.code !== 0) {
                Toast.info('请求错误:' + res.message, 2100);
                return;
            }
            if (typeof cb === 'function') {
                
                cb(res);
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
