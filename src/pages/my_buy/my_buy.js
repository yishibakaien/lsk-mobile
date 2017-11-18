require('common/styles/index.styl');
require('./my_buy.styl');
require('plugins/swiper/swiper-3.4.2.min.js');
var pullUpLoad = require('common/scripts/pull_up_load').pullUpLoad;
import Toast from 'plugins/toast/Toast';

import {
    c,
    getQueryString,
    getDateDiff
    // formatDate
} from 'utils/utils';

import {
    myProductBuys,
    deleteProductBuy,
    getCompanyInfo
    // listBuyTaskUserByBuyId
    // releaseProductBuy,
    // finishProductBuy
} from 'api/user';

(function () {
    var foot = c('#foot');
    // var downApp = c('#downApp');
    var goingWrapper = c('#goingWrapper');
    var completeWrapper = c('#completeWrapper');
    var closeWrapper = c('#closeWrapper');
    var swiperTag = c('.swiper-tag')[0].getElementsByTagName('span');
    var contentSwiper = new Swiper('.swiper-container', {
        onSlideChangeEnd: swiperControl,
        spaceBetween: 30,
        initialSlide: ((getQueryString('swiperIndex')) ? (getQueryString('swiperIndex')) : 0)
    });

    var getGoingParamas = {
        buyStatus: 1,
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
                            <div class="bottom"><span class="order-taking-num" style="display: ${list[i].buyTaskCount ? 'block' : 'none'}">已有<span class="num">${list[i].buyTaskCount}</span>人接单</span><span class="time">${getDateDiff(new Date(list[i].createDate))}</span></div>
                        </div>
                    </div>`;
                div.innerHTML = listStr;

                div.onclick = function () {
                    var id = this.getAttribute('data-id');
                    console.log(id);
                    // location.href = './buy_detail.html?dataId=' + id + '&from=' + location.href;
                    Toast.info('请前往App查看', 1000);
                    foot.style.display = 'block';
                };
                goingWrapper.insertBefore(div, document.querySelector('.going-flag'));
            }
            var hasMore = res.data.pageNO < res.data.totalPage;
            console.log('hasMore值:',hasMore);
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
                var companyId = list[i].dealBuyTask ? list[i].dealBuyTask.companyId : '';
                div.setAttribute('data-id', list[i].id);
                div.className = 'info-wrapper';
                listStr = `<div class="info border-bottom">
                    <img src="${list[i].buyPicUrl}">
                    <div class="text">
                        <div class="top ellipsis-two">${list[i].buyDesc}</div>
                        <div class="bottom"><span class="order-taking-num">已有<span class="num">${list[i].buyTaskCount}</span>人接单</span><span class="time">${getDateDiff(new Date(list[i].createDate))}</span></div>
                    </div>
                </div>
                <div class="btn">
                    <span class="republish" buy-desc="${list[i].buyDesc}" buy-num="${list[i].buyNum}" buy-pic-url="${list[i].buyPicUrl}" buy-shapes="${list[i].buyShape}" buy-type="${list[i].buyType}" buy-unit="${list[i].buyUnit}" is-start-up="${list[i].isStartUp}">重新发布</span><span class="active contact-merchant" company-id="${list[i].dealBuyTask ? list[i].dealBuyTask.companyId : ''}">联系商家</span>
                </div>`;
                div.innerHTML = listStr;

                div.onclick = function () {
                    // var id = this.getAttribute('company-id');
                    // console.log(id);
                    Toast.info('请前往App查看', 1000);
                    foot.style.display = 'block';
                };
                completeWrapper.insertBefore(div, document.querySelector('.complete-flag'));

                var republish = div.getElementsByClassName('republish')[0];
                var contactMerchant = div.getElementsByClassName('contact-merchant')[0];
                getPhoneNumMethod(companyId, contactMerchant);
                republish.onclick = function (e) {
                    var that = this;
                    republishBuying(that);
                    e.stopPropagation();
                };
                contactMerchant.onclick = function (e) {
                    e.stopPropagation();
                    var phone = this.getAttribute('phone');
                    if (phone) {
                        location.href = 'tel:' + this.getAttribute('phone');
                    } else {
                        Toast.info('您完成接单时未选择联系人');
                    }
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
            var listStr = '';
            for (var i = 0; i < list.length; i++) {
                var div = document.createElement('div');
                div.setAttribute('data-id', list[i].id);
                div.className = 'info-wrapper';
                listStr = `<div class="info border-bottom">
                    <img src="${list[i].buyPicUrl}">
                    <div class="text">
                        <div class="top ellipsis-two">${list[i].buyDesc}</div>
                        <div class="bottom"><span class="time">${getDateDiff(new Date(list[i].createDate))}</span></div>
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
                    foot.style.display = 'block';
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
                getCloseParamas.pageNo++;
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
        history.replaceState(null, null, '?swiperIndex=' + swiper.activeIndex);
    }
    // 重新发布
    function republishBuying(that) {
        location.href = './publish_buy.html?buyDesc=' + that.getAttribute('buy-desc') + '&buyNum=' + that.getAttribute('buy-num') + '&buyPicUrl=' + that.getAttribute('buy-pic-url') + '&buyShapes=' + that.getAttribute('buy-shapes') + '&buyType=' + that.getAttribute('buy-type') + '&buyUnit=' + that.getAttribute('buy-unit') + '&isStartUp=' + that.getAttribute('is-start-up') + '&from=' + location.href;
    }

    // 删除求购
    function delBuying(that) {
        var data = {ids: Number(that.getAttribute('buying-id'))};
        console.log(data);
        console.log('删除求购ID值', data);
        if (confirm('确认删除?')) {
            deleteProductBuy(data, function (res) {
                console.log(res);
                if (res.code === 0) {
                    Toast.success(res.messge);
                    var removeEle = that.parentElement.parentElement;
                    removeEle.parentElement.removeChild(removeEle);
                    console.log(that.parentElement.parentElement);

                } else {
                    Toast.info(res.messge);
                }
            });
        }
    }
    // 获取电话
    function getPhoneNumMethod(companyId, contactMerchant) {
        if (companyId) {
            getCompanyInfo({
                companyId
            }, function (res) {
                console.log('获取详细工厂信息', res);
                contactMerchant.setAttribute('phone', res.data.phone);
                // that.setAttribute('phone', res.data.phone);
                // var phone = that.getAttribute('phone');
                // location.href = 'tel:' + phone;
            });
        }
    }
    // 完成接单
    // function hasToken(id) {
    //     var data = {
    //         buyTaskId: '',/*接单id（可选），如果有人接单则必须带上	number*/
    //         id: id/*求购单id	number*/
    //     };
    //     finishProductBuy(data, function (res) {
    //         console.log(res);
    //     });
    // }
})();
