require('common/styles/index.styl');
require('./purchase_detail.styl');

import wx from 'weixin-js-sdk';
import Toast from 'plugins/toast/Toast';

import {
    c,
    getQueryString,
    formatSupplyType,
    formatUnit,
    formatDate,
    formatPicUrl,
    formatProduceShape,
    getDateDiff
} from 'utils/utils';

import {
    getProductBuy,
    closeProductBuy
    // getCompanySupplyInfo
}  from 'api/user';

(function () {
    var dataId = getQueryString('dataId');
    console.log('dataId', dataId);
    // var dataId = 3327;
    var companyAvatar = c('#companyAvatar');
    var buyingDetailPic = c('#buyingDetailPic');
    var buyingType = c('#buyingType');
    var buyingNumber = c('#buyingNumber');
    var buyingTime = c('#buyingTime');
    var buyTaskCount = c('#buyTaskCount');
    var buyingPeople = c('#buyingPeople');
    var closeBuying = c('#closeBuying');
    var btnWrapper = c('#btnWrapper');
    var foot = c('#foot');

    var closeBuyData = {
        buyCloseDesc: '',
        id: ''
    };
    getProductBuy({id: dataId}, function (res) {
        console.log('求购详情', res);
        console.log('storage-userId', localStorage.userId);
        closeBuyData.id = res.data.id;
        var _picUrl = formatPicUrl(res.data.buyPicUrl);
        buyingDetailPic.style.backgroundImage =  `url(${_picUrl})`;
        buyingType.innerHTML = formatSupplyType(res.data.buyType) + '-' +   formatProduceShape(res.data.buyShape);
        buyingNumber.innerHTML = (res.data.buyNum ? res.data.buyNum + ' ' + formatUnit(res.data.buyUnit) : '面议');
        buyingTime.innerHTML = getDateDiff(res.data.createDate);
        buyingPeople.innerHTML = res.data.userName;
        companyAvatar.src = res.data.userHeadIcon;
        buyTaskCount.innerHTML = (res.data.buyTaskCount > 0 ? '已有 ' + res.data.buyTaskCount + ' 人接单' : '暂时无人接单');

        if (localStorage.userId && (parseInt(localStorage.userId) === res.data.userId)) {
            btnWrapper.style.display = 'block';
        } else {
            foot.style.display = 'block';
        }

        buyingDetailPic.onclick = function () {
            wx.previewImage({
                urls: [ _picUrl]
            });
        };
        closeBuying.onclick = function () {
            console.log(closeBuyData);
            var reconfirm = confirm('确认关闭？');
            if (reconfirm) {
                closeProductBuy(closeBuyData, function (res) {
                    console.log('关闭求购', res);
                    if (res.code === 0) {
                        Toast.success({
                            text: res.message,
                            duration: 1000,
                            complete: function() {
                                if (getQueryString('from')) {
                                    var url = getQueryString('from');
                                    location.replace(url);
                                } else {
                                    location.replace('./shouye.html');
                                }
                            }
                        });
                    }
                });
            }
        };

    });
})();