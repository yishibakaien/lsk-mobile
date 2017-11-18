require('./text_search_result.styl');
// require('common/styles/base/widget/pull_up_load.styl');

import {c, getQueryString} from 'utils/utils';
import {textSearchPattern} from 'common/scripts/text_search_core';
import {textSearchCompany} from 'common/scripts/text_search_core';
import Toast from 'plugins/toast/Toast';
import {pullUpLoad} from 'common/scripts/pull_up_load'; // 上拉加载更多
import {renderPattern} from 'common/scripts/render_patterns_list';
import {renderFirm} from 'common/scripts/render_company_list';
var keywords = getQueryString('keywords');
c('#text').innerHTML = keywords;
var patternResult = c('#patternResult');
var firmResult = c('#firmResult');
Toast.loading('正在搜索中');

var patternWrapper = document.querySelector('.patterns-list-wrapper');
var firmWrapper = document.querySelector('.new-settled-list-wrapper');

// 花型搜索文本搜索请求参数
var textSearchParamasPattern = {
    keywords: keywords,
    pageNo: 1,
    pageSize: 10
};
// 厂家搜索文本搜索请求参数
var textSearchParamasFirm = {
    companyName: keywords,
    companyType: 1,
    pageNo: 1,
    pageSize: 10
};
doPatternSearch();

patternResult.onclick = function () {
    var pullLoadingZone = c('.cbui-loading-zone')[0];
    if (pullLoadingZone) {
        pullLoadingZone.parentNode.removeChild(pullLoadingZone);
    }
    firmWrapper.innerHTML = '';
    textSearchParamasPattern.pageNo = 1;
    c('#noResultTip').style.display = 'none';


    Toast.loading('正在搜索中');
    patternResult.className = 'active';
    firmResult.className = '';
    doPatternSearch();
};
firmResult.onclick = function () {
    var pullLoadingZone = c('.cbui-loading-zone')[0];
    console.log('c(\'.cbui-loading-zone\')[0]', pullLoadingZone);
    if (pullLoadingZone) {
        pullLoadingZone.parentNode.removeChild(pullLoadingZone);
    }
    patternWrapper.innerHTML = '';
    textSearchParamasFirm.pageNo = 1;
    c('#noResultTip').style.display = 'none';

    Toast.loading('正在搜索中');
    patternResult.className = '';
    firmResult.className = 'active';
    doFirmSearch();
};
function doPatternSearch() {
    textSearchPattern(textSearchParamasPattern, function(res) {
        Toast.hide();
        // 如果 第一页 且 没有返回结果，则说明找不到对应花型，需要给予提示
        if (res.data.list.length === 0 && textSearchParamasPattern.pageNo === 1) {
            c('#noResultTip').style.display = 'block';
            return;
        }
        console.log('花型搜索文本搜索结果', res);

        var list = res.data.list;

        renderPattern(list, patternWrapper, function() {
            var hasmore = (res.data.pageNO < res.data.totalPage) ? true : false;
            if (hasmore) {
                textSearchParamasPattern.pageNo++;
            }
            pullUpLoad(hasmore, doPatternSearch);
        });
    }, function(res) {
        Toast.info('搜索失败');
        // 请求失败了，如果在 第一页，则说明找不到对应花型，需要给予提示
        if (textSearchParamasPattern.pageNo === 1) {
            c('#noResultTip').style.display = 'block';
            pullUpLoad(false, doPatternSearch);
            return;
        }
        pullUpLoad(true, doPatternSearch);
    });
}

function doFirmSearch() {
    textSearchCompany(textSearchParamasFirm, function(res) {
        Toast.hide();
        // 如果 第一页 且 没有返回结果，则说明找不到对应商家，需要给予提示
        if (res.data.list.length === 0 && textSearchParamasFirm.pageNo === 1) {
            c('#noResultTip').style.display = 'block';
            return;
        }
        console.log('厂家搜索文本搜索结果', res);

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
