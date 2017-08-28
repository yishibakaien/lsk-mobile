'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/patterns_detail.styl';
import '../stylus/static/plugin/swiper-3.4.2.min.css';

import Swiper from 'swiper';
import wx from 'weixin-js-sdk';

import {
    getCompanyInfo,
    // 获取花型详情
    getProduct,
    // 2017年7月27日17:43:51 获取色卡
    getColorCards,
    // 采购登记
    askPurchase
} from './api/api';
import {
    c,
    formateMoney,
    getQueryString,
    formateProduceShape,
    formateSupplyType,
    formateUnit
    // _formatPicUrl
} from './utils/utils';

var dataId = getQueryString('dataId');
var companyId = getQueryString('companyId');
// 轮播图盒子
// var picContainer = c('#picContainer');
var productNo = c('#productNo');
var price = c('#price');
var cutPrice = c('#cutPrice');

// 公司信息
var companyMessage = c('#companyMessage');
var avatar = c('#avatar');
var tag = c('#tag');
var viewNum = c('#viewNum');
var companyName = c('#companyName');
var companyBusiness = c('#companyBusiness');

// 花型参数
var category = c('#category');
var ingredient = c('#ingredient');
var stock = c('#stock');
var shape = c('#shape');
var width = c('#width');
var height = c('#height');

// 3D试衣
var dress = c('#dress');
// 电话
var call = c('#call');
// 弹起的轮播图
// var detailPic = c('#detailPic');


// 菜头添加
// 色卡层蒙版层show&hide
var buy = c('#buy');
var mask = c('#mask');
var colorCard = c('#colorCard');
var cancel = c('#cancel');
var arrow = c('.arrow')[0];
var confirm = c('.confirm')[0];
// 采购登记data
var askPurchaseData= {
    colorId: '',
    phone: '',
    productId: '',
    purchaseNum: 1,
    purchaseType: 1,
    userName: ''
};
// 小图、标签点击对应的切换
var buyTypes = c('.card-buy-type')[0].getElementsByClassName('value');
var buyNumIpt = c('#buyNumIpt');
var typePrice = c('#typePrice');
var cardPrice = c('#cardPrice');
var buyNumIptTip = ['1片', '请输入大货数量', '请输入剪版数量'];
var typePriceTip = ['剪小样参考价:', '大货参考价:', '剪版参考价:'];
var cardPriceTip = [' 免费'];
var flowerColorsWrapper = c('.card-flower-color')[0].getElementsByClassName('value')[0];
var flowerColors = c('.card-flower-color')[0].getElementsByClassName('color-img');
var cardAvatar = c('#cardAvatar');
// 获取色卡层用户输入框信息
// var buyNumIpt = c('#buyNumIpt');前面已经定义过
var userNameIpt = c('#userNameIpt');
var phoneIpt = c('#phoneIpt');



