require('common/styles/index.styl');
require('./supply_detail.styl');

import wx from 'weixin-js-sdk';
import Toast from 'plugins/toast/Toast';

import {
    c,
    getQueryString,
    formatSupplyType,
    formatUnit,
    formatDate,
    formatPicUrl,
    formatSupplyShape,
    getDateDiff
} from 'utils/utils';

import {
    getCompanySupply,
    favoriteBus
    // getCompanyInfo
}  from 'api/user';


(function () {
    var dataId = getQueryString('dataId');
    var companyAvatar = c('#companyAvatar');
    var supplyDetailPic = c('#supplyDetailPic');
    var supplyType = c('#supplyType');
    var supplyNumber = c('#supplyNumber');
    var supplyTime = c('#supplyTime');
    var supplyPeople = c('#supplyPeople');
    // 收藏星星
    var collectStar = c('#collectStar');
    var collectWrapper = c('#collectWrapper');
    getCompanySupply({id: dataId}, function (res) {
        console.log('供应详情', res);
        var _picUrl = formatPicUrl(res.data.productPicUrl);
        supplyDetailPic.style.backgroundImage =  `url(${_picUrl})`;
        supplyType.innerHTML = formatSupplyType(res.data.supplyType) + '-' + formatSupplyShape(res.data.supplyShape);
        supplyNumber.innerHTML = (res.data.supplyNum ? res.data.supplyNum + ' ' + formatUnit(res.data.supplyUnit) : '面议');
        supplyTime.innerHTML = getDateDiff(res.data.createDate);
        supplyPeople.innerHTML = res.data.userName;
        companyAvatar.src = res.data.userHeadIcon;
        if (!(localStorage.userType === '1')) {
            collectWrapper.style.display = 'block';
        }
        supplyDetailPic.onclick = function () {
            wx.previewImage({
                urls: [ _picUrl]
            });
        };
        (res.data.isFavorite) ? (collectStar.className = 'icon-star-small active') : ('icon-star-small');
    });

    collectStar.onclick = function () {
        var that = this;
        favoriteBus({
            businessId: dataId,
            businessType: 3
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
})();