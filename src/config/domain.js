'use strict';

var env = process.env.NODE_ENV;
// var env = 'test';

var conf = (function(env) {
    var urls = {
        // dev: 'http://zsbgdev.ngrok.cc',
        dev: 'http://zsbg1.free.ngrok.cc',
        prod: 'https://api.ts57.cn',
        // 广州内网接口地址
        test: 'http://192.168.8.212:9090'
    };
    // 阿里云OSS配置
    var region = {
        dev: 'oss-cn-shanghai', // 测试环境上海
        prod: 'oss-cn-shenzhen' // 生产环境深圳
    };
    var secure = {
        dev: false, // 测试环境安全项 false
        prod: true // 生产环境安全项 true
    };
    return {
        url: urls[env],
        region: region[env],
        secure: secure[env]
    };
})(env);

module.exports = conf;
