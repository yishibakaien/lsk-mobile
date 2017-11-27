require('common/styles/index.styl');
require('./change_phone_check.styl');
import Toast from 'plugins/toast/Toast';
import {
    c,
    getQueryString
} from 'utils/utils';

import {
    checkPasswd
}  from 'api/user';
var aes = require('plugins/aes/mode-ecb');

var confirmBtn = c('#confirmBtn');
var pwdIpt = c('#pwdIpt');
var data = {
    userPasswd: ''
};

confirmBtn.onclick = function () {
    data.userPasswd = aes(pwdIpt.value);
    Toast.loading();
    checkPasswd(data, function (res) {
        Toast.hide();
        console.log('校验密码返回值', res);
        if (res.data) {
            location.href = './change_phone_submit.html?tel=' + getQueryString('tel');
        } else {
            Toast.info('密码错误');
        }
    });
};