'use strict';

const _fetch = require('./fetch/fetch');

const API = {
    user: {
        checkPhone: '/front/user/checkPhone' // 检查手机号码是否存在
    }
};

// 检查手机号码，此接口没有跨域问题
export function checkPhone(data, cb, err) {
    return _fetch('GET', data, API.user.checkPhone, cb, err);
}