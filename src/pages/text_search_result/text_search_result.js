require('./text_search_result.styl');
require('common/styles/base/widget/pull_up_load.styl');

import {c, getQueryString, formatMoney, formatBgPic} from 'utils/utils';
import {textSearch} from 'common/scripts/text_search_core';
import Toast from 'plugins/toast/Toast';
import {pullUpLoad} from 'common/scripts/pull_up_load';

var keywords = getQueryString('keywords');
c('#text').innerHTML = keywords;

Toast.loading('正在搜索中');

var wrapper = document.querySelector('.patterns-list-wrapper');

var textSearchParamas = {
    keywords: keywords,
    pageNo: 1,
    pageSize: 10
};

doSearch();
function doSearch() {
    textSearch(textSearchParamas, function(res) {
        Toast.hide();
        console.log('文本搜索结果', res);
        render(res, wrapper, function() {
            // console.log(11);
            var patterns = document.querySelectorAll('.patterns');
            for (let item of patterns) {
                item.onclick = null;
                item.onclick = function() {
                    var dataId = this.getAttribute('data-id');
                    console.log(dataId);
                };
            }
            var hasmore = res.data.pageNO < res.data.totalPage ? true : false;
            if (hasmore) {
                textSearchParamas.pageNo++;
            } else {
                return;
            }
            pullUpLoad(hasmore, doSearch);
        });
    }, function(res) {
        Toast.info('搜索失败');
        c('#noResultTip').style.display = 'block';
    });
}
function render(res, dom, cb) {
    var list = res.data.list;
    var pattensList = [];
    // 按照 是否开通会员(isBest === 1) 进行排序
    list.sort(function(a, b) {
        return b.isBest - a.isBest;
    });
    for (let item of list) {
        var pattern = document.createElement('div');
        pattern.setAttribute('data-id', item.id);
        pattern.innerHTML = `<div class="img" style="background-image:${formatBgPic(item.defaultPicUrl, 300)}">
                <div class="recomend" style="display:${item.isBest === 1 ? 'block' : 'none'}">推荐</div>
            </div>
            <p class="number">${item.productNo}</p>
            <p class="price">${formatMoney(item.price, item.priceUnit)}</p>`;
        // console.log({}.toString.call(pattern));
        pattensList.push(pattern);
    }
    for (let item of pattensList) {
         // console.log({}.toString.call(item), item);
        dom.appendChild(item);
    }
    typeof cb === 'function' && cb();
}