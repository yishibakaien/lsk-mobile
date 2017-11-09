require('./text_search_company_result.styl');
// require('common/styles/base/widget/pull_up_load.styl');

import {c, getQueryString} from 'utils/utils';
import {textSearchCompany} from 'common/scripts/text_search_core';
import Toast from 'plugins/toast/Toast';
import {pullUpLoad} from 'common/scripts/pull_up_load'; // 上拉加载更多
import {render} from 'common/scripts/render_company_list';

var keywords = getQueryString('keywords');
c('#text').innerHTML = keywords;

Toast.loading('正在搜索中');

var wrapper = document.querySelector('.list-wrapper');

// 文本搜索请求参数
var textSearchParamas = {
    companyName: keywords,
    companyType: 1,
    pageNo: 1,
    pageSize: 10
};

doSearch();
function doSearch() {
    textSearchCompany(textSearchParamas, function(res) {
        Toast.hide();
        // 如果 第一页 且 没有返回结果，则说明找不到对应商家，需要给予提示
        if (res.data.list.length === 0 && textSearchParamas.pageNo === 1) {
            c('#noResultTip').style.display = 'block';
            return;
        }
        console.log('文本搜索结果', res);

        var list = res.data.list;

        render(list, wrapper, function() {
            var hasmore = (res.data.pageNO < res.data.totalPage) ? true : false;
            if (hasmore) {
                textSearchParamas.pageNo++;
            }
            pullUpLoad(hasmore, doSearch);
        });
    }, function(res) {
        Toast.info('搜索失败');
        // 请求失败了，如果在 第一页，则说明找不到对应商家，需要给予提示
        if (textSearchParamas.pageNo === 1) {
            c('#noResultTip').style.display = 'block';
            pullUpLoad(false, doSearch);
            return;
        }
        pullUpLoad(true, doSearch);
    });
}
