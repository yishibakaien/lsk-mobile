require('common/styles/index.styl');
require('./shouye.styl');
import wx from 'weixin-js-sdk';
var Swiper = require('plugins/swiper/swiper-3.4.2.min.js');

console.info('process.env.NODE_ENV', process.env.NODE_ENV);

import {
    listLSKHomeUnSettledCompany,
    listLSKHomeProduct,
    getSupplyAndBuy,
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


newSettled();
document.getElementsByClassName('settled-info-wrapper')[0].onclick = function () {
    location.href = './settled_merchant.html?swiperIndex=1';
};
// 最新驻商家(新闻轮播)
function newSettled() {
    listLSKHomeUnSettledCompany({
        pageSize: 20
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
            speed: 500,
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
        pageSize: 20
    }, function(res) {
        console.log('首页花型列表', res);
        var data = res.data;
        var str = '';
        data.forEach(function(item) {
            // str += `<div class="swiper-slide" data-id="${item.id}">
            //     <div class="pattern" style="background-image:${formatBgPic(item.defaultPicUrl, 200)}"></div>
            //     <div class="text">${item.productNo}</div>
            // </div>`;

            var div = document.createElement('div');
            div.setAttribute('data-id', item.id);
            div.className = 'swiper-slide';
            str = `<div class="pattern" style="background-image:${formatBgPic(item.defaultPicUrl, 200)}"></div>
                <div class="text">${item.productNo}</div>`;
            div.innerHTML = str;
            div.onclick = function () {
                var id = this.getAttribute('data-id');
                console.log(id);
                // location.href = './pattern_detail.html?dataId=' + id;
                location.href = './new_pattern.html';
            };
            c('#patterns').appendChild(div);
        });
        // c('#patterns').innerHTML = str;
        var newArrivalSwiper = new Swiper('.new-arrival-items', {
            slidesPerView: 3,
            slidesPerGroup: 3,
            // autoplay: 4000,
            loop: true,
            autoplayDisableOnInteraction: false
        });
    }, function(res) {
        console.error('首页花型列表', res);
    });
}

supplyAndBuy()
// 供求信息列表
function supplyAndBuy() {
    getSupplyAndBuy({
        pageNo: 1,
        pageSize: 20
    }, function(res) {
        console.log('供求信息列表', res);
        var data = res.data.list;
        var str = '';

        data.forEach(function(item) {
            // str += `<div class="swiper-slide" data-id="${item.id}">
            //     <div class="pattern" style="background-image:${formatBgPic(item.picUrl, 200)}"></div>
            //     <div class="text">${item.description}</div>
            // </div>`;

            var div = document.createElement('div');
            div.setAttribute('data-id', item.id);
            div.className = 'swiper-slide';
            str = `<div class="pattern" style="background-image:${formatBgPic(item.picUrl, 200)}"></div>
                <div class="text">${item.description}</div>`;
            div.innerHTML = str;
            div.onclick = function () {
                var id = this.getAttribute('data-id');
                console.log(id);
                // location.href = './pattern_detail.html?dataId=' + id;
                location.href = './supply_purchase_info.html';
            };
            c('#supplyAndBuy').appendChild(div);
        });
        // c('#supplyAndBuy').innerHTML = str;
        var supplyBuyingInfoSwiper = new Swiper('.supply-buying-info-items', {
            slidesPerView: 3,
            slidesPerGroup: 3,
            autoplay: 5000,
            loop: true,
            speed: 700,
            autoplayDisableOnInteraction: false
        });

    }, function(res) {
        console.error('供求信息列表', res);
    });
}

clothes();
// 首页版衣列表
function clothes() {
    listHomeClothes({
        pageSize: 20
    }, function(res) {
        console.log('首页版衣列表', res);
        var data = res.data;
        var str = '';
        var imgArr = [];
        data.forEach(function(item) {
            // <div><img src="${item.clothesPic}"></div>
            // str += `<div class="swiper-slide" data-id="${item.id}">
            //      <div class="pattern" style="background-image:${formatBgPic(item.clothesPic, 200)}"></div>
            // </div>`;
            imgArr.push(item.clothesPic);
            var div = document.createElement('div');
            div.className = 'swiper-slide';
            div.setAttribute('data-id', item.id);
            div.setAttribute('data-pic-url', item.clothesPic);
            str = `<div class="pattern" style="background-image:${formatBgPic(item.clothesPic, 200)}"></div>`;
            div.innerHTML = str;
            div.onclick = function () {
                var id = this.getAttribute('data-id');
                console.log(id);
                console.log(this.getAttribute('data-pic-url'));
                wx.previewImage({
                    current: this.getAttribute('data-pic-url'),
                    urls: imgArr
                });
                // location.href = './pattern_detail.html?dataId=' + id;
                // location.href = './version_of_clothing.html';
            };
            c('#clothes').appendChild(div);
        });
        console.log('imgArr', imgArr);
        // c('#clothes').innerHTML = str;
        var versionSwiper = new Swiper('.version-items', {
            slidesPerView: 'auto',
            // slidesPerGroup: 3,
            // autoplay: 6000,
            freeMode: true,
            // loop: true,
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
        pageSize: 9
    }, function(res) {
        console.log('首页优质厂家', res);
        var data = res.data;
        var slide = document.createElement('div');
        slide.className = 'swiper-slide';
        var str = '';
        data.forEach(function(item) {
            // str += `<div class="border-bottom border-right item" data-id="${item.id}" style="background-image:${formatBgPic(item.companyHeadIcon, 200)}">
            //         </div>`;

            var div = document.createElement('div');
            div.setAttribute('data-id', item.id);
            // div.className = 'swiper-slide';
            str = `<div class="border-bottom border-right item" data-id="${item.id}" style="background-image:${formatBgPic(item.companyHeadIcon, 200)}">
                    </div>`;
            div.innerHTML = str;
            div.onclick = function () {
                var id = this.getAttribute('data-id');
                console.log(id);
                location.href = 'https://www.ts57.cn/microWebsite/index.html?companyId=' + id;
                // location.href = 'http://' + data.indexName + '.lacewang.cn';
                // location.href = './settled_merchant.html';
            };
            slide.appendChild(div);
        });
        // slide.innerHTML = str;
        c('#good').appendChild(slide);
        // var qualitySwiper = new Swiper('.quality-items', {
        //     autoplay: 5000,
        //     loop: true,
        //     autoplayDisableOnInteraction: false
        // });
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

// 供求信息
// var supplyBuyingInfoSwiper = new Swiper('.supply-buying-info-swiper', {
//     slidesPerView: 3,
//     slidesPerGroup: 3,
//     autoplay: 5000,
//     loop: true,
//     autoplayDisableOnInteraction: false
// });

// 版衣
// var versionSwiper = new Swiper('.version-swiper', {
//     slidesPerView: 3,
//     slidesPerGroup: 3,
//     autoplay: 6000,
//     loop: true,
//     autoplayDisableOnInteraction: false
// });

// 入驻信息()
// var settledInfoSwiper = new Swiper('.settled-info-swiper', {
//     slidesPerView: 2,
//     slidesPerGroup: 2,
//     direction: 'vertical',
//     autoplay: 3000,
//     loop: true,
//     autoplayDisableOnInteraction: false
// });