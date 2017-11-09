import {formatBgPic, formatMoney} from 'utils/utils';

/**
 * 渲染搜索结果列表，一般是花型列表页
 * @param  {[type]}   list       花型列表数组
 * @param  {[type]}   parentNode 花型列表需要插入的节点
 * @param  {Function} cb         渲染完毕后的回调函数
 */
export function render(list, parentNode, cb) {
    var List = [];

    // 按照 是否开通会员(isBest === 1) 进行排序
    // list.sort(function(a, b) {
    //     return b.isBest - a.isBest;
    // });
    for (let item of list) {
        var company = document.createElement('div');
        company.className = 'patterns';
        company.setAttribute('data-id', item.id);
        company.innerHTML = `<div class="new-settled-item">
                        <div class="new-settled-info">
                            <img src="${item.companyHeadIcon}">
                            <div class="new-settled-info-text">
                                <div class="firm-name">${item.companyName}</div>
                                <div class="phone"><i class="icon-shouji"></i>${item.phone}</div>
                                <div class="time">2017-03-12</div>
                            </div>
                        </div>
                        <div class="btn clearfix" data-id="${item.id}">进入官网</div>
                    </div>`;
            // `<div class="img" style="background-image:${formatBgPic(item.defaultPicUrl, 300)}">
            //     <div class="recomend" style="display:${item.isBest === 1 ? 'block' : 'none'}">推荐</div>
            // </div>
            // <p class="number">${item.productNo}</p>
            // <p class="price">${formatMoney(item.price, item.priceUnit)}</p>`;
        // console.log({}.toString.call(pattern));
        var btn = company.getElementsByClassName('btn')[0];
        btn.onclick = function () {
            var dataId = this.getAttribute('data-id');
            console.log(dataId);
            location.href = 'https://www.ts57.cn/microWebsite/index.html?companyId=' + dataId;
        };
        List.push(company);
    }
    for (let item of List) {
        // item.onclick = function() {
        //     var dataId = this.getAttribute('data-id');
        //     console.log(dataId);
        //     location.href = 'https://www.ts57.cn/microWebsite/index.html?companyId=' + id;
        // };
        parentNode.appendChild(item);
    }
    typeof cb === 'function' && cb();
}