(function() {

    // 获取详细工厂信息介绍
    getCompanyInfo({
        companyId
    }, function(res) {
        console.log('获取详细工厂信息', res);
        var data = res.data;
        companyMessage.setAttribute('company-id', data.id);
        if (data.companyHeadIcon) {
            avatar.src = data.companyHeadIcon;
        }
        if (data.companyType === 1) {
            tag.className = 'tag factory';
        } else if (data.companyType === 2) {
            tag.className = 'tag stalls';
        }
        companyName.innerHTML = data.companyName;
        localStorage.companyName = data.companyName;
        call.setAttribute('phone', data.phone);

        try {
            companyBusiness.innerHTML = '主营：' + data.companyExtendBO.companyBusiness ? data.companyExtendBO.companyBusiness : '';
        } catch (e) {
            console.log(e);
        }
        call.addEventListener('click', function() {
            var phone = this.getAttribute('phone');
            location.href = 'tel:' + phone;
        });

        // 厂家点击事件
        companyMessage.onclick = function() {
            var _companyId = this.getAttribute('company-id');
            // alert(_companyId);
            if (_companyId) {
                location.href = './index.html?companyId=' + _companyId;
            }
        };
    });
    // 获取产品信息
    getProduct({
        id: dataId
    }, function(res) {
        console.log('获取花型详情', res);
        var data = res.data;
        // cardPriceTip[2] = data.cutPrice;
        // cardPriceTip[2] = formateMoney(data.cutPrice, data.priceUnit);
        // var _picUrl = _formatPicUrl(data.defaultPicUrl);
        // 这里返回的图片是个字符串，并不是数组
        // picContainer.style.backgroundImage = 'url(' + _picUrl + ')';
        // detailPic.src = _picUrl;
        productNo.innerHTML = data.productNo;

        // 2017年8月1日14:30:14  大货价格
        price.innerHTML = formateMoney(data.price, data.priceUnit);
        // 2017年8月1日14:35:00  剪版价格
        cutPrice.innerHTML = formateMoney(data.cutPrice, data.priceUnit);

        viewNum.innerHTML = data.viewCount ? data.viewCount : 0;

        // 类型
        category.innerHTML = formateSupplyType(data.category);
        // 成分
        ingredient.innerHTML = data.ingredient;
        // 库存
        stock.innerHTML = (data.stock ? data.stock : '') + ' ' + formateUnit(data.stockUnit);
        // 货型
        shape.innerHTML = formateProduceShape(data.productShape);
        // 宽
        width.innerHTML = data.width;
        // 高
        height.innerHTML = data.height;

        dress.addEventListener('click', function() {
            location.href = './dress.html?url=' + data.defaultPicUrl;
        }, false);

        // 正常价格(大货价格)
        cardPriceTip.push(formateMoney(data.price, data.priceUnit));

        // 剪版价格
        cardPriceTip.push(formateMoney(data.cutPrice, data.priceUnit));

        getColorCardMethod();

    });
    /* eslint-disable no-new */
    // new Swiper('.swiper-container');

    // 2017年7月28日08:39:56
    // 产品 id 用于色卡操作
    //获取色卡信息
    function getColorCardMethod() {
        getColorCards({
            productId: dataId
        }, function(res) {
            console.log('获取色卡返回值', res);
            var data = res.data;
            var imgStr = '';
            var swiperStr = '';
            var picArr = [];
            var len = data.length;
            c('.total-number')[0].innerHTML = '/' + len;

            for (var i = 0; i < len; i++) {
                swiperStr += '<div class="swiper-slide" style="background-image: url(' + data[i].picUrl + ')" url="' + data[i].picUrl + '"></div>';
                imgStr += '<img class="color-img" src="' + data[i].picUrl + '" width="36" height="36">';
                picArr.push(data[i].picUrl);
            }
            c('.swiper-wrapper')[0].innerHTML = swiperStr;
            flowerColorsWrapper.innerHTML = imgStr;
            /* eslint-disable no-new */
            new Swiper('.swiper-container', {
                spaceBetween: 30,
                onSlideChangeEnd: function(swiper) {
                    console.log('activeIndex', swiper.activeIndex);
                    c('.active-number')[0].innerHTML = swiper.activeIndex + 1;
                }
            });
            var swiperItem = document.querySelectorAll('.swiper-slide');
            

            Array.prototype.forEach.call(swiperItem, function(item) {
                item.onclick = function() {
                    console.log(this.getAttribute('url'), picArr);
                    wx.previewImage({
                        current: this.getAttribute('url'),
                        urls: picArr
                    });
                };
            });
            // 小图、标签点击对应的切换
            for(var m = 0; m < flowerColors.length; m++){
                if( m === 0) {
                    // 设置原始值
                    flowerColors[0].className += ' active';
                    cardAvatar.setAttribute('src', data[0].picUrl);
                    askPurchaseData.colorId = data[0].id;
                    askPurchaseData.productId = data[0].productId;
                }
                flowerColors[m].index = m;
                flowerColors[m].onclick = function () {
                    for(var n = 0; n < flowerColors.length; n++){
                        flowerColors[n].className = flowerColors[n].className.replace(' active', '');
                    }
                    this.className += ' active';
                    cardAvatar.setAttribute('src', data[this.index].picUrl);
                    askPurchaseData.colorId = data[this.index].id;
                    askPurchaseData.productId = data[this.index].productId;
                };
            }

            for(var k = 0; k < buyTypes.length; k++) {
                buyTypes[k].index = k;
                cardPrice.innerHTML = cardPriceTip[0];
                buyTypes[k].onclick = function () {
                    for(var j = 0; j < buyTypes.length; j++){
                        buyTypes[j].className = buyTypes[j].className.replace(' active', '');
                    }
                    this.className += ' active';
                    askPurchaseData.purchaseType = this.index + 1;
                    buyNumIpt.value = '';
                    buyNumIpt.setAttribute('placeholder', buyNumIptTip[this.index]);
                    if(buyNumIpt.getAttribute('placeholder') === '1片'){
                        buyNumIpt.value = '1片';
                        buyNumIpt.readOnly = true;
                        askPurchaseData.purchaseNum = 1;
                    }else{
                        buyNumIpt.readOnly = false;
                        askPurchaseData.purchaseNum = '';
                    }
                    typePrice.innerHTML = typePriceTip[this.index] + '&nbsp;&nbsp;';
                    cardPrice.innerHTML = cardPriceTip[this.index];
                };
            }
        });
    }


    // 获取色卡层用户输入框信息
    buyNumIpt.oninput = function () {
        askPurchaseData.purchaseNum = parseFloat(this.value);
    };
    userNameIpt.oninput = function () {
        askPurchaseData.userName = this.value;
    };
    phoneIpt.oninput = function () {
        askPurchaseData.phone = this.value;
    };

        /** 电话*/
    function testTel(tel) {
        return /^1(3|4|5|7|8)[0-9]\d{8}$/.test(tel || '');
    }

    /**企业名字 */
    function testFirmName(str) {
        return /.{2,}/.test(str || '');
    }

    /**采购数量 */
    function testPurchaseNum(str) {
        return /\d{1,}/.test(str || '');
    }


    // 菜头修改
    // 色卡层蒙版层show&hide
    buy.onclick = function () {
        mask.style.display = 'block';
        colorCard.style.display = 'block';
        document.body.className = 'modal-open';
    };
    cancel.onclick = colorCardClose;
    arrow.onclick = colorCardClose;
    function colorCardClose() {
        mask.style.display = 'none';
        colorCard.style.display = 'none';
        document.body.className = '';
    }

    // 采购登记
    confirm.onclick = function () {
        console.log('色卡部分求购提交', askPurchaseData);
        var phoneIptSt = true;
        var userNameSt = true;
        var buyNumIptSt = true;
        if(testTel(askPurchaseData.phone)){
            phoneIpt.className = '';
            phoneIptSt = true;
        }else{
            phoneIpt.value = '';
            phoneIpt.className = 'invalid';
            phoneIptSt = false;
        }
        if(testFirmName(askPurchaseData.userName)){
            userNameIpt.className = '';
            userNameSt = true;
        }else{
            userNameIpt.value = '';
            userNameIpt.className = 'invalid';
            userNameSt = false;
        }
        if(testPurchaseNum(askPurchaseData.purchaseNum)){
            buyNumIpt.className = '';
            buyNumIptSt = true;
        }else{
            buyNumIpt.value = '';
            buyNumIpt.className = 'invalid';
            buyNumIptSt = false;
        }
        if(phoneIptSt&&userNameSt&&buyNumIptSt){
            askPurchase(askPurchaseData, function(res) {
                console.log('采购登记信息', res);
                if(!res.code) {
                    alert('采购登记成功！');
                    colorCardClose();
                }
            });
        }
    };

    // var activeNumber = document.getElementsByClassName('active-number')[0],
        // message = document.getElementsByClassName('message')[0],
        
        // 查看图片详情 swiper
        // pictureMask = document.getElementById('pictureMask'),
        // pics = document.querySelectorAll('#topSwiper .swiper-slide'),
        // swiperClose = document.querySelector('#pictureMask .close');
    
    /* eslint-disable no-new */
    // new Swiper('.swiper-container', {
    //     onSlideChangeEnd: function(swiper) {
    //         activeNumber.innerHTML = swiper.activeIndex + 1;
    //     }
    // });
    
    // swiperClose.addEventListener('click', function() { hideMask(pictureMask); }, false);

    // for (let i = 0; i < pics.length; i++) {
    //     (function(i) {
    //         pics[i].addEventListener('click', function() {
    //             pictureMask.style.display = 'block';
    //             /* eslint-disable no-new */
    //             new Swiper('#content', {
    //                 pagination: '.swiper-pagination',
    //                 paginationClickable: true
    //             });
                
    //         }, false);
    //     })(i);
    // }

    // function hideMask(mask) {
    //     mask.style.display = 'none';
    // }

    // function showMask(mask) {
    //     mask.style.display = 'block';
    // }
})();

