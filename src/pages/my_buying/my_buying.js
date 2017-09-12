require('common/styles/index.styl');
require('./my_buying.styl');
require('plugins/swiper/swiper-3.4.2.min.js');
var pullUpLoad = require('common/scripts/pull_up_load').pullUpLoad;
import Toast from 'plugins/toast/Toast';

import {
    c
} from 'utils/utils';

import {
    myProductBuys
}  from 'api/user';

(function () {
    var goingWrapper = c('#goingWrapper');
    var completeWrapper = c('#completeWrapper');
    var closeWrapper = c('#closeWrapper');
    var swiperTag = c('.swiper-tag')[0].getElementsByTagName('span');
    var contentSwiper = new Swiper ('.swiper-container', {
        onSlideChangeEnd: swiperControl,
        spaceBetween: 30
    });
    // 求购中
    var getBuyingParamas = {
        buyStatus: '',
        buyType: '',
        pageNo: 1,
        pageSize: 10
    };
    getBuying();
    function getBuying() {
         myProductBuys(getBuyingParamas, function (res) {
             console.log('我的求购列表-求购中', res);
             var list = res.data.list;
             var listStr = '';

             for (var i = 0; i < list.length; i++) {
                 var div = document.createElement('div');
                 div.setAttribute('data-id', list[i].id);
                 div.className = 'info-wrapper';
                 listStr = `
                    <div class="info">
                        <img src="${list[i].buyPicUrl}">
                        <div class="text">
                            <div class="top ellipsis-two">${list[i].buyDesc}</div>
                            <div class="bottom"><span class="order-taking-num">已有<span class="num">${list[i].buyTaskCount}</span>人接单</span><span class="time">${list[i].createDate}</span></div>
                        </div>
                    </div>`;
                 div.innerHTML = listStr;

                 div.onclick = function() {
                    var id = this.getAttribute('data-id');
                    console.log(id);
                 };
                 goingWrapper.appendChild(div);
             }
             console.log(res.data.pageNO, res.data.totalPage);
             var hasMore = res.data.pageNO < res.data.totalPage;
             console.log(hasMore);
             if (hasMore) {
                 getBuyingParamas.pageNo++;
             }
             pullUpLoad(hasMore, getBuying, goingWrapper, document.querySelector('.swiper-wrapper'));
         });
     }


    // 已完成
    myProductBuys({
        buyStatus: 2,
        buyType: '',
        pageNo: 1,
        pageSize: 10
    }, function (res) {
        console.log('我的求购列表-已完成', res);
        var list = res.data.list;
        var listStr = '';
        for (var i = 0; i < list.length; i++) {
            listStr += `<div class="info-wrapper">
                <div class="info border-bottom">
                    <img src="{list[i].buyPicUrl}">
                    <div class="text">
                        <div class="top ellipsis-two">${list[i].buyDesc}</div>
                        <div class="bottom"><span class="order-taking-num">已有<span class="num">${list[i].buyTaskCount}</span>人接单</span><span class="time">${list[i].createDate}</span></div>
                    </div>
                </div>
                <div class="btn">
                    <span>重新发布</span><span class="active contact-merchant">联系商家</span>
                </div>
            </div>`;
        }
        completeWrapper.innerHTML = listStr;
    });

    // 已关闭
    myProductBuys({
        buyStatus: 3,
        buyType: '',
        pageNo: 1,
        pageSize: 10
    }, function (res) {
        console.log('我的求购列表-已完成', res);
        var list = res.data.list;
        var listStr = '';
        for (var i = 0; i < list.length; i++) {
            listStr += ` <div class="info-wrapper">
                <div class="info border-bottom">
                    <img src="../../images/my_buying.png" alt="">
                    <div class="text">
                        <div class="top ellipsis-two">${list[i].buyDesc}</div>
                        <div class="bottom"><span class="time">${list[i].createDate}</span></div>
                    </div>
                </div>
                <div class="btn">
                    <span class="active republish">重新发布</span><span class="del">删除</span>
                </div>
            </div>`;
        }
        closeWrapper.innerHTML = listStr;
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

