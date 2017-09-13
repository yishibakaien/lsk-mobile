require('common/styles/index.styl');
require('./personal_center.styl');

import Toast from 'plugins/toast/Toast';

import {
    c,
    getQueryString
} from 'utils/utils';

import {
    // testAccount,
    // testPwd,
    // testImgCode,
} from 'utils/reg';

import {
    checkPhone
}  from 'api/user';


(function () {
    var userID = getQueryString();
    var avatar = c('#avatar');
    var avatarArrow = c('#avatarArrow');
    var going = c('#going');
    var complete = c('#complete');
    var close = c('#close');
    var myCollect = c('#myCollect');
    var manageAddress = c('#manageAddress');
    myCollect.onclick = function() {
        location.href = './my_collection.html';
    };
    manageAddress.onclick = function() {
        location.href = './edit_address.html';
    };
})();


console.log(checkPhone);
checkPhone({
    mobile: '18650470415'
}, function(res) {
    console.log(res);
});