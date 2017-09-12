import {formatBgPic, formatMoney} from 'utils/utils';

/**
 * 渲染搜索结果列表，一般是花型列表页
 * @param  {[type]}   list       花型列表数组
 * @param  {[type]}   parentNode 花型列表需要插入的节点
 * @param  {Function} cb         渲染完毕后的回调函数
 */
export function render(list, parentNode, cb) {
    var pattensList = [];

    // 按照 是否开通会员(isBest === 1) 进行排序
    list.sort(function(a, b) {
        return b.isBest - a.isBest;
    });
    for (let item of list) {
        var pattern = document.createElement('div');
        pattern.className = 'patterns';
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
        item.onclick = function() {
            var dataId = this.getAttribute('data-id');
            console.log(dataId);
        };
        parentNode.appendChild(item);
    }
    typeof cb === 'function' && cb();
}
