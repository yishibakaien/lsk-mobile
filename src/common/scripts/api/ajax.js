'use strict';
/**
 * ajax 封装
 * 这里将会自动添加 headers x-client x-version
 */
function Ajax(opts) {
    let defaults = {
        method: 'GET',
        url: '',
        data: '',
        async: true,
        cache: true,
        contentType: 'text/plain',
        headers: {},
        timeout: 10000,
        success: function() {},
        error: function() {}
    };
    // 为defaults赋值
    for (let key in opts) {
        defaults[key] = opts[key];
    }
    // 将data转为str
    if (typeof defaults.data === 'object') {
        let str = '';
        for (let key in defaults.data) {
            str += key + '=' + defaults.data[key] + '&';
        }
        defaults.data = str.substring(0, str.length - 1);
    }

    // 处理请求方式
    defaults.method = defaults.method.toUpperCase();
    // 处理cache
    defaults.cache = defaults.cache ? '' : '&' + new Date().getTime();

    // 处理url 拼接字符串
    if (defaults.method === 'GET' && (defaults.data || defaults.cache)) {
        
        defaults.url += '?' + defaults.data + defaults.cache;
    }
    // 创建ajax 对象
    const xhr = new XMLHttpRequest();

    // console.info(defaults.method);
    xhr.open(defaults.method, defaults.url, defaults.async);

    // 设置header
    for (let key in defaults.headers) {
        if (!defaults.headers.hasOwnProperty(key)) {
            continue;
        }
        xhr.setRequestHeader(key, defaults.headers[key]);
        // console.log(xhr)
    }

    // 处理 GTE POST
    if (defaults.method === 'GET') {
        xhr.send(null);
    } else if (defaults.method === 'POST') {

        xhr.setRequestHeader('Content-Type', defaults.contentType);
        xhr.send(defaults.data);
    }
    let timer = setTimeout(function() {
        if (!(xhr.readyState === 4 && xhr.status === 200)) {
            xhr.abort();
            defaults.error({ message: '请求超时' });
        }
    }, defaults.timeout);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // console.log('xhr', xhr.responseText);
                let response = JSON.parse(xhr.responseText);
                clearTimeout(timer);
                defaults.success.call(xhr, response, xhr.status, xhr);
            } else {
                clearTimeout(timer);
                defaults.error(xhr.responseText);
            }
        }
    };
}

export {
    Ajax
};
