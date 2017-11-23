require('common/styles/index.styl');
require('./change_phone_submit.styl');
import Toast from 'plugins/toast/Toast';
import {
    c
} from 'utils/utils';
import {
    testTel
} from 'utils/reg';

import {
    getVerifyCode,
    changeMobile
}  from 'api/user';
var aes = require('plugins/aes/mode-ecb');

var phoneIpt = c('#phoneIpt');
var codeIpt = c('#codeIpt');
var getCode = c('#getCode');
var confirm = c('#confirm');



getCode.onclick = function () {
    if (testTelMethod()) {
        console.log('haha');
        getVerifyCode({}, function (res) {
            console.log('图形验证码', res);
        });
    }
};

// confirm.onclick = function () {
//     data.userPasswd = aes(pwdIpt.value);
//     Toast.loading();
//     checkPasswd(data, function (res) {
//         Toast.hide();
//         console.log('校验密码返回值', res);
//         if (res.data) {
//             location.href = '';
//         } else {
//             Toast.info('密码错误');
//         }
//     });
// };

function testTelMethod() {
    if (testTel(phoneIpt.value)) {
        return true;
    } else {
        Toast.info('手机号格式错误');
        return false;
    }
}