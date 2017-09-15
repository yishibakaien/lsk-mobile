require('common/styles/index.styl');
require('./shouye.styl');

var Swiper = require('plugins/swiper/swiper-3.4.2.min.js');

import {
    listLSKHomeUnSettledCompany,
    listLSKHomeProduct,
    listHomeClothes,
    listLSKHomeSettledCompany
} from 'api/index_page';

import {
    c,
    formatDate,
    formatBgPic
} from 'utils/utils';

import {PIC_SEARCH} from '../../common/scripts/pic_search.js';
import {TEXT_SEARCH} from 'common/scripts/text_search.js';
PIC_SEARCH();
TEXT_SEARCH();

// 入驻信息()
// var settledInfoSwiper = new Swiper('.settled-info-swiper', {
//     slidesPerView: 2,
//     slidesPerGroup: 2,
//     direction: 'vertical',
//     autoplay: 3000,
//     loop: true,
//     autoplayDisableOnInteraction: false
// });

newSettled();
// 最新驻商家(新闻轮播)
function newSettled() {
    listLSKHomeUnSettledCompany({
        pageSize: 5
    }, function(res) {
        console.log('最新驻商家', res);

        var data = res.data;
        var str = '';
        data.forEach(function(item) {
            str += `<div class="swiper-slide">
                <div class="firm-name">${item.companyName}</div>
                <div class="time">${formatDate(item.createDate, 'yyyy-MM-dd')}</div>
            </div>`;
        });

        c('#newSettled').innerHTML = str;
        var settledInfoSwiper = new Swiper('.settled-info-swiper', {
            slidesPerView: 2,
            slidesPerGroup: 2,
            direction: 'vertical',
            autoplay: 3000,
            loop: true,
            autoplayDisableOnInteraction: false
        });

    }, function(res) {
        console.error('最新驻商家', res);
    });
}

patterns();
// 首页花型列表
// http://image.tswq.wang/factory/金风帆_103/大边/103_865937.jpg?x-oss-process=image/resize,w_300,h_300/
// http://imgdev.tswq.wang/product/ios-3c72bb058a7d46918d3e4c1a85984205.jpg?x-oss-process=/resize,w_200,h_200
function patterns() {
    listLSKHomeProduct({
        pageSize: 9
    }, function(res) {
        console.log('首页花型列表', res);
        var data = res.data;
        var str = '';
        data.forEach(function(item) {
            str += `<div class="swiper-slide" data-id="${item.id}">
                <div class="pattern" style="background-image:${formatBgPic(item.defaultPicUrl, 200)}">
                </div>
                <div class="text">${item.productNo}</div>
            </div>`;
        });
        c('#patterns').innerHTML = str;
        var newArrivalSwiper = new Swiper('.new-arrival-swiper', {
            slidesPerView: 3,
            slidesPerGroup: 3,
            autoplay: 4000,
            loop: true,
            autoplayDisableOnInteraction: false
        });

    }, function(res) {
        console.error('首页花型列表', res);
    });
}

clothes();
// 首页版衣列表
function clothes() {
    listHomeClothes({
        pageSize: 6
    }, function(res) {
        console.log('首页版衣列表', res);
        var data = res.data;
        var str = '';
        data.forEach(function(item) {
            str += `<div class="swiper-slide" data-id="${item.id}">
                <div>
                    <img src="${item.clothesPic}">
                </div>
            </div>`;
        });
        c('#clothes').innerHTML = str;
        var versionSwiper = new Swiper('.version-swiper', {
            slidesPerView: 3,
            slidesPerGroup: 3,
            autoplay: 6000,
            loop: true,
            autoplayDisableOnInteraction: false
        });

    }, function(res) {
        console.error('首页版衣列表', res);
    });
}

good();
// 首页优质厂家
function good() {
    listLSKHomeSettledCompany({
        pageSize: 10
    }, function(res) {
        console.log('首页优质厂家', res);
        var data = res.data;
        var str = '';
        data.forEach(function(item) {
            str += `<div class="border-bottom border-right" data-id="${item.id}">
                    <img src="${item.companyHeadIcon}">
            </div>`;
        });
        c('#good').innerHTML = str;
    }, function(res) {
        console.error('首页优质厂家', res);
    });
}
// 首页花型列表
// var newArrivalSwiper = new Swiper('.new-arrival-swiper', {
//     slidesPerView: 3,
//     slidesPerGroup: 3,
//     autoplay: 4000,
//     loop: true,
//     autoplayDisableOnInteraction: false
// });

var supplyBuyingInfoSwiper = new Swiper('.supply-buying-info-swiper', {
    slidesPerView: 3,
    slidesPerGroup: 3,
    autoplay: 5000,
    loop: true,
    autoplayDisableOnInteraction: false
});

// 版衣
// var versionSwiper = new Swiper('.version-swiper', {
//     slidesPerView: 3,
//     slidesPerGroup: 3,
//     autoplay: 6000,
//     loop: true,
//     autoplayDisableOnInteraction: false
// });

