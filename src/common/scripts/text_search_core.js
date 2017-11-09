import {searchLace} from 'api/search.js';
import {searchCompany} from 'api/search.js';
// 搜花
export function textSearch(options, cb, err) {
    console.log('文本搜索参数', options);
    var defaultOptions = {
        categorys: '',
        dateSort: 2,
        isStock: 1,
        keywords: '',
        pageNo: 1,
        pageSize: 10,
        settledLands: ''
    };
    for (var key in options) {
        if (options[key]) {
            defaultOptions[key] = options[key];
        }
    }
    // 因为 isStock(库存类型) 字段 type number  0:没有库存 1:有库存
    if (options['isStock'] === 0) {
        defaultOptions['isStock'] = 0;
    }

    var opt = defaultOptions;
    console.log('最终参数', opt);
    searchLace(opt, function(res) {
        typeof cb === 'function' && cb(res);
    }, function(res) {
        typeof err === 'function' && err(res);
    });
}
// 搜厂，滴调用原ts57搜厂接口
export function textSearchCompany(options, cb, err) {
    console.log('文本搜索参数', options);
    var defaultOptions = {
        companyName: '',
        companyType: 1,
        pageNo: 1,
        pageSize: 10
    };
    for (var key in options) {
        if (options[key]) {
            defaultOptions[key] = options[key];
        }
    }

    var opt = defaultOptions;
    console.log('最终参数', opt);
    searchCompany(opt, function(res) {
        typeof cb === 'function' && cb(res);
    }, function(res) {
        typeof err === 'function' && err(res);
    });
}