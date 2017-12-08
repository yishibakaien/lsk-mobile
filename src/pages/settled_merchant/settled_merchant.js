require('common/styles/index.styl');
require('./settled_merchant.styl');
import {TEXT_SEARCH_COMPANY} from 'common/scripts/text_search.js';
var pullUpLoad = require('common/scripts/pull_up_load').pullUpLoad;

import {
    c,
    formatDate,
    getQueryString,
    // encrypto
} from 'utils/utils';

import {listUnSettledCompany, listSettledCompany} from 'api/settled_merchant';

TEXT_SEARCH_COMPANY();

var Swiper = require('plugins/swiper/swiper-3.4.2.min.js');

var qualityMerchants = c('#qualityMerchants');
var newSettled = c('#newSettled');
var totalNum = c('#totalNum');

var swiperTag = c('.swiper-tag')[0].getElementsByTagName('span');
var contentSwiper = new Swiper ('.swiper-container', {
    onSlideChangeEnd: swiperControl,
    spaceBetween: 30,
    initialSlide: ((getQueryString('swiperIndex')) ? (getQueryString('swiperIndex')) : 0)
});



var getGoodCompanyParamas = {
    pageNo: 1,
    pageSize: 10
};
var getNewCompanyParamas = {
    pageNo: 1,
    pageSize: 10
};



window.addEventListener('pageshow', function (event) {
    if (event.persisted || window.performance && window.performance.navigation.type == 2  && sessionStorage.recordingNewCorHtml && sessionStorage.recordingNewCorHtml) {
        if (getGoodCompanyParamas.pageNo && getNewCompanyParamas.pageNo) {
            getGoodCompanyParamas.pageNo = Number(sessionStorage.goodCompanyNo);
            getNewCompanyParamas.pageNo = Number(sessionStorage.newCompanyNo);
        }

        if (sessionStorage.recordingGoodCorHtml && sessionStorage.recordingNewCorHtml) {
            qualityMerchants.innerHTML = sessionStorage.recordingGoodCorHtml;
            newSettled.innerHTML = sessionStorage.recordingNewCorHtml;
            setScrollTop();
            initJump();
            sessionStorage.removeItem('recordingGoodCorHtml');
            sessionStorage.removeItem('recordingNewCorHtml');
        }
        if (Number(sessionStorage.goodCompanyNo) < Number(sessionStorage.goodCompanyTotalNo)) {
            getGoodCompanyParamas.pageNo++;
            pullUpLoad(true, getGoodCompany, document.querySelector('.quality-merchants-list-wrapper'));
        }
        if (Number(sessionStorage.newCompanyNo) < Number(sessionStorage.newCompanyTotalNo)) {
            getNewCompanyParamas.pageNo++;
            pullUpLoad(true, getNewCompany, document.querySelector('.new-settled-wrapper'));

        }
    } else {
        sessionStorage.clear();
        sessionStorage.newCompanyOffsetTop = 0;
        sessionStorage.goodCompanyOffsetTop = 0;
        setScrollTop();
        getGoodCompany();
        getNewCompany();
    }
}, false);


slideControl();

function initJump() {
    console.log('(newSettled.querySelectorAll(\'btn\')', newSettled.querySelectorAll('.btn'));
    console.log('qualityMerchants.querySelectorAll(\'good-firm-item\')', qualityMerchants.querySelectorAll('.good-firm-item'));

    Array.prototype.forEach.call(qualityMerchants.querySelectorAll('.good-firm-item'), function(item) {
        item.onclick = function () {
            saveToStorage();
            var id = this.getAttribute('data-id');
            location.href = './dist/index.html?companyId=' + id;
        };
    });
    Array.prototype.forEach.call(newSettled.querySelectorAll('.btn'), function(item) {
        item.onclick = function () {
            saveToStorage();
            var id = this.getAttribute('data-id');
            location.href = './dist/index.html?companyId=' + id;
        };
    });
}

function saveToStorage() {
    sessionStorage.recordingGoodCorHtml = qualityMerchants.innerHTML;
    sessionStorage.recordingNewCorHtml = newSettled.innerHTML;
    sessionStorage.goodCompanyOffsetTop = document.querySelector('.quality-merchants-list-wrapper').scrollTop;
    sessionStorage.newCompanyOffsetTop = document.querySelector('.new-settled-wrapper').scrollTop;
}

function setScrollTop() {
    document.querySelector('.quality-merchants-list-wrapper').scrollTop = sessionStorage.goodCompanyOffsetTop;
    document.querySelector('.new-settled-wrapper').scrollTop = sessionStorage.newCompanyOffsetTop;
}









// 优质厂商列表
function getGoodCompany() {
    listSettledCompany(getGoodCompanyParamas,
        function(res) {
            console.log('优质厂商列表', res);
            var data = res.data.list;
            data.forEach(function(item) {
                var div = document.createElement('div');
                div.className = 'good-firm-item';
                div.setAttribute('data-id', item.id);
                div.setAttribute('index-name', item.indexName);
                div.innerHTML = `<img src="${item.companyHeadIcon}">`;
                div.addEventListener('click', function() {
                    // var indexName = this.getAttribute('index-name');
                    saveToStorage();
                    var id = this.getAttribute('data-id');
                    // location.href = 'http://' + indexName + '.lacewang.com';
                    // location.href = 'https://www.ts57.cn/microWebsite/index.html?companyId=' + id;
                    // location.href = './dist/index.html?companyId=' + id + '&from=lsk&x-token=' + encrypto(localStorage['x-token']);
                    location.href = './dist/index.html?companyId=' + id;
                });
                qualityMerchants.insertBefore(div, document.querySelector('.good-company-flag'));
            });
            sessionStorage.goodCompanyNo = res.data.pageNO;
            sessionStorage.goodCompanyTotalNo = res.data.totalPage;
            var hasMore = res.data.pageNO < res.data.totalPage;
            console.log('hasMore值:', hasMore);
            if (hasMore) {
                getGoodCompanyParamas.pageNo++;
            }
            pullUpLoad(hasMore, getGoodCompany, document.querySelector('.quality-merchants-list-wrapper'));
        }, function(res) {
            console.error('优质厂商列表', res);
        }
    );
}


// 最新入驻列表
function getNewCompany() {
    listUnSettledCompany(getNewCompanyParamas,
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
                    saveToStorage();
                    var id = this.getAttribute('data-id');
                    location.href = './dist/index.html?companyId=' + id;
                    // location.href = './dist/index.html?companyId=' + this.getAttribute('data-id') + '&from=lsk&x-token=' + encrypto(localStorage['x-token']);
                    // location.href = 'https://www.ts57.cn/microWebsite/index.html?companyId=' + this.getAttribute('data-id');
                    // location.href = 'http://' + data.indexName + '.lacewang.cn';
                    // location.href = 'http://' + this.getAttribute('index-name') + '.lacewang.com';
                };
                newSettled.insertBefore(div, document.querySelector('.new-company-flag'));
            });
            sessionStorage.newCompanyNo = res.data.pageNO;
            sessionStorage.newCompanyTotalNo = res.data.totalPage;
            var hasMore = res.data.pageNO < res.data.totalPage;
            console.log('hasMore值:', hasMore);
            if (hasMore) {
                getNewCompanyParamas.pageNo++;
            }
            pullUpLoad(hasMore, getNewCompany, document.querySelector('.new-settled-wrapper'));
        }, function(res) {
            console.error('最新入驻列表', res);
        }
    );
}



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
    history.replaceState(null, null, '?swiperIndex=' + swiper.activeIndex);
}
