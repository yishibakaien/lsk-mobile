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
    getProductBuy
    // getCompanySupplyInfo
}  from 'api/user';

(function () {
    // var dataId = getQueryString('dataId');
    var dataId = 3327;
    var companyAvatar = c('#companyAvatar');
    var buyingDetailPic = c('#buyingDetailPic');
    var buyingType = c('#buyingType');
    var buyingNumber = c('#buyingNumber');
    var buyingTime = c('#buyingTime');
    var buyTaskCount = c('#buyTaskCount');
    var buyingPeople = c('#buyingPeople');
    getProductBuy({id: dataId}, function (res) {
        console.log('求购详情', res);
        var _picUrl = formatPicUrl(res.data.buyPicUrl);
        buyingDetailPic.style.backgroundImage =  `url(${_picUrl})`;
        buyingType.innerHTML = formatSupplyType(res.data.buyType) + '-' +   formatProduceShape(res.data.buyShape);
        buyingNumber.innerHTML = (res.data.buyNum ? res.data.buyNum + ' ' + formatUnit(res.data.buyUnit) : '面议');
        buyingTime.innerHTML = getDateDiff(res.data.createDate);
        buyingPeople.innerHTML = res.data.userName;
        companyAvatar.src = res.data.userHeadIcon;
        buyTaskCount.innerHTML = (res.data.buyTaskCount > 0 ? '已有 ' + res.data.buyTaskCount + ' 人接单' : '暂时无人接单');
        buyingDetailPic.onclick = function () {
            wx.previewImage({
                urls: [ _picUrl]
            });
        };
    });
})();