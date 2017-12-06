import {formatBgPic, formatMoney} from 'utils/utils';
/**
 * 渲染搜索结果列表，一般是花型列表页
 * @param  {[type]}   list       花型列表数组
 * @param  {[type]}   parentNode 花型列表需要插入的节点
 * @param  {Function} cb         渲染完毕后的回调函数
 */
export function patternRender(list, parentNode, flag, cb) {
    var pattensList = [];

    // 按照 是否开通会员(isBest === 1) 进行排序
    list.sort(function(a, b) {
        return b.isBest - a.isBest;
    });
    for (let item of list) {
        var pattern = document.createElement('div');
        pattern.className = 'new-pattern-item';
        pattern.setAttribute('data-id', item.id);
        pattern.innerHTML = `<div class="new-pattern-img" style="background-image:${formatBgPic(item.defaultPicUrl, 300)}">
                <div class="recomend" style="display:${item.isBest === 1 ? 'block' : 'none'}">推荐</div>
            </div>
            <div class="text-wrapper">
                <div class="left">
                    <div class="pattern-num">${item.productNo}</div>
                    <div class="pattern-price">${formatMoney(item.price, item.priceUnit)}</div>
                </div>
                <div class="right" style="display:${item.isShelve === 1 ? 'block' : 'none'}">
                    <img src="../../images/laceshangjia.png" alt="">
                </div>
            </div>`;
        // console.log({}.toString.call(pattern));
        pattensList.push(pattern);
    }
    for (let item of pattensList) {
        item.onclick = function() {
            var dataId = this.getAttribute('data-id');
            console.log(dataId);
            // 10-10菜头添加
            // 跳转前记录innerHTML值
            sessionStorage.recordingHtml = parentNode.innerHTML;
            sessionStorage.offsetTop = parentNode.scrollTop;
            location.href = './pattern_detail.html?dataId=' + dataId;
        };
        parentNode.insertBefore(item, flag);
    }
    typeof cb === 'function' && cb();
}
