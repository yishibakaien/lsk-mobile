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
    formatPicUrl
} from 'utils/utils';

import {
    getProductBuy
    // getCompanySupplyInfo
}  from 'api/user';

// (function () {
//     var dataId = getQueryString('dataId');
//     var companyAvatar = c('#companyAvatar');
//     var supplyDetailPic = c('#supplyDetailPic');
//     var supplyType = c('#supplyType');
//     var supplyNumber = c('#supplyNumber');
//     var supplyTime = c('#supplyTime');
//     var supplyPeople = c('#supplyPeople');
//     getProductBuy({id: dataId}, function (res) {
//         console.log('求购详情', res);
//         var _picUrl = formatPicUrl(res.data.productPicUrl);
//         supplyDetailPic.style.backgroundImage =  `url(${_picUrl})`;
//         supplyType.innerHTML = formatSupplyType(res.data.supplyType);
//         supplyNumber.innerHTML = (res.data.supplyNum ? res.data.supplyNum + ' ' + formatUnit(res.data.supplyUnit) : '面议');
//         supplyNumber.innerHTML = (res.data.supplyNum ? res.data.supplyNum : 0) + ' ' + formatUnit(res.data.supplyUnit);
//         supplyTime.innerHTML = formatDate(res.data.createDate, 'yyyy-MM-dd');
//         supplyPeople.innerHTML = res.data.userName;
//         companyAvatar.src = res.data.userHeadIcon;
//         console.log('hahahaha');
//         supplyDetailPic.onclick = function () {
//             wx.previewImage({
//                 urls: [ _picUrl]
//             });
//         };
//     });
// })();