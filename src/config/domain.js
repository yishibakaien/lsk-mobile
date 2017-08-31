'use strict';

var env = 'prod';

var baseURL = (function(env) {
    var urls = {
        test: 'http://192.168.2.11:8080',
        prod: 'https://api.ts57.cn'
    };
    return urls[env];
})(env);

module.exports = baseURL;
