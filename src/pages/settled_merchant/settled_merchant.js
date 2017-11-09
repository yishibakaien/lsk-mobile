require('common/styles/index.styl');
require('./settled_merchant.styl');
import {TEXT_SEARCH_COMPANY} from 'common/scripts/text_search.js';


import {
    formatDate,
    getQueryString
} from 'utils/utils';

import {listUnSettledCompany, listSettledCompany} from 'api/settled_merchant';

TEXT_SEARCH_COMPANY();

var Swiper = require('plugins/swiper/swiper-3.4.2.min.js');

var qualityMerchants = document.getElementById('qualityMerchants');
var newSettled = document.getElementById('newSettled');
var totalNum = document.getElementById('totalNum');

var swiperTag = document.getElementsByClassName('swiper-tag')[0].getElementsByTagName('span');
var contentSwiper = new Swiper ('.swiper-container', {
    onSlideChangeEnd: swiperControl,
    spaceBetween: 30,
    initialSlide: ((getQueryString('swiperIndex')) ? (getQueryString('swiperIndex')) : 0)
});
slideControl();

function slideControl() {
    for (var i = 0; i < swiperTag.length; i++) {
        (function(i) {
            swiperTag[i].addEventListener('click', function() {
                contentSwiper.slideTo(i, 300, false);
                swiperControl(contentSwiper);
            }, false);
        })(i);
    }
}

function swiperControl(swiper) {
    for (var i = 0; i < swiperTag.length; i++) {
        swiperTag[i].className = swiperTag[i].className.replace('active', '');
    }
    swiperTag[swiper.activeIndex].className += ' active';
}

// 优质厂商列表
listSettledCompany(
    {pageNo: 1, pageSize: 10},

    function(res) {
        console.log('优质厂商列表', res);
        var data = res.data.list;
        var str = '';
        data.forEach(function(item) {
            str += `<div data-id="${item.id}" index-name="${item.indexName}" data-id="${item.id}"><img src="${item.companyHeadIcon}"></div>`;
        });
        qualityMerchants.innerHTML = str;
        var companys = qualityMerchants.getElementsByTagName('div');
        Array.prototype.forEach.call(companys, function(item) {
            item.onclick = function() {
                var id = this.getAttribute('data-id');
                // var indexName = this.getAttribute('index-name');
                // location.href = 'http://' + indexName + '.lacewang.com';
                location.href = 'https://www.ts57.cn/microWebsite/index.html?companyId=' + id;
            };
        });
    },

    function(res) {
        console.error('优质厂商列表', res);
    }
);

// 最新入驻列表
listUnSettledCompany(
    {pageNo: 1, pageSize: 10},

    function(res) {
        console.log('最新入驻列表', res);
        totalNum.innerHTML = res.data.totalNum;
        var data = res.data.list;
        var str = '';
        data.forEach(function(item) {
            var div = document.createElement('div');
            div.className = 'new-settled-item';
            div.setAttribute('data-id', item.id);
            str = `<div class="new-settled-info">
                    <img src="${item.companyHeadIcon}">
                    <div class="text">
                        <div class="firm-name">${item.companyName}</div>
                        <div class="phone"><i class="icon-shouji"></i>${item.phone}</div>
                        <div class="time">${formatDate(item.createDate, 'yyyy-MM-dd')}</div>
                    </div>
                </div>
                <div class="btn clearfix" data-id="${item.id}" index-name="${item.indexName}">进入官网</div>`;
            div.innerHTML = str;
            div.getElementsByClassName('btn')[0].onclick = function() {
                location.href = 'https://www.ts57.cn/microWebsite/index.html?companyId=' + this.getAttribute('');
                // location.href = 'http://' + data.indexName + '.lacewang.cn';
                // location.href = 'http://' + this.getAttribute('index-name') + '.lacewang.com';
            };
            newSettled.appendChild(div);
        });
    },

    function(res) {
        console.error('最新入驻列表', res);
    }
);
