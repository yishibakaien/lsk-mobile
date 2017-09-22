'use strict';

const _fetch = require('./fetch/fetch');

const METHODS = {
    post: 'POST',
    get: 'GET'
};

const API = {
    settled: {
        // 最新入驻商家列表
        listUnSettledCompany: '/company/listUnSettledCompany',

        // 已入驻商家列表(优质商家)
        listSettledCompany: '/company/listSettledCompany'
    }
};

// 最新入驻商家列表
export function listUnSettledCompany(data, cb, err) {
    return _fetch(METHODS.post, data, API.settled.listUnSettledCompany, cb, err);
}

// 已入驻商家列表(优质商家)
export function listSettledCompany(data, cb, err) {
    return _fetch(METHODS.post, data, API.settled.listSettledCompany, cb, err);
}