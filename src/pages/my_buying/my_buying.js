require('common/styles/index.styl');
require('./my_buying.styl');
require('plugins/swiper/swiper-3.4.2.min.js');
var pullUpLoad = require('common/scripts/pull_up_load').pullUpLoad;
import Toast from 'plugins/toast/Toast';

import {
    c,
    formatDate
} from 'utils/utils';

import {
    myProductBuys,
    deleteProductBuy,
    releaseProductBuy,
    listBuyTaskUserByBuyId
} from 'api/user';

(function () {
    var foot = c('#foot');
    var downApp = c('#downApp');
    var goingWrapper = c('#goingWrapper');
    var completeWrapper = c('#completeWrapper');
    var closeWrapper = c('#closeWrapper');
    var swiperTag = c('.swiper-tag')[0].getElementsByTagName('span');
    var contentSwiper = new Swiper('.swiper-container', {
        onSlideChangeEnd: swiperControl,
        spaceBetween: 30
    });

    var getGoingParamas = {
        buyStatus: '',
        buyType: '',
        pageNo: 1,
        pageSize: 10
    };
    var getCompleteParamas = {
        buyStatus: 2,
        buyType: '',
        pageNo: 1,
        pageSize: 10
    };
    var getCloseParamas = {
        buyStatus: 3,
        buyType: '',
        pageNo: 1,
        pageSize: 10
    };
    getGoing();
    getComplete();
    getClose();

    // 求购中
    function getGoing() {
        myProductBuys(getGoingParamas, function (res) {
            console.log('我的求购列表-求购中', res);
            var list = res.data.list;
            var listStr = '';
            for (var i = 0; i < list.length; i++) {
                var div = document.createElement('div');
                div.setAttribute('data-id', list[i].id);
                div.className = 'info-wrapper';
                listStr = `<div class="info">
                        <img src="${list[i].buyPicUrl}">
                        <div class="text">
                            <div class="top ellipsis-two">${list[i].buyDesc}</div>
                            <div class="bottom"><span class="order-taking-num">已有<span class="num">${list[i].buyTaskCount}</span>人接单</span><span class="time">${formatDate((new Date(list[i].createDate)), 'yyyy-MM-dd')}</span></div>
                        </div>
                    </div>`;
                div.innerHTML = listStr;

                div.onclick = function () {
                    var id = this.getAttribute('data-id');
                    console.log(id);
                    Toast.info('请前往App查看', 1000);
                };
                goingWrapper.insertBefore(div, document.querySelector('.going-flag'));
            }
            var hasMore = res.data.pageNO < res.data.totalPage;
            if (hasMore) {
                getGoingParamas.pageNo++;
            }
            pullUpLoad(hasMore, getGoing, goingWrapper);
        });
    }


    // 已完成
    function getComplete() {
        myProductBuys(getCompleteParamas, function (res) {
            console.log('我的求购列表-已完成', res);
            var list = res.data.list;
            var listStr = '';
            for (var i = 0; i < list.length; i++) {
                var div = document.createElement('div');
                div.setAttribute('data-id', list[i].id);
                div.className = 'info-wrapper';
                listStr = `<div class="info border-bottom">
                    <img src="${list[i].buyPicUrl}">
                    <div class="text">
                        <div class="top ellipsis-two">${list[i].buyDesc}</div>
                        <div class="bottom"><span class="order-taking-num">已有<span class="num">${list[i].buyTaskCount}</span>人接单</span><span class="time">${formatDate((new Date(list[i].createDate)), 'yyyy-MM-dd')}</span></div>
                    </div>
                </div>
                <div class="btn">
                    <span class="republish" buy-desc="${list[i].buyDesc}" buy-num="${list[i].buyNum}" buy-pic-url="${list[i].buyPicUrl}" buy-shapes="${list[i].buyShape}" buy-type="${list[i].buyType}" buy-unit="${list[i].buyUnit}" is-start-up="${list[i].isStartUp}">重新发布</span><span class="active contact-merchant" buying-id="${list[i].id}">联系商家</span>
                </div>`;
                div.innerHTML = listStr;

                div.onclick = function () {
                    var id = this.getAttribute('data-id');
                    console.log(id);
                    Toast.info('请前往App查看', 1000);
                };
                completeWrapper.insertBefore(div, document.querySelector('.complete-flag'));

                var republish = div.getElementsByClassName('republish')[0];
                var contactMerchant = div.getElementsByClassName('contact-merchant')[0];
                republish.onclick = function (e) {
                    var that = this;
                    republishBuying(that);
                    e.stopPropagation();
                };
                contactMerchant.onclick = function (e) {
                    var that = this;
                    e.stopPropagation();
                    buyingList(that);
                };
            }
            var hasMore = res.data.pageNO < res.data.totalPage;
            if (hasMore) {
                getCompleteParamas.pageNo++;
            }
            pullUpLoad(hasMore, getComplete, completeWrapper);
        });
    }

    // 已关闭
    function getClose() {
        myProductBuys(getCloseParamas, function (res) {
            console.log('我的求购列表-已关闭', res);
            var list = res.data.list;
            list = [
                {
                    buyTaskFlag: 0,
                    updateDate: 1504322158000,
                    buyNum: 5682,
                    buyDesc: 'JMeter自动测试发布求购',
                    buyPicUrl: 'http://imgdev.tswq.wang/1111111',
                    userId: 53852,
                    version: 1,
                    platform: 1,
                    buyTaskCount: 0,
                    isStartUp: 1,
                    buyUnit: 400012,
                    buyShape: 200011,
                    buyStatus: 1,
                    buyType: 100010,
                    id: 3255,
                    viewCount: 3,
                    createDate: 1503712871000
                },
                {
                    buyTaskFlag: 0,
                    updateDate: 1503633292000,
                    buyNum: 758,
                    buyDesc: 'JMeter自动测试发布求购',
                    buyPicUrl: 'http://imgdev.tswq.wang/1111111',
                    userId: 53852,
                    version: 1,
                    platform: 1,
                    buyTaskCount: 0,
                    isStartUp: 1,
                    buyUnit: 400012,
                    buyShape: 200010,
                    buyStatus: 1,
                    buyType: 100010,
                    id: 3252,
                    createDate: 1503633292000
                }
            ];
            var listStr = '';
            for (var i = 0; i < list.length; i++) {
                var div = document.createElement('div');
                div.setAttribute('data-id', list[i].id);
                div.className = 'info-wrapper';
                listStr = `<div class="info border-bottom">
                    <img src="${list[i].buyPicUrl}">
                    <div class="text">
                        <div class="top ellipsis-two">${list[i].buyDesc}</div>
                        <div class="bottom"><span class="time">${formatDate((new Date(list[i].createDate)), 'yyyy-MM-dd')}</span></div>
                    </div>
                </div>
                <div class="btn">
                    <span class="active republish" buy-desc="${list[i].buyDesc}" buy-num="${list[i].buyNum}" buy-pic-url="${list[i].buyPicUrl}" buy-shapes="${list[i].buyShape}" buy-type="${list[i].buyType}" buy-unit="${list[i].buyUnit}" is-start-up="${list[i].isStartUp}">重新发布</span><span class="del" buying-id="${list[i].id}">删除</span>
                </div>`;
                div.innerHTML = listStr;

                div.onclick = function () {
                    var id = this.getAttribute('data-id');
                    console.log(id);
                    Toast.info('前往App查看', 1000);
                };
                closeWrapper.insertBefore(div, document.querySelector('.close-flag'));


                var republish = div.getElementsByClassName('republish')[0];
                var del = div.getElementsByClassName('del')[0];
                republish.onclick = function (e) {
                    var that = this;
                    republishBuying(that);
                    e.stopPropagation();
                };
                del.onclick = function (e) {
                    var that = this;
                    delBuying(that);
                    e.stopPropagation();
                };


            }
            var hasMore = res.data.pageNO < res.data.totalPage;
            if (hasMore) {
                getGoingParamas.pageNo++;
            }
            pullUpLoad(hasMore, getClose, goingWrapper);
        });
    }

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
    }


    // 重新发布
    function republishBuying(that) {
        var data = {
            buyDesc: that.getAttribute('buy-desc'),
            // buyNum: that.getAttribute('buy-num'),
            buyNum: 758,
            buyPicUrl: that.getAttribute('buy-pic-url'),
            buyShapes: that.getAttribute('buy-shapes'),
            buyType: that.getAttribute('buy-type'),
            buyUnit: that.getAttribute('buy-unit'),
            isStartUp: that.getAttribute('is-start-up')
        };
        console.log('重新发布data:', data);
        // 未测试
        releaseProductBuy(data, function (res) {
            console.log(res);
            Toast.info(res.message, 1000);
            if (res.code === 0) {
                Toast.success({
                    text: res.message,
                    duration: 1000,
                    complete: function() {
                        var url = getQueryString('from');
                        location.replace(url);
                    }
                });
                location.href = './my_buying.html?time=' + ((new Date()).getTime());
            }
        });
    }

    // 获取接单人列表
    function buyingList(that) {
        var data = that.getAttribute('buying-id');
        console.log('获取求购单接单人列表ID值', data);
        listBuyTaskUserByBuyId(data, function (res) {
            console.log(res);
        });
    }

    // 删除求购
    function delBuying(that) {
        var data = that.getAttribute('buying-id');
        console.log('删除求购ID值', data);
        // deleteProductBuy(data, function (res) {
        //     console.log(res);
        //     // if (res.code === 0) {
        //     //     Toast.success(res.messge);
        //     // }
        // });
    }
})();

