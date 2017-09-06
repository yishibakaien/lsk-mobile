require('./text_search_result.styl');

import {c, getQueryString} from 'utils/utils';
import {textSearch} from 'common/scripts/text_search_core';
import Toast from 'plugins/toast/Toast';

var keywords = getQueryString('keywords');
c('#text').innerHTML = keywords;

Toast.loading('正在搜索中');

var textSearchParamas = {
    keywords: keywords,
    pageNo: 1,
    pageSize: 10
};

textSearch(textSearchParamas, function(res) {
    Toast.hide();
    console.log('文本搜索结果', res);

}, function(res) {
    Toast.info('搜索失败');
    c('#noResultTip').style.display = 'block';
});

