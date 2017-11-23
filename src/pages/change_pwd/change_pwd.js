require('common/styles/index.styl');
require('./change_pwd.styl');

import Toast from 'plugins/toast/Toast';
import {
    c
} from 'utils/utils';

import {
    restPasswd
}  from 'api/user';
var aes = require('plugins/aes/mode-ecb');
var oringinPwd = c('#oringinPwd');
var newPwd = c('#newPwd');
var newPwdConfirm = c('#newPwdConfirm');
var confirmBtn = c('#confirmBtn');
var data = {
    userPasswd: '',
    newPasswd: ''
};
confirmBtn.onclick = function () {
    Toast.loading();
    if (pwdCheckMethod()) {
        data.userPasswd = aes(oringinPwd.value);
        data.newPasswd = aes(newPwd.value);
        restPasswd(data, function (res) {
            console.log('密码修改返回值', res);
            Toast.hide();
            if (res.code === 0) {
                Toast.success({
                    text: res.message,
                    duration: 1200,
                    complete: function() {
                        location.href = './personal_center.html';
                    }
                });
            } else {
                Toast.info(res.message);
            }
        });
    }
};

function pwdCheckMethod() {
    if (!oringinPwd.value) {
        Toast.info('请输入原密码');
        return false;
    }
    if (!newPwd.value) {
        Toast.info('请输入新密码');
        return false;
    }
    if (!newPwdConfirm.value) {
        Toast.info('请输入确认密码');
        return false;
    }
    if (newPwd.value !== newPwdConfirm.value) {
        Toast.info('两次输入的密码不一致');
        newPwd.value = '';
        newPwdConfirm.value = '';
        return false;
    }
    if (newPwd.value && newPwdConfirm.value && oringinPwd.value && newPwd.value === newPwdConfirm.value) {
        return true;
    }
}
