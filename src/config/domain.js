'use strict';

var env = 'test';

var conf = (function(env) {
    var urls = {
        test: 'http://zsbgdev.ngrok.cc',
        prod: 'https://api.ts57.cn'
    };
    // 阿里云OSS配置
    var region = {
        test: 'oss-cn-shanghai', // 测试环境上海
        prod: 'oss-cn-shenzhen' // 生产环境深圳
    };
    var secure = {
        test: false, // 测试环境安全项 false
        prod: true // 生产环境安全项 true
    };
    return {
        url: urls[env],
        region: region[env],
        secure: secure[env]
    };
})(env);

module.exports = conf;
