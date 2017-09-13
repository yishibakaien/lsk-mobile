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
    releaseProductBuy
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
                    footShow();
                    // foot.style.display = 'block';
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
                    <img src="{list[i].buyPicUrl}">
                    <div class="text">
                        <div class="top ellipsis-two">${list[i].buyDesc}</div>
                        <div class="bottom"><span class="order-taking-num">已有<span class="num">${list[i].buyTaskCount}</span>人接单</span><span class="time">${formatDate((new Date(list[i].createDate)), 'yyyy-MM-dd')}</span></div>
                    </div>
                </div>
                <div class="btn">
                    <span class="repost" buyDesc="${list[i].buyDesc}" buyNum="${list[i].buyNum}" buyPicUrl="${list[i].buyPicUrl}" buyShapes="${list[i].buyShapes}" buyType="${list[i].buyType}" buyUnit="${list[i].buyUnit}" isStartUp="${list[i].isStartUp}" onclick="repostBuying()">重新发布</span><span class="active contact-merchant">联系商家</span>
                </div>`;
                div.innerHTML = listStr;

                div.onclick = function () {
                    var id = this.getAttribute('data-id');
                    console.log(id);
                };
                completeWrapper.insertBefore(div, document.querySelector('.complete-flag'));
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
                    <span class="active republish">重新发布</span><span class="del">删除</span>
                </div>`;
                div.innerHTML = listStr;

                div.onclick = function () {
                    var id = this.getAttribute('data-id');
                    console.log(id);
                };
                closeWrapper.insertBefore(div, document.querySelector('.close-flag'));
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

    // function deleteBuying(id) {
    //     deleteProductBuy({id}, function (res) {
    //         console.log(res);
    //         if (res.code === 0) {
    //             Toast.success(res.messge);
    //         }
    //     });
    // }

    function footShow() {
        foot.style.display = 'block';
        // var timer = setTimeout('downApp.style.backgroundColor = "red";', 1000);
        // clearTimeout(timer);
        downApp.style.backgroundColor = 'red';
    }
    function repostBuying() {
        console.log(111);
        // releaseProductBuy({
        //     buyDesc: this.getAttribute('buyDesc'),
        //     buyNum: this.getAttribute('buyNum'),
        //     buyPicUrl: this.getAttribute('buyPicUrl'),
        //     buyShapes: this.getAttribute('buyShapes'),
        //     buyType: this.getAttribute('buyType'),
        //     buyUnit: this.getAttribute('buyUnit'),
        //     isStartUp: this.getAttribute('isStartUp')
        // }, function (res) {
        //     console.log(res);
        // }
        // );
    }
})();

