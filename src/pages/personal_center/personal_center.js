require('common/styles/index.styl');
require('./personal_center.styl');

import Toast from 'plugins/toast/Toast';

import {
    c,
    formatPhone,
    getQueryString
} from 'utils/utils';

import {
    // testAccount,
    // testPwd,
    // testImgCode,
} from 'utils/reg';

import {
    checkPhone,
    getUserInfo
}  from 'api/user';


(function () {
    var userID = getQueryString();
    var avatar = c('#avatar');
    var username = c('#username');
    var phone = c('#phone');

    var avatarArrow = c('#avatarArrow');
    var going = c('#going');
    var complete = c('#complete');
    var close = c('#close');
    var myCollect = c('#myCollect');
    var manageAddress = c('#manageAddress');
    going.onclick = function() {
        location.href = './my_buying.html?swiperIndex=0';
    };
    complete.onclick = function() {
        location.href = './my_buying.html?swiperIndex=1';
    };
    close.onclick = function() {
        location.href = './my_buying.html?swiperIndex=2';
    };

    myCollect.onclick = function() {
        location.href = './my_collection.html';
    };
    manageAddress.onclick = function() {
        location.href = './edit_address.html';
    };

})();

getUserInfo({}, function(res) {
    console.log('获取用户信息', res);
    if (res.data.userHeadIcon) {
        avatar.src = res.data.userHeadIcon;
    }
    username.innerHTML = res.data.userName;
    phone.innerHTML = formatPhone(res.data.userMobile);

}, function(res) {});

console.log(checkPhone);
checkPhone({
    mobile: '18650470415'
}, function(res) {
    console.log(res);
});