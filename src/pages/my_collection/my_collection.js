require('common/styles/index.styl');
require('./my_collection.styl');

require('plugins/swiper/swiper-3.4.2.min.js');
var pullUpLoad = require('common/scripts/pull_up_load').pullUpLoad;
import Toast from 'plugins/toast/Toast';

import {
    c,
    formatDate,
    formatUnit,
    getDateDiff,
    formatMoney
} from 'utils/utils';

import {
    listProduct,
    listCompany,
    listSupply,
    getCompanyInfo
} from 'api/user';


(function () {
    var swiperTag = c('.swiper-tag')[0].getElementsByTagName('span');
    var patternWrapper = c('#patternWrapper');
    var firmWrapper = c('#firmWrapper');
    var supplyWrapper = c('#supplyWrapper');
    // 获取收藏花型列表Data
    var patternListData = {
        category: -1,
        isStock: -1,
        pageNo: 1,
        pageSize: 10
    };

    // 获取收藏厂家列表Data
    var firmListData = {
        pageNo: 1,
        pageSize: 10
    };

    // 获取收藏供应列表Data
    var supplyListData = {
        supplyShape: -1,
        supplyType: -1,
        pageNo: 1,
        pageSize: 10
    };
    getPatternList();
    getFirmList();
    getSupplyList();
    // 获取收藏花型列表
    function getPatternList() {
        listProduct(patternListData, function (res) {
            console.log('花型列表', res);
            var list = res.data.list;
            var listStr = '';
            for (var i = 0; i < list.length; i++) {
                var div = document.createElement('div');
                div.setAttribute('data-id', list[i].id);
                div.className = 'info-wrapper';
                listStr = `<div class="info">
                    <img src="${list[i].defaultPicUrl}">
                    <div class="text">
                        <div class="top">${list[i].productNo}</div>
                        <div class="middle ellipsis"><span class="firm-name">${list[i].companyName}</span></div>
                        <div class="bottom"><span class="num">${formatMoney(list[i].price, list[i].priceUnit)}</span></div>
                    </div>
                    <div class="arrow icon-xiayiye"></div>
                </div>`;
                div.innerHTML = listStr;
                div.onclick = function () {
                    var id = this.getAttribute('data-id');
                    console.log(id);
                    location.href = './pattern_detail.html?dataId=' + id;
                };
                patternWrapper.insertBefore(div, document.querySelector('.pattern-flag'));
            }
            var hasMore = res.data.pageNO < res.data.totalPage;
            if (hasMore) {
                patternListData.pageNo++;
            }
            pullUpLoad(hasMore, getPatternList, patternWrapper);
        });
    }
    // 获取收藏厂家列表
    function getFirmList() {
        listCompany(firmListData, function (res) {
            console.log('商家列表', res);
            var list = res.data.list;
            var listStr = '';
            for (var i = 0; i < list.length; i++) {
                var div = document.createElement('div');
                div.setAttribute('data-id', list[i].id);
                div.className = 'info-wrapper';
                listStr = `<div class="info">
                    <div class="text">
                        <div class="top ellipsis big-firm-name ${(list[i].companyType) === 1 ? 'factory' : 'stalls'}">${list[i].companyName}</div>
                        <div class="middle"><span class="key">主营:&nbsp;</span><span class="name">${list[i].companyBusiness}</span></div>
                        <div class="bottom">共上架&nbsp;<span class="num">${list[i].productCount}</span>&nbsp;件花型</div>
                    </div>
                    <div class="arrow icon-xiayiye"></div>
                </div>`;
                div.innerHTML = listStr;

                div.onclick = function () {
                    var id = this.getAttribute('data-id');
                    getCompanyInfo({id}, function (res) {
                        console.log('获取档口OR工厂信息', res);
                        if (res.data.indexName) {
                            location.href = 'http://' + res.data.indexName + '.lacewang.cn';
                        }
                    });
                    console.log(id);
                };
                firmWrapper.insertBefore(div, document.querySelector('.firm-flag'));
            }
            var hasMore = res.data.pageNO < res.data.totalPage;
            if (hasMore) {
                patternListData.pageNo++;
            }
            pullUpLoad(hasMore, getFirmList, firmWrapper);
        });
    }
    // 获取收藏供应列表
    function getSupplyList() {
        listSupply(supplyListData, function (res) {
            console.log('供应列表', res);
            var list = res.data.list;
            var listStr = '';
            for (var i = 0; i < list.length; i++) {
                var div = document.createElement('div');
                div.setAttribute('data-id', list[i].id);
                div.className = 'info-wrapper';
                listStr = `<div class="info">
                    <img src="${list[i].defaultPicUrl}">
                    <div class="text">
                        <div class="top ellipsis-two">${list[i].supplyDesc}</div>
                        <div class="middle ellipsis"><span class="firm-name">${list[i].companyName}</span></div>
                        <div class="bottom"><span class="time">${getDateDiff(res.data.createDate)}</span></div>
                    </div>
                    <div class="arrow icon-xiayiye"></div>
                </div>`;
                div.innerHTML = listStr;

                div.onclick = function () {
                    var id = this.getAttribute('data-id');
                    console.log(id);
                    location.href = './supply_detail.html?dataId=' + id;
                };
                supplyWrapper.insertBefore(div, document.querySelector('.supply-flag'));
            }
            var hasMore = res.data.pageNO < res.data.totalPage;
            if (hasMore) {
                patternListData.pageNo++;
            }
            pullUpLoad(hasMore, getSupplyList, supplyWrapper);
        });
    }





    var contentSwiper = new Swiper ('.swiper-container', {
        onSlideChangeEnd: swiperControl,
        spaceBetween: 30
    });

    (function slideControl() {
        for (var i = 0; i < swiperTag.length; i++) {
            (function(i) {
                swiperTag[i].addEventListener('click', function() {
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
    }
})();



