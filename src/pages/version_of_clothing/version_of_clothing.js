require('common/styles/index.styl');
require('./version_of_clothing.styl');

import wx from 'weixin-js-sdk';
import Toast from 'plugins/toast/Toast';

var pullUpLoad = require('common/scripts/pull_up_load').pullUpLoad;

import {
    c,
    // formatProduceShape,
    // getDateDiff,
    // formatUserName
} from 'utils/utils';

import {
    listClothes
} from 'api/user';

(function () {
    var clothWrapper = c('#clothWrapper');
    var neverPrompt = c('#neverPrompt');
    var close = c('#close');
    var tipWrapper = c('#tipWrapper');

    var picArr = [];
    var getClothParamas = {
        pageNo: 1,
        pageSize: 10
    };
    geCloth();
    function geCloth() {
        listClothes(getClothParamas, function (res) {
            console.log('获取版衣列表', res);
            var list = res.data.list;
            var listStr = '';
            for (var i = 0; i < list.length; i++) {
                var productListStr = '';
                for (var k =0; k < list[i].clothesProductList.length; k++) {
                    productListStr += `<img class="product-pic" item-id="${list[i].clothesProductList[k].productId}" src="${list[i].clothesProductList[k].productUrl}">`;
                }
                picArr.push(list[i].clothesPic);
                var div = document.createElement('div');
                div.setAttribute('data-id', list[i].id);
                div.className = 'version-of-clothing';
                listStr = `<div  class="left">
                    <img class="cloth-pic" src="${list[i].clothesPic}">
                </div>
                <div class="right">
                    <div class="top">
                        <div class="product-name">${list[i].clothesName}</div>
                        <div class="product-num">LSK-20706021/6013</div>
                    </div>
                    <div class="middle">
                        <div>${list[i].memo}</div>
                    </div>
                    <div class="bottom">
                        ${productListStr}
                    </div>
                </div>`;
                div.innerHTML = listStr;
                // div.onclick = function () {
                //     var id = this.getAttribute('data-id');
                //     console.log(id);
                // };
                var productPics =  div.getElementsByClassName('product-pic');
                for (var n = 0; n < productPics.length; n++) {
                    productPics[n].onclick = function () {
                        // e.cancelBubble = true;
                        // e.stopPropagation();
                        var productId = this.getAttribute('item-id');
                        location.href = './pattern_detail.html?dataId=' + productId;
                    };
                }
                clothWrapper.insertBefore(div, document.querySelector('.cloth-flag'));
            }
            // 版衣图片点击大图
            var clothPic = document.querySelectorAll('.cloth-pic');
            Array.prototype.forEach.call(clothPic, function (item) {
                item.onclick = function () {
                    wx.previewImage({
                        current: this.getAttribute('src'),
                        urls: picArr
                    });
                };
            });
            var hasMore = res.data.pageNO < res.data.totalPage;
            console.log('hasMore值:', hasMore);
            if (hasMore) {
                getClothParamas.pageNo++;
            }
            pullUpLoad(hasMore, geCloth, clothWrapper);
        });
    }
    if (localStorage['x-token']) {
        if (localStorage['tipIsNever'] !== '1') {
            tipWrapper.style.display = 'block';
            close.onclick = function () {
                tipWrapper.style.display = 'none';
            };
            neverPrompt.onclick = function () {
                tipWrapper.style.display = 'none';
                localStorage['tipIsNever'] = 1;
            };
        }
    }

})();