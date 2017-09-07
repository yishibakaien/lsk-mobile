require('./text_search_result.styl');

import {c, getQueryString, formatMoney, formatBgPic} from 'utils/utils';
import {textSearch} from 'common/scripts/text_search_core';
import Toast from 'plugins/toast/Toast';

var keywords = getQueryString('keywords');
c('#text').innerHTML = keywords;

Toast.loading('正在搜索中');

var wrapper = document.querySelector('.patterns-list-wrapper');

var textSearchParamas = {
    keywords: keywords,
    pageNo: 1,
    pageSize: 10
};

textSearch(textSearchParamas, function(res) {
    Toast.hide();
    console.log('文本搜索结果', res);
    render(res, wrapper, function() {

    });
}, function(res) {
    Toast.info('搜索失败');
    c('#noResultTip').style.display = 'block';
});

function render(res, dom, cb) {
    var list = res.data.list;
    var str = '';
    for (let item of list) {
        str += `<div class="patterns">
            <div class="img" style="background-image:${formatBgPic(item.defaultPicUrl, 300)}"></div>
            <p class="number">${item.productNo}</p>
            <p class="price">${formatMoney(item.price, item.priceUnit)}</p>
        </div>`;
    }
    dom.innerHTML = str;
}