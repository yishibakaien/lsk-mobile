require('common/styles/index.styl');
require('./supply_purchase_info.styl');
require('plugins/swiper/swiper-3.4.2.min.js');
import wx from 'weixin-js-sdk';
import Toast from 'plugins/toast/Toast';

var pullUpLoad = require('common/scripts/pull_up_load').pullUpLoad;

import {
    c,
    formatProduceShape,
    getDateDiff,
    formatUserName
} from 'utils/utils';

import {
    listHomeCompanySupplys,
    listHomeProductBuys
} from 'api/user';

(function () {
    var headRight = c('#headRight');
    var supplyWrapper = c('#supplyWrapper');
    var buyingWrapper = c('#buyingWrapper');
    var swiperTag = c('.swiper-tag')[0].getElementsByTagName('span');

    var userType = localStorage.userType;
    console.log((userType === '2'));
    console.log((userType));
    var isSettled = localStorage.isSettled;
    var text = [
        {
            text: '发布供应',
            link: './publish_supply.html'
        },
        {
            text: '发布求购',
            link: './publish_buying.html'
        }
    ];
    if (userType === '1') {
        text[0].text = '发布求购';
        text[0].link = './publish_buying.html';
    }
    headRight.innerHTML = text[0].text;
    headRight.setAttribute('href', text[0].link);

    var getSupplyParamas = {
        supplyShapes: '',
        supplyTypes: '',
        pageNo: 1,
        pageSize: 10
    };
    var getBuyingParamas = {
        buyTypes: '',
        // isStartUp: '', pc端用
        buyShapes: '',
        pageNo: 1,
        pageSize: 5
    };


    getSupply();
    getBuying();
    // 获取供应列表
    function getSupply() {
        listHomeCompanySupplys(getSupplyParamas, function (res) {
            console.log('首页供应列表', res);
            var list = res.data.list;
            var listStr = '';
            for (var i = 0; i < list.length; i++) {
                var div = document.createElement('div');
                div.setAttribute('data-id', list[i].id);
                div.className = 'item';
                listStr = `<div class="avatar-wrapper border-bottom">
                        <img src="${list[i].userHeadIcon}">
                        <div>${formatUserName(list[i].userName)}</div>
                    </div>
                    <div class="product-info">
                        <img src="${list[i].buyPicUrl}">
                        <div class="text">
                            <div class="brief">${list[i].supplyDesc}</div>
                            <div class="type">${formatProduceShape(list[i].supplyType)}</div>
                            <div class="time">${getDateDiff(new Date(list[i].createDate))}</div>
                        </div>
                    </div>`;
                div.innerHTML = listStr;

                div.onclick = function () {
                    var id = this.getAttribute('data-id');
                    console.log(id);
                    Toast.info('为了保密，供应详情仅对服装端用户公开', 1000);
                };
                supplyWrapper.insertBefore(div, document.querySelector('.supply-flag'));
            }
            var hasMore = res.data.pageNO < res.data.totalPage;
            console.log('hasMore值:', hasMore);
            if (hasMore) {
                getSupplyParamas.pageNo++;
            }
            pullUpLoad(hasMore, getSupply, supplyWrapper);
        });
    }
    // 获取求购列表
    function getBuying() {
        listHomeProductBuys(getBuyingParamas, function (res) {
            console.log('首页求购列表', res);
            var list = res.data.list;
            var listStr = '';
            for (var i = 0; i < list.length; i++) {
                var div = document.createElement('div');
                div.setAttribute('data-id', list[i].id);
                div.className = 'item';
                listStr = `<div class="avatar-wrapper border-bottom">
                        <img src="${list[i].userHeadIcon}">
                        <div>${isSettled ? list[i].userName : formatUserName(list[i].userName)}</div>
                    </div>
                    <div class="product-info">
                        <img src="${list[i].buyPicUrl}">
                        <div class="text">
                            <div class="brief">${list[i].buyDesc}</div>
                            <div class="status">${((list[i].buyStatus) ? '求购中' : '已完成')}</div>
                            <div class="time">${getDateDiff(list[i].createDate)}</div>
                        </div>
                    </div>`;
                div.innerHTML = listStr;

                div.onclick = function () {
                    var id = this.getAttribute('data-id');
                    console.log(id);
                    if (isSettled) {
                        location.href = './purchase_detail.html?' + id;
                    } else {
                        Toast.info('为了保密，求购详情仅对蕾丝控商家公开', 1000);
                    }

                };
                buyingWrapper.insertBefore(div, document.querySelector('.buying-flag'));
            }
            var hasMore = res.data.pageNO < res.data.totalPage;
            console.log('hasMore值:', hasMore);
            if (hasMore) {
                getBuyingParamas.pageNo++;
            }
            pullUpLoad(hasMore, getBuying, buyingWrapper);
        });
    }


    var contentSwiper = new Swiper('.swiper-container', {
        onSlideChangeEnd: swiperControl,
        spaceBetween: 30
    });

    (function slideControl() {
        for (var i = 0; i < swiperTag.length; i++) {
            (function (i) {
                swiperTag[i].addEventListener('click', function () {
                    contentSwiper.slideTo(i, 300, false);
                    swiperControl(contentSwiper);
                }, false);
            })(i);
        }
    })();

    function swiperControl(swiper) {
        for (var i = 0; i < swiperTag.length; i++) {
            swiperTag[i].className = swiperTag[i].className.replace('active', '');
        }
        swiperTag[swiper.activeIndex].className += ' active';
        headRight.innerHTML = text[swiper.activeIndex].text;
        headRight.setAttribute('href', text[swiper.activeIndex].link);
    }
})();



