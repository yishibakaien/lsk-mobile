require('common/styles/index.styl');
require('./pic_search_result.styl');
import Toast from 'plugins/toast/Toast';
import {c, getQueryString, formatMoney, formatPicUrl} from 'utils/utils';
import {
    // 获取图片搜索结果
    getResult
} from 'api/search.js';

var searchId = getQueryString('searchId');

(function() {
    if (!searchId) {
        document.querySelector('.noresult-tip').style.display = 'block';
        return;
    }
    var getResultQueryParams = {
        id: searchId,
        pageNo: 1,
        pageSize: 20
    };

    getResult(getResultQueryParams, function(res) {
        if (!getResultQueryParams.searchId) {
            return;
        }
        console.log(res);
        if (res.data.list.length === 0) {
            Toast.info('未找到相似花型', 2000);
        }
        document.querySelector('div').innerHTML = JSON.stringify(res.data);
        // htmlHandler(res, searchResultBox, PIC_RESULT);
    });
})();
