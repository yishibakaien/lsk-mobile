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
    formatPicUrl
} from 'utils/utils';

import {
    getCompanySupply,
    getCompanyInfo
}  from 'api/user';


(function () {
    var dataId = getQueryString('dataId');
    var companyAvatar = c('#companyAvatar');
    var supplyDetailPic = c('#supplyDetailPic');
    // 点击大图
    var _supplyDetailPic = c('#_supplyDetailPic');
    console.log(_supplyDetailPic);
    var supplyType = c('#supplyType');
    var supplyNumber = c('#supplyNumber');
    var supplyTime = c('#supplyTime');
    var supplyPeople = c('#supplyPeople');
    getCompanySupply({id: dataId}, function (res) {
        console.log('供应详情', res);
        var _picUrl = formatPicUrl(res.data.productPicUrl);
        supplyDetailPic.style.backgroundImage =  `url(${_picUrl})`;
        _supplyDetailPic.src = _picUrl;
        supplyType.innerHTML = formatSupplyType(res.data.supplyType);
        supplyNumber.innerHTML = (res.data.supplyNum ? res.data.supplyNum + ' ' + formatUnit(res.data.supplyUnit) : '面议');
        supplyNumber.innerHTML = (res.data.supplyNum ? res.data.supplyNum : 0) + ' ' + formatUnit(res.data.supplyUnit);
        supplyTime.innerHTML = formatDate(res.data.createDate, 'yyyy-MM-dd');
        supplyPeople.innerHTML = res.data.userName;
        companyAvatar.src = res.data.userHeadIcon;
        console.log('hahahaha');
    });
})();