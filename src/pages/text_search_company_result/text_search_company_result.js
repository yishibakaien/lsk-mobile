require('./text_search_company_result.styl');
// require('common/styles/base/widget/pull_up_load.styl');

import {c, getQueryString} from 'utils/utils';
import {textSearchCompany} from 'common/scripts/text_search_core';
import Toast from 'plugins/toast/Toast';
import {pullUpLoad} from 'common/scripts/pull_up_load'; // 上拉加载更多
import {renderFirm} from 'common/scripts/render_company_list';

var keywords = getQueryString('keywords');
c('#text').innerHTML = keywords;

Toast.loading('正在搜索中');

var firmWrapper = document.querySelector('.list-wrapper');

// 厂家搜索文本搜索请求参数
var textSearchParamasFirm = {
    companyName: keywords,
    companyType: 1,
    pageNo: 1,
    pageSize: 10
};

doFirmSearch();
function doFirmSearch() {
    textSearchCompany(textSearchParamasFirm, function(res) {
        Toast.hide();
        // 如果 第一页 且 没有返回结果，则说明找不到对应商家，需要给予提示
        if (res.data.list.length === 0 && textSearchParamasFirm.pageNo === 1) {
            c('#noResultTip').style.display = 'block';
            return;
        }
        console.log('文本搜索结果', res);

        var list = res.data.list;

        renderFirm(list, firmWrapper, function() {
            var hasmore = (res.data.pageNO < res.data.totalPage) ? true : false;
            if (hasmore) {
                textSearchParamasFirm.pageNo++;
            }
            pullUpLoad(hasmore, doFirmSearch);
        });
    }, function(res) {
        Toast.info('搜索失败');
        // 请求失败了，如果在 第一页，则说明找不到对应商家，需要给予提示
        if (textSearchParamasFirm.pageNo === 1) {
            c('#noResultTip').style.display = 'block';
            pullUpLoad(false, doFirmSearch);
            return;
        }
        pullUpLoad(true, doFirmSearch);
    });
}
