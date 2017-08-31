const Ajax = require('./ajax').Ajax;

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
                // blackTip({
                //     type: 'info',
                //     time: 2100,
                //     text: '请求错误:' + res.message
                // });
                return;
            }
            if (typeof cb === 'function') {
                
                cb(res);
            }
        },
        error: function(res) {
            Toast.info('请检查网络');
            // blackTip({
            //     text: '请检查网络',
            //     type: 'info'
            // });
            // 待定 也blackTip 统一处理
            if (typeof err === 'function') {
                err(res);
            }
        }
    };
    Ajax(param);
}