require('common/styles/index.styl');
require('./pattern_detail.styl');
require('plugins/swiper/swiper-3.4.2.min.js');
import wx from 'weixin-js-sdk';
import Toast from 'plugins/toast/Toast';

import {
    // 获取公司信息(详细)
    getCompanyInfo,
    // 获取花型详情
    getProduct,
    // 获取色卡
    getColorCards,
    // 采购登记
    askPurchase,
    // 收藏或取消
    favoriteBus
} from 'api/user';

import {
    testTel,
    testPurchaseNum,
    testFirmName
} from 'utils/reg';

import {
    c,
    formatMoney,
    getQueryString,
    // formatProduceShape,
    formatSupplyType,
    formatUnit,
    encrypto
    // _formatPicUrl
} from 'utils/utils';


(function () {
    // 返回上一页刷新页面
    if (window.name != 'bencalie'){
        location.reload();
        window.name = 'bencalie';
    } else {
        window.name = '';
    }

    var dataId = getQueryString('dataId');
    var companyId;
// var companyId = getQueryString('companyId');
// 轮播图盒子
// var picContainer = c('#picContainer');
    var productNo = c('#productNo');
    var price = c('#price');
    var cutPrice = c('#cutPrice');

// 公司信息
    var companyMessage = c('#companyMessage');
    var avatar = c('#avatar');
// var tag = c('#tag');
    var viewNum = c('#viewNum');
    var companyName = c('#companyName');
    var companyBusiness = c('#companyBusiness');
    var address = c('#address');
    var messageColorCard = c('#messageColorCard');

// 花型参数
    var category = c('#category');
    var ingredient = c('#ingredient');
    var stock = c('#stock');
// var shape = c('#shape');
    var width = c('#width');
    var height = c('#height');

// 3D试衣
    var dress = c('#dress');
// 电话
    var call = c('#call');
// 弹起的轮播图
// var detailPic = c('#detailPic');
// 收藏按钮
    var collectStar = c('#collectStar');
// 是否上架蕾丝控收藏星星
    var collectWrapper = c('#collectWrapper');


// 色卡层蒙版层show&hide
    var buy = c('#buy');
    var mask = c('#mask');
    var colorCard = c('#colorCard');
    var cancel = c('#cancel');
    var arrow = c('#arrow');
    var confirm = c('#confirm');
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
    var buyTypes = c('#buyType').getElementsByClassName('value');
    var referPriceName = c('#referPriceName');
    var referPriceValue = c('#referPriceValue');
    var buyNumIptTip = ['1片', '请输入大货数量', '请输入剪版数量'];
    var referPriceNameArr = ['剪小样参考价:', '大货参考价:', '剪版参考价:'];
    var referPriceValueArr = [' 免费'];
    var patternColorWrapper = c('#patternColorWrapper');
    var cardAvatar = c('#cardAvatar');
    var buyNumIpt = c('#buyNumIpt');
    var userNameIpt = c('#userNameIpt');
    var phoneIpt = c('#phoneIpt');

    // 获取详细工厂信息介绍
    function getCompanyMethod() {
        getCompanyInfo({
            companyId
        }, function (res) {
            console.log('获取详细工厂信息', res);
            var data = res.data;
            companyMessage.setAttribute('company-id', data.id);
            if (data.companyHeadIcon) {
                avatar.src = data.companyHeadIcon;
            }
            // if (data.companyType === 1) {
            //     tag.className = 'tag factory';
            // } else if (data.companyType === 2) {
            //     tag.className = 'tag stalls';
            // }
            companyName.innerHTML = data.companyName;
            address.innerHTML = data.address;
            localStorage.companyName = data.companyName;
            call.setAttribute('phone', data.phone);

            try {
                companyBusiness.innerHTML = '主营：' + data.companyExtendBO.companyBusiness ? data.companyExtendBO.companyBusiness : '';
            } catch (e) {
                console.log(e);
            }
            call.addEventListener('click', function () {
                var phone = this.getAttribute('phone');
                location.href = 'tel:' + phone;
            });

            // 厂家点击事件
            companyMessage.onclick = function () {
                // var _companyId = this.getAttribute('company-id');

                // alert(_companyId);
                if (data.indexName) {
                    location.href = './dist/index.html?companyId=' + data.id;
                    // location.href = './dist/index.html?companyId=' + data.id + '&from=lsk&x-token=' + encrypto(localStorage['x-token']);
                    // location.href = 'http://192.168.0.110:80?companyId=' + data.id + '&from=lsk&x-token=' + encrypto(localStorage['x-token']);
                    // location.href = 'https://www.ts57.cn/microWebsite/index.html?companyId=' + data.id;
                    // location.href = 'http://' + data.indexName + '.lacewang.cn';
                }
            };
        });
    }

    // 获取产品信息
    getProduct({
        id: dataId
    }, function (res) {
        console.log('获取花型详情', res);
        var data = res.data;
        companyId = data.companyId;
        (data.isFavorite) ? (collectStar.className = 'icon-star-small active') : ('icon-star-small');
        // collectWrapper.style.display = 'block';
        collectWrapper.style.display = (data.isShelve ? 'block' : 'none');
        companyMessage.style.display = (data.isShelve ? 'flex' : 'none');

        if (data.isFavorite) {
            collectWrapper.style.display = 'block';
            companyMessage.style.display = 'flex';
        }



        // referPriceValueArr[2] = data.cutPrice;
        // referPriceValueArr[2] = formatMoney(data.cutPrice, data.priceUnit);
        // var _picUrl = _formatPicUrl(data.defaultPicUrl);
        // 这里返回的图片是个字符串，并不是数组
        // picContainer.style.backgroundImage = 'url(' + _picUrl + ')';
        // detailPic.src = _picUrl;
        productNo.innerHTML = data.productNo;

        // 2017年8月1日14:30:14  大货价格
        price.innerHTML = formatMoney(data.price, data.priceUnit);
        // 2017年8月1日14:35:00  剪版价格
        cutPrice.innerHTML = formatMoney(data.cutPrice, data.priceUnit);

        viewNum.innerHTML = data.viewCount ? data.viewCount : 0;

        // 类型
        category.innerHTML = formatSupplyType(data.category);
        // 成分
        ingredient.innerHTML = data.ingredient;
        // 库存
        stock.innerHTML = (data.stock ? data.stock : '') + ' ' + formatUnit(data.stockUnit);
        // 货型
        // shape.innerHTML = formatProduceShape(data.productShape);
        // 宽
        width.innerHTML = data.width;
        // 高
        height.innerHTML = data.height;

        // 正常价格(大货价格)
        referPriceValueArr.push(formatMoney(data.price, data.priceUnit));

        // 剪版价格
        referPriceValueArr.push(formatMoney(data.cutPrice, data.priceUnit));

        getColorCardMethod();
        getCompanyMethod();

    });
    /* eslint-disable no-new */
    // new Swiper('.swiper-container');

    // 2017年7月28日08:39:56
    // 产品 id 用于色卡操作
    //获取色卡信息
    function getColorCardMethod() {
        getColorCards({
            productId: dataId
        }, function (res) {
            console.log('获取色卡返回值', res);
            var data = res.data;
            var imgStr = '';
            var swiperStr = '';
            var picArr = [];
            var len = data.length;
            c('.total-number')[0].innerHTML = '/' + len;
            // 设置默认试衣图片 @author lyb 2017-11-27 16:36:49
            dress.setAttribute('pic-url', data[0].picUrl);
            
            for (var i = 0; i < len; i++) {
                swiperStr += '<div class="swiper-slide" style="background-image: url(' + data[i].picUrl + ')" url="' + data[i].picUrl + '"></div>';
                imgStr += '<img src="' + data[i].picUrl + '">';
                picArr.push(data[i].picUrl);
            }
            c('.swiper-wrapper')[0].innerHTML = swiperStr;
            patternColorWrapper.innerHTML = imgStr;
            messageColorCard.innerHTML = imgStr;
            var swiper = new Swiper('.swiper-container', {
                spaceBetween: 30,
                onSlideChangeEnd: function (swiper) {
                    console.log('activeIndex', swiper.activeIndex);
                    c('.active-number')[0].innerHTML = swiper.activeIndex + 1;
                    for (var t = 0; t < messagePatternColors.length; t++){
                        messagePatternColors[t].className = messagePatternColors[t].className.replace(' active', '');
                    }
                    messagePatternColors[swiper.activeIndex].className = ' active';
                }
            });
            var swiperItem = document.querySelectorAll('.swiper-slide');
            Array.prototype.forEach.call(swiperItem, function (item) {
                item.onclick = function () {
                    console.log(this.getAttribute('url'), picArr);
                    wx.previewImage({
                        current: this.getAttribute('url'),
                        urls: picArr
                    });
                };
            });
            // 非色卡层色卡点击大图切换
            var messagePatternColors = messageColorCard.getElementsByTagName('img');
            for(var j = 0; j < messagePatternColors.length; j++){
                if ( j === 0) {
                    // 设置原始值
                    messagePatternColors[0].className += ' active';
                    cardAvatar.setAttribute('src', data[0].picUrl);
                }
                messagePatternColors[j].index = j;
                messagePatternColors[j].onclick = function () {
                    for (var y = 0; y < messagePatternColors.length; y++){
                        messagePatternColors[y].className = messagePatternColors[y].className.replace(' active', '');
                    }
                    this.className += ' active';
                    cardAvatar.setAttribute('src', data[this.index].picUrl);
                    swiper.slideTo(this.index);
                    // 3d试衣记录色卡图片地址 @author lyb 2017-11-27 16:27:18
                    dress.setAttribute('pic-url', data[this.index].picUrl);
                };
            }

            // 小图、标签点击对应的切换&传值
            var patternColors = patternColorWrapper.getElementsByTagName('img');
            for(var m = 0; m < patternColors.length; m++){
                if ( m === 0) {
                    // 设置原始值
                    patternColors[0].className += ' active';
                    cardAvatar.setAttribute('src', data[0].picUrl);
                    askPurchaseData.colorId = data[0].id;
                    askPurchaseData.productId = data[0].productId;
                }
                patternColors[m].index = m;
                patternColors[m].onclick = function () {
                    for (var n = 0; n < patternColors.length; n++){
                        patternColors[n].className = patternColors[n].className.replace(' active', '');
                    }
                    this.className += ' active';
                    cardAvatar.setAttribute('src', data[this.index].picUrl);
                    askPurchaseData.colorId = data[this.index].id;
                    askPurchaseData.productId = data[this.index].productId;
                };
            }

            for (var k = 0; k < buyTypes.length; k++) {
                buyTypes[k].index = k;
                referPriceValue.innerHTML = referPriceValueArr[0];
                buyTypes[k].onclick = function () {
                    for (var j = 0; j < buyTypes.length; j++){
                        buyTypes[j].className = buyTypes[j].className.replace(' active', '');
                    }
                    this.className += ' active';
                    askPurchaseData.purchaseType = this.index + 1;
                    buyNumIpt.value = '';
                    buyNumIpt.setAttribute('placeholder', buyNumIptTip[this.index]);
                    if (buyNumIpt.getAttribute('placeholder') === '1片'){
                        buyNumIpt.value = '1片';
                        buyNumIpt.readOnly = true;
                        askPurchaseData.purchaseNum = 1;
                    } else {
                        buyNumIpt.readOnly = false;
                        askPurchaseData.purchaseNum = '';
                    }
                    referPriceName.innerHTML = referPriceNameArr[this.index] + '&nbsp;&nbsp;';
                    referPriceValue.innerHTML = referPriceValueArr[this.index];
                };
            }

            dress.addEventListener('click', function () {
                // location.href = 'https://www.ts57.cn/share/dress.html?companyId=' + data.companyId + '&url=' + data.defaultPicUrl + '&from=lace';
                // @author lyb 2017-11-27 16:28:50
                // location.href = 'https://www.ts57.cn/share/dress.html?companyId=' + data[0].companyId + '&url=' + this.getAttribute('pic-url') + '&time=' + new Date().getTime();
                location.href = './dist/dress.html?companyId=' + data[0].companyId + '&url=' + this.getAttribute('pic-url');
            }, false);
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
        if (testTel(askPurchaseData.phone)){
            phoneIpt.className = '';
            phoneIptSt = true;
        } else {
            phoneIpt.value = '';
            phoneIpt.className = 'invalid';
            phoneIptSt = false;
        }
        if (testFirmName(askPurchaseData.userName)){
            userNameIpt.className = '';
            userNameSt = true;
        } else {
            userNameIpt.value = '';
            userNameIpt.className = 'invalid';
            userNameSt = false;
        }
        if (testPurchaseNum(askPurchaseData.purchaseNum)){
            buyNumIpt.className = '';
            buyNumIptSt = true;
        } else {
            buyNumIpt.value = '';
            buyNumIpt.className = 'invalid';
            buyNumIptSt = false;
        }
        if (phoneIptSt && userNameSt && buyNumIptSt){
            askPurchase(askPurchaseData, function (res) {
                console.log('采购登记信息', res);
                if (!res.code) {
                    alert('采购登记成功！');
                    colorCardClose();
                    location.reload();
                }
            });
        }
    };
    // 收藏&取消星星
    collectStar.onclick = function () {
        var that = this;
        favoriteBus({
            businessId: dataId,
            businessType: 1
        }, function (res) {
            console.log('收藏或取消', res);
            if (res.code === 0) {
                Toast.success(res.message, 1000);
                if (res.message === '收藏成功') {
                    that.className = 'icon-star-small active';

                } else {
                    that.className = 'icon-star-small';
                }
            } else {
                Toast.info(res.message, 1000);
            }
        });
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

