require('common/styles/index.styl');
require('./my_account.styl');
// import Toast from 'plugins/toast/Toast';
import {
    c
} from 'utils/utils';

import {
    getUserInfo
    // updateUser
}  from 'api/user';

(function () {
    var avatar = c('#avatar');
    var phoneNum = c('#phoneNum');
    getUserInfo({}, function(res) {
        var data = res.data;
        console.log('用户信息', res);
        if (res.data && data.userHeadIcon) {
            avatar.src = data.userHeadIcon + '?x-oss-process=image/auto-orient,1';
        }
        phoneNum.innerHTML = data.userMobile;
    });
})();