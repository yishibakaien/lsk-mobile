'use strict';

var env = 'test';

var baseURL = (function(env) {
    var urls = {
        test: 'http://zsbgdev.ngrok.cc',
        prod: 'https://api.ts57.cn'
    };
    return urls[env];
})(env);

module.exports = baseURL;
