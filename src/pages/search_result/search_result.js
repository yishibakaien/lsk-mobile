import {getQueryString} from 'utils/utils';
import {
    // 获取图片搜索结果
    getResult
} from 'api/search.js';

var searchId = getQueryString('searchId');

var getResultQueryParams = {
    id: searchId,
    pageNo: 1,
    pageSize: 20
};

getResult(getResultQueryParams, function(res) {
    // mockData.res = 1;
    console.log(res);
    if (res.data.list.length === 0) {
        Toast.info('未找到相似花型', 2000);
    }
    document.querySelector('div').innerHTML = JSON.stringify(res.data);
    // htmlHandler(res, searchResultBox, PIC_RESULT);
});
console.log(searchId);