require('common/styles/base/widget/pull_up_load.styl');

/**
 * 加载不同分页数据的方法，常用于上拉加载更多
 * @param  {[type]} hasmore    是否有更多数据
 * @param  {[type]} ajaxFn     请求数据的 ajax 方法
 * @param  {[type]} parentNode 渲染的结果插入的 node 
 * @return {[type]}            [description]
 */
export function pullUpLoad(hasmore, ajaxFn, parentNode) {
    var loadingZone;
    if (!parentNode) {
        parentNode = document.body;
    }
    if (!document.querySelector('.cbui-loading-zone')) {
        loadingZone = document.createElement('div');
        loadingZone.className = 'cbui-loading-zone';
        var tplStr = `<div class="load-more">上拉加载更多</div>
          <div class="loading-tip">
            <span class="loading-icon"></span>
            <span class="loading-text">正在加载中</span>
          </div>
          <div class="no-more">
            <span class="caret"></span>
            <span class="no-more-text">没有更多了</span>
            <span class="caret"></span>
          </div>`;
        loadingZone.innerHTML = tplStr;
        parentNode.appendChild(loadingZone);
    } else {
        loadingZone = document.querySelector('.cbui-loading-zone');
    }
    
    var loadMore = loadingZone.getElementsByClassName('load-more')[0];
    var loadingTip = loadingZone.getElementsByClassName('loading-tip')[0];
    var noMore = loadingZone.getElementsByClassName('no-more')[0];

    loadingZone.style.display = 'block';

    if (hasmore) {
        showLoadMore();
    } else {
        showNoMore();
        parentNode.onscroll = null;
        return;
    }

    var f = debounce(scroll, 300);
    parentNode.onscroll = f;

    function scroll() {
        if (hasmore) {
            if (getScrollTop() + getClientHeight() === getScrollHeight()) {
                showLoadingTip();
                typeof ajaxFn === 'function' && ajaxFn();
            }
        }
    }

    function showLoadMore() {
        loadMore.style.display = 'block';
        loadingTip.style.display = 'none';
        noMore.style.display = 'none';
    }
    function showLoadingTip() {
        loadMore.style.display = 'none';
        loadingTip.style.display = 'block';
        noMore.style.display = 'none';
    }
    function showNoMore() {
        loadMore.style.display = 'none';
        loadingTip.style.display = 'none';
        noMore.style.display = 'block';
    }
}

// 获取滚动条当前的位置 
function getScrollTop() { 
    var scrollTop = 0; 
    if (document.documentElement && document.documentElement.scrollTop) { 
        scrollTop = document.documentElement.scrollTop; 
    } else if (document.body) { 
        scrollTop = document.body.scrollTop; 
    } 
    return scrollTop; 
} 

// 获取当前可视范围的高度 
function getClientHeight() { 
    var clientHeight = 0; 
    if (document.body.clientHeight && document.documentElement.clientHeight) { 
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight); 
    } else { 
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight); 
    } 
    return clientHeight; 
} 

// 获取文档完整的高度 
function getScrollHeight() { 
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); 
}

/**
 * 节流函数
 * @param  {Function} fn    被节流的函数
 * @param  {[type]}   delay 延迟
 * @return {[type]}         [description]
 */
function debounce(fn, delay) {
    var timer = null;
    return function() {
        var _this = this;
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(function() {
            fn.apply(_this, args);
        }, delay);
    }
}