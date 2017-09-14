
'use strict';

const _fetch = require('./fetch/fetch');

const API = {
    oss: {
        token: '/file/token'
    }
};

export function token(data, cb, err) {
    return _fetch('POST', data, API.oss.token, cb, err);
}
